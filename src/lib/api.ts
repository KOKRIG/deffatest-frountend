// API Endpoints Configuration for DEFFATEST
// This file contains all the API endpoint definitions and helper functions
import { supabase } from './supabase';

// Pre-fetch data for faster navigation
export const preFetchDashboardData = async () => {
  try {
    // Pre-fetch data for Upload page
    await supabase.from('tests').select('*').in('status', ['queued', 'running', 'processing_results']).limit(10);
    await supabase.from('tests').select('*', { count: 'exact' }).eq('status', 'completed').limit(10);

    // Pre-fetch data for Results page
    await supabase.from('tests').select('*', { count: 'exact' }).limit(15);
  } catch (error) {
    console.warn('Pre-fetching failed, but this is not critical:', error);
  }
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication & User Management
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    resetPassword: '/auth/reset-password',
    updatePassword: '/auth/update-password'
  },

  // User Profile & Plan Management
  user: {
    profile: '/api/user/profile',
    plan: '/api/user/plan',
    updateProfile: '/api/user/profile',
    subscription: '/api/user/subscription',
    paddlePortalLink: '/api/user/paddle-portal-link'
  },

  // Test Management
  tests: {
    submit: '/api/tests/submit',
    list: '/api/tests',
    history: '/api/tests/history',
    live: '/api/tests/live',
    summary: '/api/tests/summary',
    recent: '/api/tests/recent',
    details: (testId: string) => `/api/tests/${testId}`,
    cancel: (testId: string) => `/api/tests/${testId}`,
    results: (testId: string) => `/api/tests/${testId}/results`,
    status: (testId: string) => `/api/tests/${testId}/status`,
    report: (testId: string) => `/api/tests/${testId}/report`
  },

  // Bug Reports
  bugs: {
    list: (testId: string) => `/api/tests/${testId}/bugs`,
    details: (bugId: string) => `/api/bugs/${bugId}`,
    create: '/api/bugs',
    update: (bugId: string) => `/api/bugs/${bugId}`
  },

  // File Upload
  upload: {
    file: '/api/upload/file',
    bundle: '/api/upload/bundle',
    apk: '/api/upload/apk'
  },

  // Analytics & Reporting
  analytics: {
    dashboard: '/api/analytics/dashboard',
    testMetrics: '/api/analytics/test-metrics',
    bugTrends: '/api/analytics/bug-trends',
    performance: '/api/analytics/performance'
  },

  // Payment & Billing
  payment: {
    plans: '/api/payment/plans',
    subscribe: '/api/payment/subscribe',
    changePlan: '/api/payment/change-plan',
    cancel: '/api/payment/cancel',
    invoices: '/api/payment/invoices',
    updatePayment: '/api/payment/update-method'
  },

  // API Key Management (For Chaos Mode) - Updated to match frontend prompt
  apiKeys: {
    list: '/api/v1/api-keys',
    create: '/api/v1/api-keys',
    generate: '/api/v1/api-keys/generate',
    revoke: (keyId: string) => `/api/v1/api-keys/revoke/${keyId}`,
    regenerate: '/api/v1/api-keys/regenerate',
    status: (keyId: string) => `/api/v1/api-keys/${keyId}/status`
  },

  // Webhooks
  webhooks: {
    list: '/api/webhooks',
    create: '/api/webhooks',
    update: (webhookId: string) => `/api/webhooks/${webhookId}`,
    delete: (webhookId: string) => `/api/webhooks/${webhookId}`,
    test: (webhookId: string) => `/api/webhooks/${webhookId}/test`
  },

  // Integration
  integrations: {
    github: '/api/integrations/github',
    gitlab: '/api/integrations/gitlab',
    jenkins: '/api/integrations/jenkins',
    slack: '/api/integrations/slack'
  },

  // System & Health
  system: {
    health: '/api/health',
    status: '/api/status',
    version: '/api/version'
  },
  
  // Paddle Webhook
  paddle: {
    webhook: '/paddle/webhook'
  }
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Test Submission Types - Updated to match new schema
export interface TestSubmissionRequest {
  test_name: string; // Changed from testName
  test_type: 'web_url' | 'web_bundle' | 'android_apk'; // Updated values
  requested_duration_minutes: number; // Changed from duration
  test_source_url?: string; // Changed from url
  test_file_path?: string; // New field (for storing the path of an uploaded file)
  plan_type_at_submission: string; // New field
  file?: File; // For file uploads (not stored in DB, just for submission)
}

