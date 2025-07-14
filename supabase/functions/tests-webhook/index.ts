// Supabase Edge Function for handling test status updates from the testing backend
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const webhookSecret = Deno.env.get("TEST_WEBHOOK_SECRET") || "test_webhook_secret_key";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Webhook-Signature",
};

// Verify webhook signature
function verifyWebhookSignature(signature: string | null, payload: string): boolean {
  if (!signature) return false;

  try {
    // In production, implement proper HMAC validation here
    return true; // Simplified for this example
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

// Process test status update webhook
async function processTestStatusUpdate(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const { test_id, status, progress, bug_count, report_download_url } = data;

    if (!test_id) {
      return { success: false, message: "Missing test_id in payload" };
    }

    // Get the test to verify it exists and get user_id
    const { data: testData, error: testError } = await supabase
      .from("tests")
      .select("user_id")
      .eq("id", test_id)
      .single();

    if (testError || !testData) {
      console.error("Test not found:", test_id);
      return { success: false, message: "Test not found" };
    }

    // Prepare update object based on provided data
    const updateData: Record<string, any> = {};
    
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (bug_count !== undefined) updateData.bug_count = bug_count;
    if (report_download_url) updateData.report_download_url = report_download_url;

    // Update timestamps based on status
    if (status === 'running' && !updateData.started_at) {
      updateData.started_at = new Date().toISOString();
    }
    
    if ((status === 'completed' || status === 'failed') && !updateData.completed_at) {
      updateData.completed_at = new Date().toISOString();
    }

    // Update the test record
    const { error: updateError } = await supabase
      .from("tests")
      .update(updateData)
      .eq("id", test_id);

    if (updateError) {
      console.error("Error updating test:", updateError);
      return { success: false, message: "Failed to update test status" };
    }

    // If bugs were reported, add them to bug_reports table
    if (data.bugs && Array.isArray(data.bugs) && data.bugs.length > 0) {
      const bugReports = data.bugs.map((bug: any) => ({
        test_id,
        severity: bug.severity.toLowerCase(),
        title: bug.title,
        description: bug.description || bug.title,
        reproduction_steps: bug.steps || JSON.stringify(bug.reproduction_steps),
        screenshot_url: bug.screenshot_url,
        video_url: bug.video_url
      }));

      const { error: bugInsertError } = await supabase
        .from("bug_reports")
        .insert(bugReports);

      if (bugInsertError) {
        console.error("Error inserting bug reports:", bugInsertError);
        // Continue anyway - don't fail the whole update if bug insertion fails
      }
    }

    return { success: true, message: "Test status updated successfully" };
  } catch (error) {
    console.error("Error processing test status update:", error);
    return { success: false, message: error.message || "Error processing test status update" };
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
    // Get the request body
    const body = await req.json();
    const signature = req.headers.get("X-Webhook-Signature");

    // Verify signature (optional but recommended for production)
    const isValidSignature = verifyWebhookSignature(signature, JSON.stringify(body));
    if (!isValidSignature) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Process the webhook payload
    const result = await processTestStatusUpdate(body);
    
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