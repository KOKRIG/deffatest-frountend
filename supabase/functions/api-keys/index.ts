// Supabase Edge Function for API key management
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Helper function to get user ID from JWT
async function getUserIdFromToken(authHeader: string | null): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user.id;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

// Check if user has Chaos plan
async function userHasChaosAccess(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("plan_type, subscription_status")
      .eq("user_id", userId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return data.plan_type === "chaos" && data.subscription_status === "ACTIVE";
  } catch (error) {
    console.error("Error checking user plan:", error);
    return false;
  }
}

// Generate a new API key
async function generateApiKey(userId: string): Promise<any> {
  try {
    const { data, error } = await supabase.rpc("generate_api_key");
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error generating API key:", error);
    throw error;
  }
}

// Get user's API keys
async function getUserApiKeys(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, is_active, created_at, expires_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching API keys:", error);
    throw error;
  }
}

// Update API key status
async function updateApiKeyStatus(userId: string, keyId: string, isActive: boolean): Promise<void> {
  try {
    const { error } = await supabase
      .from("api_keys")
      .update({ is_active: isActive })
      .eq("id", keyId)
      .eq("user_id", userId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating API key status:", error);
    throw error;
  }
}

// Delete API key
async function deleteApiKey(userId: string, keyId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("api_keys")
      .delete()
      .eq("id", keyId)
      .eq("user_id", userId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting API key:", error);
    throw error;
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
  
  // Get user ID from token
  const userId = await getUserIdFromToken(req.headers.get("Authorization"));
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  
  // Check if user has Chaos plan
  const hasChaosAccess = await userHasChaosAccess(userId);
  if (!hasChaosAccess) {
    return new Response(JSON.stringify({ error: "API Access is only available for Chaos Mode users" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  
  const url = new URL(req.url);
  const path = url.pathname.split("/").filter(Boolean);
  
  try {
    // GET /api-keys - List all API keys
    if (req.method === "GET" && path.length === 1 && path[0] === "api-keys") {
      const keys = await getUserApiKeys(userId);
      return new Response(JSON.stringify({ success: true, data: keys }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // POST /api-keys/generate - Generate a new API key
    if (req.method === "POST" && path.length === 2 && path[0] === "api-keys" && path[1] === "generate") {
      const apiKey = await generateApiKey(userId);
      return new Response(JSON.stringify({ success: true, data: apiKey }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // PUT /api-keys/status/{keyId} - Update API key status
    if (req.method === "PUT" && path.length === 3 && path[0] === "api-keys" && path[2] === "status") {
      const keyId = path[1];
      const { is_active } = await req.json();
      
      await updateApiKeyStatus(userId, keyId, is_active);
      
      return new Response(JSON.stringify({ success: true, message: "API key status updated successfully" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // DELETE /api-keys/{keyId} - Delete API key
    if (req.method === "DELETE" && path.length === 2 && path[0] === "api-keys") {
      const keyId = path[1];
      
      await deleteApiKey(userId, keyId);
      
      return new Response(JSON.stringify({ success: true, message: "API key deleted successfully" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Route not found
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});