export interface TestSubmissionResponse {
  testId: string;
  status: 'queued' | 'running'; // Changed from 'pending' to 'queued'
  estimatedStartTime?: string;
  queuePosition?: number;
}

// User Plan Types
export interface UserPlanResponse {
  plan_type: 'free' | 'pro' | 'chaos'; // Changed from planType
  subscription_status: 'FREE' | 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED'; // Changed from subscriptionStatus
  next_billing_date?: string; // Changed from nextBillingDate
  tests_this_month_count: number; // Modified from testsThisMonth structure
  concurrent_test_slots: number; // Changed from maxConcurrentTests
  paddle_customer_id?: string; // New field
  paddle_subscription_id?: string; // New field
  available_durations?: number[]; // Kept for frontend convenience
  features?: string[]; // Kept for frontend convenience
}

// User Profile Types
export interface UserProfileResponse {
  user_id: string;
  full_name: string;
  email: string;
  company_name: string; // Changed from company_name
  industry: string;
  plan_type: string; // New field
  subscription_status: string; // New field
  tests_this_month_count: number; // New field
  concurrent_test_slots: number; // New field
  created_at: string; // New field
}

export interface UserProfileUpdateRequest {
  full_name?: string;
  company_name?: string; // Changed from company_name
  industry?: string;
}

// API Key Types
export interface ApiKeyResponse {
  id: string;
  user_id: string;
  name: string; // Changed from key_prefix
  api_key_hash: string; // Changed from hashed_key (though frontend wouldn't display this)
  is_active: boolean;
  created_at: string;
  expires_at?: string; // New field, replacing last_used_at
}

export interface ApiKeyGenerateResponse {
  id: string;
  api_key: string; // Full key returned only once
  name: string; // Changed from key_prefix
  is_active: boolean;
  created_at: string;
}

// Test History Types
export interface TestHistoryRequest {
  offset?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'alphabetical_az' | 'alphabetical_za' | 'duration_longest' | 'duration_shortest';
  filterByType?: 'all' | 'web_url' | 'web_bundle' | 'android_apk'; // Updated values
  filterByStatus?: 'all' | 'queued' | 'running' | 'processing_results' | 'completed' | 'failed' | 'cancelled'; // Updated values
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface TestHistoryItem {
  id: string;
  user_id: string;
  test_name: string;
  test_type: 'web_url' | 'web_bundle' | 'android_apk'; // Updated values
  test_source_url?: string; // Changed from url
  requested_duration_minutes: number; // New field
  status: 'queued' | 'running' | 'processing_results' | 'completed' | 'failed' | 'cancelled'; // Updated values
  progress: number; // New field
  submitted_at: string; // Changed from createdAt
  completed_at?: string; // Changed from completedAt
  bug_count: number; // Changed from bugsFound
  report_download_url?: string; // Changed from report_download_link
}

// Live Tests Types
export interface LiveTestItem {
  id: string;
  test_name: string;
  test_type: 'web_url' | 'web_bundle' | 'android_apk'; // Updated values
  status: 'queued' | 'running' | 'processing_results'; // Updated values
  submitted_at: string; // Changed from submissionTime
  estimated_completion_time?: string; // Changed from estimatedCompletion
  progress?: number;
}

// Dashboard Summary Types
export interface DashboardSummaryResponse {
  totalTestsRun: number;
  totalBugsFound: number;
  testsThisMonth: {
    count: number;
    limit: number;
  };
  bugSeverityDistribution: {
    critical: number;
    major: number;
    minor: number;
  };
  planInfo: {
    plan_type: string; // Changed from planType
  };
  recentActivity: TestHistoryItem[];
}

// Test Report Types
export interface TestReportResponse {
  test_id: string;
  test_name: string;
  status: 'completed' | 'failed';
  test_type: 'web_url' | 'web_bundle' | 'android_apk'; // Updated values
  submitted_at: string;
  requested_duration_minutes: number; // Changed from duration_seconds
  environment_info: {
    browser?: string;
    os?: string;
    device?: string;
    android_version?: string;
    device_model?: string;
  };
  total_bugs_found: {
    critical: number;
    major: number;
    minor: number;
  };
  report_download_url: string; // Changed from report_download_link
  bugs: Array<{
    bug_id: string;
    title: string;
    severity: 'Critical' | 'Major' | 'Minor';
    reproduction_steps: string[];
    screenshots: string[]; // Direct public R2 links for individual screenshots
    bug_video_link: string; // Direct public R2 link for individual video
    additional_context?: string;
  }>;
  performance_metrics?: {
    page_load_time_ms: number;
    avg_fps: number;
    max_memory_mb: number;
    cpu_usage_percent: number;
    network_latency_ms: number;
  };
  security_findings?: Array<{
    type: string;
    description: string;
    affected_area: string;
  }>;
}

// Paddle Types
export interface PaddleCheckoutOptions {
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
  customer?: {
    email?: string;
    id?: string;
  };
  settings?: {
    successUrl?: string;
    cancelUrl?: string;
    displayMode?: 'overlay' | 'redirect';
    theme?: 'dark' | 'light';
    locale?: string;
  };
}

// API Helper Functions
export class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // FIX: Start with the headers from the specific call (e.g., submitTest)
    const headers = new Headers(options.headers);

