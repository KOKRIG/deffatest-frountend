
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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Always add auth token if available, even if headers were overridden
    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
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
    // Match backend parameter names exactly
    formData.append('test_name', request.test_name); // Backend expects 'test_name'
    formData.append('test_type', request.test_type); // Matches backend
    formData.append('requested_duration_minutes', request.requested_duration_minutes.toString()); // Backend expects 'requested_duration_minutes'
    formData.append('plan_type_at_submission', request.plan_type_at_submission); // Add plan type
    
    if (request.test_source_url) {
      formData.append('test_source_url', request.test_source_url); // Backend expects 'test_source_url'
    }
    
    if (request.file) {
      formData.append('uploaded_file', request.file); // Backend expects 'uploaded_file'
    }

    // For FormData, we need to omit Content-Type but keep Authorization
    const headers: HeadersInit = {};
    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }
    
    return this.request(API_ENDPOINTS.tests.submit, {
      method: 'POST',
      body: formData,
      headers, // Omit Content-Type to let browser set it for FormData
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

  async updateUserProfile(data: UserProfileUpdateRequest): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.user.updateProfile, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // API Key Methods
  async listApiKeys(): Promise<ApiResponse<ApiKeyResponse[]>> {
    return this.request(API_ENDPOINTS.apiKeys.list);
  }

  async generateApiKey(name: string): Promise<ApiResponse<ApiKeyGenerateResponse>> {
    return this.request(API_ENDPOINTS.apiKeys.generate, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async revokeApiKey(keyId: string): Promise<ApiResponse<void>> {
    return this.request(API_ENDPOINTS.apiKeys.revoke(keyId), {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

// Error Handling Helper
export const handleApiError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error && error.message) return error.message;
  return 'An unknown error occurred';
};

