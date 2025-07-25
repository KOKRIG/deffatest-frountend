import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://njtxcvonqdpsmjsczbbd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdHhjdm9ucWRwc21qc2N6YmJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MzA2ODUsImV4cCI6MjA2NjUwNjY4NX0.SprNvNa-_A3-2AoWPdJqPsMPB7G2pjrVTbEPgGJxePY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Types
export interface Profile {
  user_id: string; // Changed from 'id' to match new schema
  email: string;
  full_name?: string;
  company_name?: string; // Changed from 'company'
  industry?: string;
  plan_type: string; // Changed from 'subscription_plan'
  subscription_status: string;
  tests_this_month_count: number;
  last_monthly_reset_date?: string;
  concurrent_test_slots: number;
  paddle_customer_id?: string;
  paddle_subscription_id?: string;
  current_billing_period_ends_at?: string; // Changed from next_billing_date
  created_at: string;
  max_test_duration_minutes?: number; // Added to match new schema
  phone_number?: string; // Added to match new schema
  country?: string; // Added to match new schema
  plan_price_amount?: number; // Added to match new schema
  plan_price_currency?: string; // Added to match new schema
}

export interface Test {
  id: string;
  user_id: string;
  test_name: string;
  test_type: 'web_url' | 'web_bundle' | 'android_apk'; // Updated test types
  test_source_url?: string; // Changed from 'app_url'
  test_file_path?: string; // New field
  requested_duration_minutes: number; // New field
  plan_type_at_submission: string; // New field
  status: 'queued' | 'running' | 'processing_results' | 'completed' | 'failed' | 'cancelled'; // Updated status options
  progress: number; // New field
  estimated_completion_time?: string; // New field
  submitted_at: string; // Changed from 'created_at'
  started_at?: string; // New field
  completed_at?: string; // New field
  report_download_url?: string; // New field
  bug_count: number; // New field
}

export interface BugReport {
  id: string;
  test_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  reproduction_steps: string;
  screenshot_url?: string;
  video_url?: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  api_key_hash: string; // Changed from 'hashed_key'
  name: string; // Changed from 'key_prefix'
  is_active: boolean;
  created_at: string;
  expires_at?: string; // New field, replaces 'last_used_at'
}

// Declare Paddle types for TypeScript
declare global {
  interface Window {
    Paddle?: {
      // Paddle Billing (v2) methods
      Initialize: (options: { 
        token: string;
        eventCallback?: (data: any) => void;
      }) => void;
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          customer?: { email?: string; id?: string };
          settings?: {
            successUrl?: string;
            cancelUrl?: string;
            displayMode?: 'overlay' | 'redirect';
            theme?: 'dark' | 'light';
            locale?: string;
          };
        }) => void;
      };
      Environment?: {
        set: (environment: 'sandbox' | 'production') => void;
      };
    };
  }
}