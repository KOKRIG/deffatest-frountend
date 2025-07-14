// Supabase Edge Function for user profile and plan management
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

// Get user profile
async function getUserProfile(userId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Update user profile
async function updateUserProfile(userId: string, updates: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Get user plan details
async function getUserPlan(userId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("plan_type, subscription_status, current_billing_period_ends_at, tests_this_month_count, max_test_duration_minutes, concurrent_test_slots, paddle_customer_id")
      .eq("user_id", userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Calculate tests remaining based on plan
    let testsPerMonth = 1; // Default for free plan
    if (data.plan_type === "pro") {
      testsPerMonth = 25;
    } else if (data.plan_type === "chaos") {
      testsPerMonth = -1; // Unlimited
    }
    
    const testsRemaining = testsPerMonth === -1 ? -1 : Math.max(0, testsPerMonth - (data.tests_this_month_count || 0));
    
    // Define available durations based on plan
    let availableDurations: number[] = [];
    if (data.plan_type === "free") {
      availableDurations = [5];
    } else if (data.plan_type === "pro") {
      availableDurations = [5, 10, 20, 30, 45, 70, 90, 110, 120];
    } else if (data.plan_type === "chaos") {
      availableDurations = [5, 10, 20, 30, 45, 70, 90, 110, 120, 200, 250, 300, 360];
    }
    
    // Define features based on plan
    let features: string[] = [];
    if (data.plan_type === "free") {
      features = ["1 AI Test / Month", "5 min test duration", "Basic Bug Report"];
    } else if (data.plan_type === "pro") {
      features = ["25 AI Tests / Month", "Up to 2 hour test duration", "Priority Queue", "4 Concurrent Test Slots"];
    } else if (data.plan_type === "chaos") {
      features = ["Unlimited AI Tests", "Up to 6 hour test duration", "Instant Queue", "8 Concurrent Test Slots", "API Access"];
    }
    
    return {
      plan_type: data.plan_type,
      subscription_status: data.subscription_status,
      current_billing_period_ends_at: data.current_billing_period_ends_at,
      tests_this_month_count: data.tests_this_month_count,
      testsThisMonthRemaining: testsRemaining,
      max_test_duration_minutes: data.max_test_duration_minutes,
      concurrent_test_slots: data.concurrent_test_slots,
      paddle_customer_id: data.paddle_customer_id,
      available_durations: availableDurations,
      features: features
    };
  } catch (error) {
    console.error("Error fetching user plan:", error);
    throw error;
  }
}

// Get Paddle customer portal URL
async function getPaddlePortalUrl(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("paddle_customer_id")
      .eq("user_id", userId)
      .single();
    
    if (error || !data.paddle_customer_id) {
      return null;
    }
    
    return `https://customers.paddle.com/customer/portal/${data.paddle_customer_id}`;
  } catch (error) {
    console.error("Error getting Paddle portal URL:", error);
    return null;
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
  
  const url = new URL(req.url);
  const path = url.pathname.split("/").filter(Boolean);
  
  try {
    // GET /user/profile - Get user profile
    if (req.method === "GET" && path.length === 2 && path[0] === "user" && path[1] === "profile") {
      const profile = await getUserProfile(userId);
      return new Response(JSON.stringify({ success: true, data: profile }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // PUT /user/profile - Update user profile
    if (req.method === "PUT" && path.length === 2 && path[0] === "user" && path[1] === "profile") {
      const updates = await req.json();
      
      // Validate updates
      const allowedFields = ["full_name", "company_name", "industry"];
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key];
          return obj;
        }, {} as Record<string, any>);
      
      const updatedProfile = await updateUserProfile(userId, filteredUpdates);
      
      return new Response(JSON.stringify({ success: true, data: updatedProfile }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // GET /user/plan - Get user plan details
    if (req.method === "GET" && path.length === 2 && path[0] === "user" && path[1] === "plan") {
      const plan = await getUserPlan(userId);
      return new Response(JSON.stringify({ success: true, data: plan }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // GET /user/paddle-portal-link - Get Paddle customer portal URL
    if (req.method === "GET" && path.length === 2 && path[0] === "user" && path[1] === "paddle-portal-link") {
      const portalUrl = await getPaddlePortalUrl(userId);
      
      if (!portalUrl) {
        return new Response(JSON.stringify({ error: "No Paddle subscription found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ success: true, data: { url: portalUrl } }), {
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