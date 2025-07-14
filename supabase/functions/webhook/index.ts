// Supabase Edge Function for handling Paddle webhooks
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const paddleWebhookSecret = Deno.env.get("PADDLE_WEBHOOK_SECRET") || "pdl_ntfset_01jys34h8b9r0g1k95e704ye5a_dCSyjFroDsmbns3buLPh29cpkYiX01RN";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify Paddle webhook signature
async function verifyPaddleSignature(request: Request): Promise<boolean> {
  try {
    const signature = request.headers.get("Paddle-Signature");
    if (!signature) return false;

    // Parse the signature header
    const parts = signature.split(";");
    const timestamp = parts[0].split("=")[1];
    const hmacSignature = parts[1].split("=")[1];

    // Get the raw request body
    const rawBody = await request.text();
    
    // Create the signed payload
    const signedPayload = `${timestamp}:${rawBody}`;
    
    // Compute the HMAC
    const key = new TextEncoder().encode(paddleWebhookSecret);
    const message = new TextEncoder().encode(signedPayload);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    
    const signature = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      message
    );
    
    const computedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    
    // Compare signatures (timing-safe comparison would be better in production)
    return computedSignature === hmacSignature;
  } catch (error) {
    console.error("Error verifying Paddle signature:", error);
    return false;
  }
}

// Process webhook data
async function processWebhook(data: any): Promise<{ success: boolean; message: string }> {
  try {
    // Check if webhook has already been processed (idempotency)
    const { data: existingWebhook } = await supabase
      .from("processed_webhooks")
      .select("id")
      .eq("id", data.id)
      .single();
    
    if (existingWebhook) {
      return { success: true, message: "Webhook already processed" };
    }
    
    // Extract common data
    const eventType = data.event_type;
    const webhookId = data.id;
    
    // Process based on event type
    if (eventType === "transaction.completed" || eventType === "subscription.created") {
      // Extract customer data
      const customerId = data.data.customer.id;
      const customerEmail = data.data.customer.email;
      
      // Determine plan type from price_id
      let planType = "free";
      let subscriptionId = null;
      
      if (data.data.items && data.data.items.length > 0) {
        const priceId = data.data.items[0].price.id;
        
        // Map price_id to plan_type
        if (priceId === "pri_01jys1q85m44rjw1w1csssaank") {
          planType = "chaos";
        } else if (priceId === "pri_01jys1hcpxgyrqx37vhpfaden7") {
          planType = "pro";
        }
      }
      
      // Get subscription ID if available
      if (data.data.subscription) {
        subscriptionId = data.data.subscription.id;
      }
      
      // Find user by email
      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("id")
        .eq("email", customerEmail)
        .single();
      
      if (userError) {
        console.error("Error finding user:", userError);
        return { success: false, message: "User not found" };
      }
      
      const userId = userData.id;
      
      // Determine plan details
      let concurrentSlots = 1;
      let testHours = 1;
      
      if (planType === "pro") {
        concurrentSlots = 4;
        testHours = 25;
      } else if (planType === "chaos") {
        concurrentSlots = 8;
        testHours = 0; // Unlimited
      }
      
      // Update user profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_plan: planType,
          subscription_status: "ACTIVE",
          paddle_customer_id: customerId,
          paddle_subscription_id: subscriptionId,
          next_billing_date: data.data.subscription?.next_billed_at || null,
          concurrent_test_slots: concurrentSlots,
          test_hours_remaining: testHours,
          tests_this_month_count: 0,
          last_monthly_reset_date: new Date().toISOString().split("T")[0]
        })
        .eq("id", userId);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        return { success: false, message: "Failed to update profile" };
      }
    } 
    else if (eventType === "subscription.updated") {
      // Extract subscription data
      const subscriptionId = data.data.id;
      const status = data.data.status;
      const nextBilledAt = data.data.next_billed_at;
      
      // Find user by subscription ID
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("paddle_subscription_id", subscriptionId)
        .single();
      
      if (profileError) {
        console.error("Error finding profile:", profileError);
        return { success: false, message: "Profile not found" };
      }
      
      // Update subscription status
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_status: status.toUpperCase(),
          next_billing_date: nextBilledAt
        })
        .eq("id", profileData.id);
      
      if (updateError) {
        console.error("Error updating subscription status:", updateError);
        return { success: false, message: "Failed to update subscription status" };
      }
    } 
    else if (eventType === "subscription.cancelled") {
      // Extract subscription data
      const subscriptionId = data.data.id;
      
      // Find user by subscription ID
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("paddle_subscription_id", subscriptionId)
        .single();
      
      if (profileError) {
        console.error("Error finding profile:", profileError);
        return { success: false, message: "Profile not found" };
      }
      
      // Update profile to free plan
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_plan: "free",
          subscription_status: "CANCELLED",
          test_hours_remaining: 1,
          tests_this_month_count: 0,
          concurrent_test_slots: 1,
          next_billing_date: null
        })
        .eq("id", profileData.id);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        return { success: false, message: "Failed to update profile" };
      }
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
    return { success: false, message: "Error processing webhook" };
  }
}

serve(async (req) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Verify Paddle signature
    const isValid = await verifyPaddleSignature(req.clone());
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Parse webhook payload
    const body = await req.json();
    
    // Process webhook
    const result = await processWebhook(body);
    
    // Return response
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});