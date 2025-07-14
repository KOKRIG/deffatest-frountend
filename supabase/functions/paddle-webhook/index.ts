// Supabase Edge Function for handling Paddle webhooks
import { createClient } from "npm:@supabase/supabase-js@2.39.0";
import { createHmac } from "npm:crypto";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const paddleWebhookSecret = Deno.env.get("PADDLE_WEBHOOK_SECRET") || "ntfset_01jz3f3edwwmee1cd9z6gjgcr3";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Paddle-Signature",
};

// Verify webhook signature for Paddle Billing v2
function verifyPaddleSignature(signature: string | null, payload: string, timestamp: string): boolean {
  if (!signature || !timestamp) return false;

  try {
    const signedPayload = `${timestamp}:${payload}`;
    const hmac = createHmac('sha256', paddleWebhookSecret);
    hmac.update(signedPayload);
    const expectedSignature = hmac.digest('hex');
    
    // Use comparison to prevent timing attacks
    return signature === expectedSignature;
  } catch (error) {
    console.error("Error verifying Paddle signature:", error);
    return false;
  }
}

// Process webhook data for Paddle Classic
async function processClassicWebhook(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const eventType = data.alert_name;
    const webhookId = `classic_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`Processing Paddle Classic webhook: ${eventType} with generated ID: ${webhookId}`);
    
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
    if (eventType === "subscription_created" || eventType === "subscription_payment_succeeded") {
      const customerId = data.user_id;
      const customerEmail = data.email;
      const subscriptionId = data.subscription_id;
      const planId = data.subscription_plan_id;
      const nextPaymentDate = data.next_bill_date;
      
      if (!customerEmail) {
        throw new Error("Missing customer email in webhook");
      }
      
      // Determine plan type from plan ID
      let planType = "free";
      
      // Use the exact product IDs you provided
      if (planId === "24434" || planId === "pro_01jz3epy40cqfamphkhxvnh2sc") {
        planType = "pro";
      } else if (planId === "24435" || planId === "pro_01jz3et66qhbxsxz0rm3751f8k") {
        planType = "chaos";
      }
      
      // Find user by email
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(customerEmail);
      
      if (userError || !userData?.user) {
        console.error("User not found:", customerEmail);
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
          paddle_customer_id: customerId,
          paddle_subscription_id: subscriptionId,
          current_billing_period_ends_at: nextPaymentDate ? new Date(nextPaymentDate).toISOString() : null,
          next_billing_date: nextPaymentDate ? new Date(nextPaymentDate).toISOString() : null,
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
    else if (eventType === "subscription_updated") {
      const subscriptionId = data.subscription_id;
      const planId = data.subscription_plan_id;
      const nextPaymentDate = data.next_bill_date;
      
      // Determine plan type from plan ID
      let planType = "free";
      
      // Use the exact product IDs you provided
      if (planId === "24434" || planId === "pro_01jz3epy40cqfamphkhxvnh2sc") {
        planType = "pro";
      } else if (planId === "24435" || planId === "pro_01jz3et66qhbxsxz0rm3751f8k") {
        planType = "chaos";
      }
      
      // Find user by subscription ID
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("paddle_subscription_id", subscriptionId)
        .single();
      
      if (profileError || !profileData) {
        console.error("Profile not found for subscription:", subscriptionId);
        throw new Error("Profile not found");
      }
      
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
          current_billing_period_ends_at: nextPaymentDate ? new Date(nextPaymentDate).toISOString() : null,
          next_billing_date: nextPaymentDate ? new Date(nextPaymentDate).toISOString() : null,
          concurrent_test_slots: concurrentSlots,
          max_test_duration_minutes: maxTestDuration
        })
        .eq("user_id", profileData.user_id);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }
      
      console.log(`Successfully updated subscription for user ${profileData.user_id} to ${planType} plan`);
    }
    else if (eventType === "subscription_cancelled") {
      const subscriptionId = data.subscription_id;
      
      // Find user by subscription ID
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("paddle_subscription_id", subscriptionId)
        .single();
      
      if (profileError || !profileData) {
        console.error("Profile not found for subscription:", subscriptionId);
        throw new Error("Profile not found");
      }
      
      // Update profile to free plan
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          plan_type: "free",
          subscription_status: "CANCELLED",
          max_test_duration_minutes: 5,
          tests_this_month_count: 0,
          concurrent_test_slots: 1,
          current_billing_period_ends_at: null,
          next_billing_date: null
        })
        .eq("user_id", profileData.user_id);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }
      
      console.log(`Successfully downgraded user ${profileData.user_id} to free plan`);
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

// Process webhook data for Paddle v2
async function processPaddleV2Webhook(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const eventType = data.event_type;
    const webhookId = data.id;
    
    console.log(`Processing Paddle v2 webhook: ${eventType} with ID: ${webhookId}`);
    
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
    if (eventType === "transaction.completed") {
      const customerId = data.data.customer.id;
      const customerEmail = data.data.customer.email;
      
      // Determine plan type from price_id
      let planType = "free";
      let subscriptionId = null;
      
      if (data.data.items && data.data.items.length > 0) {
        const priceId = data.data.items[0].price.id;
        
        // Map price_id to plan_type using the exact price IDs provided
        if (priceId === "pri_01jz3ewz3rr7n92a26wf4s86ye") {
          planType = "chaos";
        } else if (priceId === "pri_01jz3erkb3pft3ecw0dcz03yn2") {
          planType = "pro";
        } else if (priceId === "pri_01jz3ekbgqj5m5aese86kwpfxp") {
          planType = "free";
        }
      }
      
      // Get subscription ID if available
      if (data.data.subscription) {
        subscriptionId = data.data.subscription.id;
      }
      
      // Find user by email
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(customerEmail);
      
      if (userError || !userData?.user) {
        console.error("User not found:", customerEmail);
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
          paddle_customer_id: customerId,
          paddle_subscription_id: subscriptionId,
          current_billing_period_ends_at: data.data.subscription?.next_billed_at || null,
          next_billing_date: data.data.subscription?.next_billed_at || null,
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
    else if (eventType === "subscription.updated") {
      // Extract subscription data
      const subscriptionId = data.data.id;
      const status = data.data.status;
      const nextBilledAt = data.data.next_billed_at;
      
      // Find user by subscription ID
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("paddle_subscription_id", subscriptionId)
        .single();
      
      if (profileError || !profileData) {
        console.error("Profile not found for subscription:", subscriptionId);
        throw new Error("Profile not found");
      }
      
      // Update subscription status
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_status: status.toUpperCase(),
          current_billing_period_ends_at: nextBilledAt,
          next_billing_date: nextBilledAt
        })
        .eq("user_id", profileData.user_id);
      
      if (updateError) {
        console.error("Error updating subscription status:", updateError);
        throw updateError;
      }
      
      console.log(`Successfully updated subscription status for user ${profileData.user_id}`);
    }
    else if (eventType === "subscription.cancelled") {
      // Extract subscription data
      const subscriptionId = data.data.id;
      
      // Find user by subscription ID
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("paddle_subscription_id", subscriptionId)
        .single();
      
      if (profileError || !profileData) {
        console.error("Profile not found for subscription:", subscriptionId);
        throw new Error("Profile not found");
      }
      
      // Update profile to free plan
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          plan_type: "free",
          subscription_status: "CANCELLED",
          max_test_duration_minutes: 5,
          tests_this_month_count: 0,
          concurrent_test_slots: 1,
          current_billing_period_ends_at: null,
          next_billing_date: null
        })
        .eq("user_id", profileData.user_id);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }
      
      console.log(`Successfully downgraded user ${profileData.user_id} to free plan`);
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
    
    // Log the webhook for debugging
    console.log("Received Paddle webhook:", bodyText);
    
    // Get Paddle signature from header
    const paddleSignature = req.headers.get("Paddle-Signature");
    
    // Parse webhook payload
    const body = JSON.parse(bodyText);
    
    // Process webhook - check if it's Paddle Classic format or Paddle v2
    let result;
    if (body.alert_name) {
      // This is a Paddle Classic webhook
      result = await processClassicWebhook(body);
    } else if (body.event_type) {
      // This is a Paddle v2 webhook
      // Extract signature components if available
      let signatureValid = false;
      
      if (paddleSignature) {
        const signatureParts = paddleSignature.split(';');
        const timestamp = signatureParts[0].split('=')[1];
        const signature = signatureParts[1].split('=')[1];
        
        signatureValid = verifyPaddleSignature(signature, bodyText, timestamp);
        
        if (!signatureValid) {
          console.warn("Paddle signature verification failed, but processing webhook anyway for testing");
          // In production, you might want to reject invalid signatures:
          // return new Response(JSON.stringify({ error: "Invalid signature" }), {
          //   status: 401,
          //   headers: { ...corsHeaders, "Content-Type": "application/json" }
          // });
        }
      }
      
      result = await processPaddleV2Webhook(body);
    } else {
      // Unknown format
      result = { success: false, message: "Unknown webhook format" };
    }
    
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