    if (this.authToken) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }

    // FIX: ONLY set Content-Type if the body is NOT FormData.
    // The browser will set the correct multipart header automatically for FormData.
    if (!(options.body instanceof FormData)) {
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle cases with no JSON body, like a 204 No Content response
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();

      if (!response.ok) {
        // Use the detailed error message from FastAPI if available
        const errorMessage = data.detail?.[0]?.msg || data.detail || data.error || `HTTP ${response.status}`;
        return { success: false, error: errorMessage };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Test Management Methods
  async submitTest(request: TestSubmissionRequest): Promise<ApiResponse<TestSubmissionResponse>> {
    const formData = new FormData();

    // Use the correct backend field names that match what the backend expects
    formData.append('test_name', request.test_name);
    formData.append('test_type', request.test_type);
    formData.append('requested_duration_minutes', request.requested_duration_minutes.toString());
    formData.append('plan_type_at_submission', request.plan_type_at_submission);
    
    if (request.test_source_url) {
      formData.append('test_source_url', request.test_source_url);
    }
    
    if (request.file) {
      // Backend expects the file under 'uploaded_file' key, not 'file'
      formData.append('uploaded_file', request.file);
    }

    // FIX: The headers object is no longer needed here because the generic
    // request function now handles it correctly.
    return this.request(API_ENDPOINTS.tests.submit, {
      method: 'POST',
      body: formData,
    });
  }

  async getTestHistory(params: TestHistoryRequest = {}): Promise<PaginatedResponse<TestHistoryItem>> {
    const searchParams = new URLSearchParams();
    
    if (params.offset) searchParams.append('offset', params.offset.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.filterByType) searchParams.append('filterByType', params.filterByType);
    if (params.filterByStatus) searchParams.append('filterByStatus', params.filterByStatus);
    if (params.search) searchParams.append('search', params.search);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    const endpoint = `${API_ENDPOINTS.tests.history}?${searchParams.toString()}`;
    return this.request(endpoint);
  }

  async getLiveTests(): Promise<ApiResponse<LiveTestItem[]>> {
    return this.request(API_ENDPOINTS.tests.live);
  }

  async cancelTest(testId: string): Promise<ApiResponse<void>> {
    return this.request(API_ENDPOINTS.tests.cancel(testId), {
      method: 'DELETE',
    });
  }

  async getTestDetails(testId: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.tests.details(testId));
  }

  async getTestResults(testId: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.tests.results(testId));
  }

  async getTestReport(testId: string): Promise<ApiResponse<TestReportResponse>> {
    return this.request(API_ENDPOINTS.tests.report(testId));
  }

  // User & Plan Methods
  async getUserPlan(): Promise<ApiResponse<UserPlanResponse>> {
    return this.request(API_ENDPOINTS.user.plan);
  }

  async getUserProfile(): Promise<ApiResponse<UserProfileResponse>> {
    return this.request(API_ENDPOINTS.user.profile);
  }

  async updateUserProfile(data: UserProfileUpdateRequest): Promise<ApiResponse<void>> {
    return this.request(API_ENDPOINTS.user.updateProfile, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updatePlan(plan_type: 'free' | 'pro' | 'chaos'): Promise<ApiResponse<void>> {
    return this.request(API_ENDPOINTS.user.updateProfile, {
      method: 'PUT',
      body: JSON.stringify({ plan_type }), // Changed from subscription_plan
    });
  }

  async getPaddlePortalLink(): Promise<ApiResponse<{ url: string }>> {
    return this.request(API_ENDPOINTS.user.paddlePortalLink);
  }

  async getDashboardSummary(): Promise<ApiResponse<DashboardSummaryResponse>> {
    return this.request(API_ENDPOINTS.tests.summary);
  }

  async getRecentTests(limit: number = 5): Promise<ApiResponse<TestHistoryItem[]>> {
    return this.request(`${API_ENDPOINTS.tests.recent}?limit=${limit}`);
  }

  // API Key Methods (For Chaos Mode)
  async getApiKeys(): Promise<ApiResponse<ApiKeyResponse[]>> {
    return this.request(API_ENDPOINTS.apiKeys.list);
  }

  async generateApiKey(): Promise<ApiResponse<ApiKeyGenerateResponse>> {
    return this.request(API_ENDPOINTS.apiKeys.generate, {
      method: 'POST',
    });
  }

  async revokeApiKey(keyId: string): Promise<ApiResponse<void>> {
    return this.request(API_ENDPOINTS.apiKeys.revoke(keyId), {
      method: 'DELETE',
    });
  }

  async updateApiKeyStatus(keyId: string, isActive: boolean): Promise<ApiResponse<void>> {
    return this.request(API_ENDPOINTS.apiKeys.status(keyId), {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  // Payment Methods
  async changePlan(plan_type: 'free' | 'pro' | 'chaos'): Promise<ApiResponse<void>> {
    return this.request(API_ENDPOINTS.payment.changePlan, {
      method: 'POST',
      body: JSON.stringify({ plan_type }), // Changed from plan_type
    });
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// Error handling utilities
export const handleApiError = (error: string): string => {
  // Map common API errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    'UNAUTHORIZED': 'Please log in to continue',
    'FORBIDDEN': 'You do not have permission to perform this action',
    'NOT_FOUND': 'The requested resource was not found',
    'RATE_LIMITED': 'Too many requests. Please try again later',
    'PLAN_LIMIT_EXCEEDED': 'You have reached your plan limit. Please upgrade to continue',
    'CONCURRENT_LIMIT_EXCEEDED': 'You have reached your concurrent test limit',
    'INVALID_FILE_TYPE': 'Invalid file type. Please check the file format',
    'FILE_TOO_LARGE': 'File size exceeds the maximum limit',
    'NETWORK_ERROR': 'Network error. Please check your connection and try again',
    'PLAN_RESTRICTION': 'This feature is not available on your current plan',
    'PAYMENT_REQUIRED': 'Payment is required to access this feature',
    'INVALID_DURATION': 'Selected duration not available for your plan',
    'SLOT_LIMIT_REACHED': 'Maximum concurrent test slots reached for your plan'
  };

  return errorMappings[error] || error || 'An unexpected error occurred';
};

// Request interceptors for authentication
export const setupApiInterceptors = (getAuthToken: () => string | null) => {
  const originalFetch = window.fetch;
  
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const token = getAuthToken();
    
    if (token && init?.headers) {
      const headers = new Headers(init.headers);
      headers.set('Authorization', `Bearer ${token}`);
      init.headers = headers;
    }
    
    return originalFetch(input, init);
  };
};

// Paddle integration removed from api.ts - use paddle.ts instead

export default apiClient;
