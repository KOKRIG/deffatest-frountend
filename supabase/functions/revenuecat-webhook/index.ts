// Supabase Edge Function for handling RevenueCat webhooks
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const revenueCatWebhookSecret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET") || "your_webhook_secret_here";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-RevenueCat-Signature",
};

// Verify RevenueCat webhook signature
function verifyRevenueCatSignature(signature: string | null, payload: string): boolean {
  if (!signature) return false;

  try {
    // In production, implement proper HMAC validation here
    // For now, we'll just check if the signature exists
    return true;
  } catch (error) {
    console.error("Error verifying RevenueCat signature:", error);
    return false;
  }
}

// Map RevenueCat product ID to plan type
function getPlanTypeFromProductId(productId: string): string {
  const productMapping: Record<string, string> = {
    "deffatest_free": "free",
    "deffatest_pro_monthly": "pro",
    "deffatest_chaos_monthly": "chaos"
  };
  
  return productMapping[productId] || "free";
}

// Process webhook data
async function processWebhook(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const eventType = data.type;
    const webhookId = data.id || `rc_${Date.now()}`;
    
    console.log(`Processing webhook: ${eventType} with ID: ${webhookId}`);
    
    // Check if webhook has already been processed (idempotency)
    const { data: existingWebhook } = await supabase
      .from("processed_webhooks")
      .select("id")
      .eq("id", webhookId)
      .single();
    
    if (existingWebhook) {
      console.log("Webhook already processed");
      return { success: true, message: "Webhook already processed" };
    }
    
    // Handle different webhook events
    if (eventType === "INITIAL_PURCHASE" || eventType === "RENEWAL" || eventType === "PRODUCT_CHANGE") {
      const appUserId = data.app_user_id;
      const productId = data.product_id;
      const expiresAt = data.expires_date_ms ? new Date(data.expires_date_ms) : null;
      
      if (!appUserId || !productId) {
        throw new Error("Missing app_user_id or product_id in transaction");
      }
      
      const planType = getPlanTypeFromProductId(productId);
      
      // Find user by RevenueCat app_user_id (which should be the Supabase user ID)
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(appUserId);
      
      if (userError || !userData?.user) {
        console.error("User not found:", appUserId);
        throw new Error("User not found");
      }
      
      const userId = userData.user.id;
      
      // Determine plan details
      let concurrentSlots = 1;
      let maxTestDuration = 5;
      
      if (planType === "pro") {
        concurrentSlots = 4;
        maxTestDuration = 120;
      } else if (planType === "chaos") {
        concurrentSlots = 8;
        maxTestDuration = 360;
      }
      
      // Update user profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          plan_type: planType,
          subscription_status: "ACTIVE",
          current_billing_period_ends_at: expiresAt,
          concurrent_test_slots: concurrentSlots,
          max_test_duration_minutes: maxTestDuration,
          tests_this_month_count: 0,
          last_monthly_reset_date: new Date().toISOString().split("T")[0]
        })
        .eq("user_id", userId);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }
      
      console.log(`Successfully upgraded user ${userId} to ${planType} plan`);
    }
    else if (eventType === "CANCELLATION" || eventType === "EXPIRATION") {
      const appUserId = data.app_user_id;
      
      if (!appUserId) {
        throw new Error("Missing app_user_id in cancellation");
      }
      
      // Find user by RevenueCat app_user_id
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(appUserId);
      
      if (userError || !userData?.user) {
        console.error("User not found:", appUserId);
        throw new Error("User not found");
      }
      
      const userId = userData.user.id;
      
      // Update profile to free plan
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          plan_type: "free",
          subscription_status: "CANCELLED",
          max_test_duration_minutes: 5,
          concurrent_test_slots: 1,
          current_billing_period_ends_at: null
        })
        .eq("user_id", userId);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }
      
      console.log(`Successfully downgraded user ${userId} to free plan`);
    }
    
    // Record webhook as processed
    await supabase
      .from("processed_webhooks")
      .insert({
        id: webhookId,
        event_type: eventType,
        status: "success"
      });
    
    return { success: true, message: "Webhook processed successfully" };
  } catch (error) {
    console.error("Error processing webhook:", error);
    return { success: false, message: error.message || "Error processing webhook" };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    // Get the raw request body
    const bodyText = await req.text();
    
    // Verify RevenueCat signature
    const signature = req.headers.get("X-RevenueCat-Signature");
    const isValid = verifyRevenueCatSignature(signature, bodyText);
    
    if (!isValid) {
      console.log("Invalid signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Parse webhook payload
    const body = JSON.parse(bodyText);
    console.log("Received webhook:", JSON.stringify(body, null, 2));
    
    // Process webhook
    const result = await processWebhook(body);
    
    // Return response
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});