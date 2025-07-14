# DEFFATEST AI Testing Platform - Ultimate Backend Development Blueprint

## 🚀 Project Overview

DEFFATEST is a revolutionary AI-powered software testing platform that autonomously tests web and mobile applications to find bugs, performance bottlenecks, and security vulnerabilities. Unlike traditional testing tools that rely on brittle scripts, our platform uses Computer Vision and Large Language Models to explore applications like real users would.

This backend will power the React/TypeScript frontend that enables test submission, real-time monitoring, detailed reporting, subscription management, and API access for enterprise users.

## 📋 Database Schema & Data Models

### Supabase Database Schema (Must Match Exactly)

#### `profiles` Table
```sql
CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  company_name text,
  industry text DEFAULT 'Other',
  plan_type text DEFAULT 'free',
  api_key text UNIQUE DEFAULT gen_random_uuid()::text,
  created_at timestamptz DEFAULT now(),
  paddle_customer_id text,
  paddle_subscription_id text,
  current_billing_period_ends_at timestamptz,
  subscription_status text DEFAULT 'FREE' NOT NULL,
  tests_this_month_count integer DEFAULT 0 NOT NULL,
  last_monthly_reset_date date,
  concurrent_test_slots integer DEFAULT 1 NOT NULL,
  max_test_duration_minutes integer DEFAULT 5 NOT NULL,
  phone_number text,
  country text,
  plan_price_amount numeric,
  plan_price_currency text
);
```

#### `tests` Table
```sql
CREATE TABLE public.tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  test_name text NOT NULL,
  test_type text NOT NULL CHECK (test_type IN ('web_url', 'web_bundle', 'android_apk')),
  test_source_url text,
  status text DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'processing_results', 'completed', 'failed', 'cancelled')),
  requested_duration_minutes integer DEFAULT 5 NOT NULL,
  test_file_path text,
  plan_type_at_submission text DEFAULT 'free' NOT NULL,
  progress integer DEFAULT 0 NOT NULL,
  estimated_completion_time timestamptz,
  submitted_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  report_download_url text,
  bug_count integer DEFAULT 0 NOT NULL,
  CONSTRAINT unique_test_id_per_user UNIQUE (id, user_id)
);
```

#### `bug_reports` Table
```sql
CREATE TABLE public.bug_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES tests(id) ON DELETE CASCADE NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  description text NOT NULL,
  reproduction_steps text NOT NULL,
  screenshot_url text,
  video_url text,
  created_at timestamptz DEFAULT now()
);
```

#### `api_keys` Table
```sql
CREATE TABLE public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  api_key_hash text NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz
);
```

#### `processed_webhooks` Table
```sql
CREATE TABLE public.processed_webhooks (
  id text PRIMARY KEY,
  event_type text NOT NULL,
  processed_at timestamptz DEFAULT now() NOT NULL,
  status text DEFAULT 'success' NOT NULL
);
```

### Row Level Security (RLS)

Implement these exact RLS policies:

#### Profiles
```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
```

#### Tests
```sql
-- Users can view their own tests
CREATE POLICY "Users can view their own tests"
ON tests FOR SELECT
USING (auth.uid() = user_id);

-- Users can submit their own tests
CREATE POLICY "Users can submit their own tests"
ON tests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own tests
CREATE POLICY "Users can update their own tests"
ON tests FOR UPDATE
USING (auth.uid() = user_id);
```

#### API Keys
```sql
-- Users can view their own API keys
CREATE POLICY "Users can view their own API keys"
ON api_keys FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own API keys
CREATE POLICY "Users can create their own API keys"
ON api_keys FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can revoke their own API keys
CREATE POLICY "Users can revoke their own API keys"
ON api_keys FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own API keys
CREATE POLICY "Users can delete their own API keys"
ON api_keys FOR DELETE
USING (auth.uid() = user_id);
```

## 🔗 Comprehensive API Endpoints

### 1. Authentication Endpoints

#### User Registration
```
POST /auth/register
```
**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  },
  "message": "Registration successful"
}
```

#### User Login
```
POST /auth/login
```
**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1625097600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "full_name": "John Doe"
    }
  }
}
```

#### Password Reset Request
```
POST /auth/reset-password
```
**Request:**
```json
{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### Password Update
```
POST /auth/update-password
```
**Request:**
```json
{
  "password": "newSecurePassword"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

#### User Logout
```
POST /auth/logout
```
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 2. Profile Management Endpoints

#### Get User Profile
```
GET /api/user/profile
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "company_name": "Acme Inc",
    "industry": "Software Development",
    "plan_type": "pro",
    "created_at": "2025-01-01T00:00:00Z",
    "subscription_status": "ACTIVE",
    "tests_this_month_count": 5,
    "concurrent_test_slots": 4,
    "phone_number": "+1234567890",
    "country": "United States"
  }
}
```

#### Update User Profile
```
PUT /api/user/profile
```
**Request:**
```json
{
  "full_name": "John Smith",
  "company_name": "New Company Inc",
  "industry": "Finance"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Smith",
    "company_name": "New Company Inc",
    "industry": "Finance"
  },
  "message": "Profile updated successfully"
}
```

#### Get User Plan
```
GET /api/user/plan
```
**Response:**
```json
{
  "success": true,
  "data": {
    "plan_type": "pro",
    "subscription_status": "ACTIVE",
    "current_billing_period_ends_at": "2025-07-01T00:00:00Z",
    "tests_this_month_count": 5,
    "testsThisMonthRemaining": 20,
    "concurrent_test_slots": 4,
    "paddle_customer_id": "customer_12345",
    "max_test_duration_minutes": 120,
    "available_durations": [5, 10, 20, 30, 45, 70, 90, 110, 120],
    "features": ["Priority Queue", "Concurrent Tests", "Detailed Reports"]
  }
}
```

#### Get Paddle Customer Portal Link
```
GET /api/user/paddle-portal-link
```
**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://customers.paddle.com/customer/portal/12345"
  }
}
```

### 3. Test Management Endpoints

#### Submit Test
```
POST /api/tests/submit
```
**Request (multipart/form-data):**
```
test_name: "E-commerce Website Test"
test_type: "web_url"
test_source_url: "https://example.com"
requested_duration_minutes: 15
plan_type_at_submission: "pro"
file: <binary file data> (for web_bundle or android_apk types)
```
**Response:**
```json
{
  "success": true,
  "data": {
    "test_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "queued",
    "estimated_start_time": "2025-07-01T12:30:45Z",
    "queue_position": 2
  }
}
```

#### Get Test History (Paginated)
```
GET /api/tests/history?offset=0&limit=10&sortBy=newest&filterByType=all&filterByStatus=all&search=&startDate=&endDate=
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "test_name": "E-commerce Website Test",
      "test_type": "web_url",
      "test_source_url": "https://example.com",
      "requested_duration_minutes": 15,
      "status": "completed",
      "progress": 100,
      "submitted_at": "2025-07-01T12:00:00Z",
      "completed_at": "2025-07-01T12:15:00Z",
      "bug_count": 15,
      "report_download_url": "https://storage.example.com/reports/550e8400-e29b-41d4-a716-446655440000.zip"
    },
    // More test records...
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "hasMore": true
  }
}
```

#### Get Live Tests
```
GET /api/tests/live
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "test_name": "Mobile App Test",
      "test_type": "android_apk",
      "status": "running",
      "submitted_at": "2025-07-01T12:00:00Z",
      "estimated_completion_time": "2025-07-01T12:30:00Z",
      "progress": 65
    },
    // More live tests...
  ]
}
```

#### Get Test Status
```
GET /api/tests/{testId}/status
```
**Response:**
```json
{
  "success": true,
  "data": {
    "test_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "running",
    "progress": 65,
    "estimated_completion_time": "2025-07-01T12:30:00Z"
  }
}
```

#### Get Test Report
```
GET /api/tests/{testId}/report
```
**Response:**
```json
{
  "success": true,
  "data": {
    "test_id": "550e8400-e29b-41d4-a716-446655440000",
    "test_name": "E-commerce Website Test",
    "status": "completed",
    "test_type": "web_url",
    "submitted_at": "2025-07-01T12:00:00Z",
    "requested_duration_minutes": 15,
    "environment_info": {
      "browser": "Chrome 120.0.6099.129",
      "os": "Windows 11",
      "device": "Desktop (1920x1080)"
    },
    "total_bugs_found": {
      "critical": 2,
      "major": 5,
      "minor": 8
    },
    "report_download_url": "https://storage.r2.cloudflarestorage.com/test-reports/550e8400-e29b-41d4-a716-446655440000/full_report.zip",
    "bugs": [
      {
        "bug_id": "bug-1",
        "title": "Checkout button unresponsive on mobile viewport",
        "severity": "Critical",
        "reproduction_steps": [
          "Navigate to the checkout page at /checkout",
          "Resize browser window to mobile viewport (375px width)",
          "Add at least one item to the shopping cart",
          "Proceed to the payment section",
          "Attempt to click the 'Complete Purchase' button",
          "Observe that the button does not respond to clicks or touch events"
        ],
        "screenshots": [
          "https://storage.r2.cloudflarestorage.com/test-reports/550e8400-e29b-41d4-a716-446655440000/bugs/bug-1/screenshot-1.png",
          "https://storage.r2.cloudflarestorage.com/test-reports/550e8400-e29b-41d4-a716-446655440000/bugs/bug-1/screenshot-2.png"
        ],
        "bug_video_link": "https://storage.r2.cloudflarestorage.com/test-reports/550e8400-e29b-41d4-a716-446655440000/bugs/bug-1/recording.mp4",
        "additional_context": "CSS z-index issue causing an invisible overlay element to block button interaction."
      }
      // More bugs...
    ],
    "performance_metrics": {
      "page_load_time_ms": 1823,
      "avg_fps": 58,
      "max_memory_mb": 186,
      "cpu_usage_percent": 42,
      "network_latency_ms": 78
    },
    "security_findings": [
      {
        "type": "XSS Vulnerability",
        "description": "Input field vulnerable to cross-site scripting attacks on the login page.",
        "affected_area": "Login Form - Username Field"
      }
      // More security findings...
    ]
  }
}
```

#### Cancel Test
```
DELETE /api/tests/{testId}
```
**Response:**
```json
{
  "success": true,
  "message": "Test cancelled successfully"
}
```

#### Get Dashboard Summary
```
GET /api/tests/summary
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalTestsRun": 45,
    "totalBugsFound": 237,
    "testsThisMonth": {
      "count": 5,
      "limit": 25
    },
    "bugSeverityDistribution": {
      "critical": 12,
      "major": 48,
      "minor": 177
    },
    "planInfo": {
      "plan_type": "pro"
    },
    "recentActivity": [
      // Recent test data similar to test history format
    ]
  }
}
```

### 4. API Key Management Endpoints

#### List API Keys
```
GET /api/v1/api-keys
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "df_12345678",
      "api_key_hash": "sha256:hash_value_here",
      "is_active": true,
      "created_at": "2025-06-01T10:00:00Z",
      "expires_at": "2026-06-01T10:00:00Z"
    },
    // More API keys...
  ]
}
```

#### Generate API Key
```
POST /api/v1/api-keys/generate
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "api_key": "sk-deffatest-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "name": "df_a1b2c3d4",
    "is_active": true,
    "created_at": "2025-07-01T12:00:00Z"
  }
}
```

#### Update API Key Status
```
PUT /api/v1/api-keys/status/{keyId}
```
**Request:**
```json
{
  "is_active": false
}
```
**Response:**
```json
{
  "success": true,
  "message": "API key status updated successfully"
}
```

#### Delete API Key
```
DELETE /api/v1/api-keys/revoke/{keyId}
```
**Response:**
```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 5. Payment Endpoints

#### Change Plan
```
POST /api/payment/change-plan
```
**Request:**
```json
{
  "plan_type": "chaos"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Plan change initiated. You will be redirected to complete payment."
}
```

#### Get Paddle Portal Link
```
GET /api/user/paddle-portal-link
```
**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://customers.paddle.com/customer/portal/12345"
  }
}
```

### 6. Webhook Handlers

#### Paddle Webhook
```
POST /paddle/webhook
```
**Request:**
```json
{
  "id": "web_wh_bG9yZW1pcHN1bQ",
  "event_type": "transaction.completed",
  "data": {
    "id": "txn_1_bG9yZW1pcHN1bQ",
    "status": "completed",
    "customer": {
      "id": "ctm_01h9rypm60zg5v2n3cavwedmyf",
      "email": "user@example.com"
    },
    "items": [
      {
        "price": {
          "id": "pri_01jys1q85m44rjw1w1csssaank",
          "description": "DEFFATEST Chaos Plan Monthly"
        }
      }
    ]
  }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

## ⚙️ Implementation Requirements

### 1. Test Processing Engine

#### Test Queue Management Flow
1. **Test Submission Handling**:
   - Accept test with validation (file type, size, URL validity)
   - Store test details in `tests` table with status = 'queued'
   - For file uploads:
     - Generate unique UUID for the test
     - Save file to `/storage/test-uploads/{uuid}/{filename}`
     - Store file path in `test_file_path` column

2. **Queue Management System**:
   - Implement priority-based queue:
     - Chaos plan: Highest priority (level 3)
     - Pro plan: Medium priority (level 2)
     - Free plan: Lowest priority (level 1)
   - Track available test slots per plan type:
     - Free: 1 concurrent slot
     - Pro: 4 concurrent slots (2 web, 2 app)
     - Chaos: 8 concurrent slots (4 web, 4 app)
   - Update `progress` field in real-time during test

3. **Test Execution Process**:
   - For web_url tests:
     - Launch headless browser
     - Navigate to target URL
     - Execute AI testing agent
   - For web_bundle tests:
     - Extract bundle to temporary directory
     - Start local server
     - Launch headless browser and test
   - For android_apk tests:
     - Install APK on emulator
     - Launch app and execute AI testing agent
   - Update test status to 'processing_results' when test completes

4. **Result Processing**:
   - Generate test report with:
     - Bug details with screenshots and videos
     - Performance metrics
     - Security findings
   - Create ZIP archive with all artifacts
   - Upload to R2 storage with path structure:
     `/test-reports/{uuid}/full_report.zip`
   - Store R2 URL in `report_download_url` column
   - Update test status to 'completed'
   - Increment `bug_count` with total bugs found

5. **Test Cleanup**:
   - Remove temporary test files after completion
   - Retain artifacts in R2 storage for 30 days
   - Archive test data after 90 days

### 2. API Key Management

#### API Key Generation
1. Generate secure, random key with format: `sk-deffatest-{32-char-random-string}`
2. Create user-friendly display name (prefix): `df_{first-8-chars-of-random}`
3. Hash full key with SHA-256 for secure storage
4. Store in `api_keys` table with user_id, name, and hash
5. Return full key to user ONLY ONCE (never retrievable later)

#### API Key Usage Flow
1. Client includes key in Authorization header: `Authorization: Bearer sk-deffatest-abcdef123456`
2. Backend extracts key, computes hash, checks against stored hashes
3. Validates key is active and not expired
4. Verifies user has active Chaos plan
5. If valid, processes API request; otherwise returns 401 Unauthorized

#### API Key Management
1. **List**: Return all keys for user with sensitive data removed
2. **Generate**: Create and store new key, return full key once
3. **Deactivate/Reactivate**: Update is_active status
4. **Delete**: Remove key from database
5. **Track Usage**: Update last_used timestamp (optional)

### 3. Storage Integration

#### Cloudflare R2 Integration
- **Bucket Structure**:
  ```
  deffatest-storage/
  ├── test-uploads/
  │   └── {test-uuid}/
  │       └── {original-filename}
  ├── test-reports/
  │   └── {test-uuid}/
  │       ├── full_report.zip
  │       ├── bugs/
  │       │   └── {bug-id}/
  │       │       ├── screenshot-1.png
  │       │       ├── screenshot-2.png
  │       │       └── recording.mp4
  │       └── summary.json
  └── system-files/
      └── templates/
  ```

- **Upload Process**:
  1. Generate pre-signed URLs for secure direct uploads
  2. Implement multipart uploads for large files
  3. Set appropriate content types and metadata
  4. Generate time-limited download URLs for frontend

- **Security Controls**:
  1. Enforce strict CORS policies
  2. Implement access control based on test ownership
  3. Set up lifecycle policies for automatic cleanup

### 4. Webhook Handling

#### Paddle Integration
1. **Webhook Signature Verification**:
   - Extract Paddle-Signature header
   - Split into timestamp and HMAC components
   - Verify signature using webhook secret
   - Reject if invalid or older than 5 minutes

2. **Event Processing**:
   - Store webhook in `processed_webhooks` table for idempotency
   - Process based on event_type:
     - `subscription.created`: Set up new subscription
     - `subscription.updated`: Update plan details
     - `subscription.cancelled`: Downgrade to free plan
     - `transaction.completed`: Update payment status
   - Update user profile with new plan details

3. **Plan Updates**:
   - Update `plan_type` and `subscription_status` in profile
   - Set `current_billing_period_ends_at` from webhook data
   - Update `concurrent_test_slots` based on plan
   - Reset `tests_this_month_count` on plan upgrade
   - Update `max_test_duration_minutes` based on plan

### 5. Real-time Updates

#### WebSocket Implementation
1. **Connection Management**:
   - Authenticate connections using JWT
   - Map connections to user_id
   - Create rooms for each test_id

2. **Event Types**:
   - `test.progress`: Updates on test progress percentage
   - `test.status_change`: Notification of test status changes
   - `test.completed`: Test completion with results summary
   - `test.bug_found`: Real-time bug discovery notifications

3. **Implementation Details**:
   - Use Socket.IO or native WebSockets
   - Implement heartbeat mechanism
   - Handle reconnection logic
   - Broadcast updates to appropriate users

### 6. Authentication & Security

#### JWT Token Handling
1. **Token Generation**:
   - Generate access tokens with 15-minute expiry
   - Include user_id and role in payload
   - Sign with secure, rotated secret key

2. **Token Validation**:
   - Verify signature and expiry on each request
   - Check for token revocation
   - Extract user data for request processing

3. **Refresh Flow**:
   - Issue refresh token with 7-day expiry
   - Store refresh tokens securely
   - Implement token rotation on refresh

#### Security Measures
1. **Rate Limiting**:
   - Limit auth endpoints to 10 requests per minute
   - Limit API endpoints based on plan tier
   - Implement exponential backoff for failed attempts

2. **Input Validation**:
   - Validate all request parameters and body
   - Sanitize inputs to prevent injection attacks
   - Implement strict type checking

3. **Data Protection**:
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Implement proper access controls

## 🛠️ Technical Implementation Guidelines

### System Architecture

```
┌──────────────────┐       ┌───────────────┐       ┌──────────────────┐
│   API Gateway    │◄─────►│ Auth Service  │◄─────►│  Supabase Auth   │
└────────┬─────────┘       └───────────────┘       └──────────────────┘
         │                                               ▲
         ▼                                               │
┌──────────────────┐       ┌───────────────┐       ┌─────┴──────────┐
│   Core API       │◄─────►│ User Service  │◄─────►│ Supabase DB    │
└────────┬─────────┘       └───────────────┘       └────────────────┘
         │                                               ▲
         ▼                                               │
┌──────────────────┐       ┌───────────────┐       ┌─────┴──────────┐
│   Test Manager   │◄─────►│ Queue Service │◄─────►│ Redis Queue    │
└────────┬─────────┘       └───────────────┘       └────────────────┘
         │                                               ▲
         ▼                                               │
┌──────────────────┐       ┌───────────────┐       ┌─────┴──────────┐
│   Test Workers   │◄─────►│ Storage Svc   │◄─────►│ Cloudflare R2  │
└────────┬─────────┘       └───────────────┘       └────────────────┘
         │                                               ▲
         ▼                                               │
┌──────────────────┐       ┌───────────────┐       ┌─────┴──────────┐
│  WebSocket Srv   │◄─────►│ Paddle Wbhk   │◄─────►│ Paddle API     │
└──────────────────┘       └───────────────┘       └────────────────┘
```

### AI Testing Implementation

1. **Web Application Testing**:
   - Headless Chrome/Firefox browser automation
   - Computer vision for UI element detection
   - ML-based click path determination
   - Form filling with intelligent data generation
   - Responsive design testing across viewports
   - Performance metrics collection (load times, FPS, etc.)
   - DOM mutation observation
   - Error and exception capture
   - Network request monitoring
   - Accessibility issues detection (WCAG compliance)

2. **Mobile APK Testing**:
   - Android emulator integration
   - Appium-based automated exploration
   - Screen analysis using computer vision
   - Touch event simulation
   - Orientation and rotation testing
   - Battery and performance monitoring
   - API call interception
   - Crash detection and reproduction
   - UI responsiveness testing

3. **Bug Detection Algorithms**:
   - Visual anomaly detection with CNN
   - UI element state inconsistency detection
   - Response time outlier analysis
   - Error message pattern recognition
   - Memory leak detection
   - CPU/resource usage spikes identification
   - Network failure impact analysis
   - Security vulnerability scanning
   - Comparison with baseline performance metrics

4. **Report Generation**:
   - Automated step-by-step reproduction instructions
   - Issue prioritization by severity and impact
   - Screenshot annotation with problem highlighting
   - Video recording with issue timestamps
   - Root cause analysis suggestions
   - Fix recommendations
   - HTML and PDF report generation
   - Bug tracking system integration capabilities
   - Interactive HTML report with filterable issues

### Monthly Test Reset Function

Implement a scheduled function that runs daily to reset tests_this_month_count:

```sql
CREATE OR REPLACE FUNCTION reset_monthly_tests()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE profiles
    SET 
        tests_this_month_count = 0,
        last_monthly_reset_date = CURRENT_DATE
    WHERE 
        (last_monthly_reset_date IS NULL OR 
         last_monthly_reset_date < (CURRENT_DATE - INTERVAL '1 month')) AND
        subscription_status IN ('ACTIVE', 'TRIALING', 'FREE');
END;
$$;
```

### API Key Generation Function

Implement the API key generation function:

```sql
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid;
    v_plan_type text;
    v_api_key text;
    v_name text;
    v_api_key_hash text;
    v_key_id uuid;
    v_result json;
BEGIN
    -- Get the authenticated user ID
    v_user_id := auth.uid();
    
    -- Check if user has Chaos plan
    SELECT plan_type INTO v_plan_type
    FROM profiles
    WHERE user_id = v_user_id;
    
    IF v_plan_type != 'chaos' THEN
        RAISE EXCEPTION 'API Access is only available for Chaos Mode users';
    END IF;
    
    -- Generate a new API key
    v_api_key := 'sk-deffatest-' || encode(gen_random_bytes(24), 'hex');
    
    -- Create a name for display (first 8 characters after the prefix)
    v_name := 'df_' || substring(v_api_key from 13 for 8);
    
    -- Hash the API key for storage
    v_api_key_hash := encode(digest(v_api_key, 'sha256'), 'hex');
    
    -- Insert the new API key
    INSERT INTO api_keys (
        user_id,
        name,
        api_key_hash,
        is_active
    ) VALUES (
        v_user_id,
        v_name,
        v_api_key_hash,
        true
    )
    RETURNING id INTO v_key_id;
    
    -- Return the full API key (only shown once)
    v_result := json_build_object(
        'id', v_key_id,
        'api_key', v_api_key,
        'name', v_name,
        'is_active', true,
        'created_at', now()
    );
    
    RETURN v_result;
END;
$$;
```

## 🗃️ File Storage Structure

```
/storage
├── test-uploads/
│   ├── {test-uuid-1}/
│   │   └── original-app.apk
│   └── {test-uuid-2}/
│       └── web-bundle.zip
├── test-environments/
│   ├── {test-uuid-1}/
│   │   ├── apk/
│   │   └── logs/
│   └── {test-uuid-2}/
│       ├── extracted/
│       └── logs/
├── test-results/
│   ├── {test-uuid-1}/
│   │   ├── screenshots/
│   │   ├── videos/
│   │   ├── logs/
│   │   └── report.html
│   └── {test-uuid-2}/
│       └── ...
└── temp/
    └── processing/
```

## ⚡ Real-time WebSocket Events

The backend must implement these exact WebSocket events:

1. **Test Progress Updates**
```json
{
  "event": "test.progress",
  "data": {
    "test_id": "550e8400-e29b-41d4-a716-446655440000",
    "progress": 65,
    "status": "running",
    "message": "AI is actively testing your application"
  }
}
```

2. **Test Status Changes**
```json
{
  "event": "test.status_change",
  "data": {
    "test_id": "550e8400-e29b-41d4-a716-446655440000",
    "previous_status": "running",
    "new_status": "processing_results",
    "timestamp": "2025-07-01T12:15:00Z",
    "message": "Test completed, processing results"
  }
}
```

3. **Bug Discovery Notifications**
```json
{
  "event": "test.bug_found",
  "data": {
    "test_id": "550e8400-e29b-41d4-a716-446655440000",
    "bug_id": "bug-1",
    "severity": "critical",
    "title": "Checkout button unresponsive on mobile viewport",
    "timestamp": "2025-07-01T12:10:30Z"
  }
}
```

4. **Test Completion Notification**
```json
{
  "event": "test.completed",
  "data": {
    "test_id": "550e8400-e29b-41d4-a716-446655440000",
    "completed_at": "2025-07-01T12:15:00Z",
    "bug_count": {
      "critical": 2,
      "major": 5,
      "minor": 8,
      "total": 15
    },
    "report_download_url": "https://storage.r2.cloudflarestorage.com/test-reports/550e8400-e29b-41d4-a716-446655440000/full_report.zip"
  }
}
```

## 🔐 Security Requirements

1. **Authentication Security**:
   - Enforce minimum password length of 8 characters
   - Store password hashes using bcrypt with appropriate cost factor
   - Implement JWT-based authentication with short-lived tokens
   - Maintain a token blacklist for revoked tokens
   - Implement rate limiting for auth endpoints (10 requests per minute)
   - Lock accounts after 5 failed login attempts for 15 minutes

2. **API Security**:
   - Validate all request parameters against schemas
   - Implement CORS with appropriate origin restrictions
   - Add request signing for API key authentication
   - Set security headers (Content-Security-Policy, X-XSS-Protection, etc.)
   - Implement IP-based rate limiting for API endpoints
   - Log all API access attempts for audit purposes

3. **Data Security**:
   - Encrypt sensitive data in the database
   - Implement proper access controls through RLS
   - Sanitize all user inputs to prevent SQL injection
   - Validate file uploads for malware
   - Use secure, temporary URLs for file downloads
   - Set appropriate permissions on uploaded files

4. **Infrastructure Security**:
   - Deploy in isolated network segments
   - Implement WAF protection
   - Regular security scanning and patching
   - Secure secrets management
   - Regular backup and recovery testing
   - Implement monitoring and alerting for suspicious activities

## 📈 Performance Requirements

1. **API Response Times**:
   - Authentication endpoints: < 250ms
   - Data retrieval endpoints: < 500ms
   - Test submission: < 1s
   - Status updates: < 200ms

2. **Concurrency Handling**:
   - Support at least 100 concurrent users
   - Handle up to 50 simultaneous test submissions
   - Process up to 20 concurrent tests across all users

3. **Scalability Targets**:
   - Horizontal scaling for test workers
   - Efficient database query optimization
   - Intelligent caching of frequently accessed data
   - Stateless API design for easy load balancing

4. **Resource Utilization**:
   - Optimize memory usage in test workers
   - Implement efficient file handling
   - Manage database connections properly
   - Use asynchronous processing where appropriate

## 🔄 Test Processing Flow

1. **Test Submission**:
   ```mermaid
   sequenceDiagram
       participant User
       participant API
       participant Database
       participant Queue
       participant R2

       User->>API: Submit Test
       API->>API: Validate Request
       API->>Database: Create Test Record (status: queued)
       alt Has File Upload
           User->>API: Upload Test File
           API->>R2: Store File
           API->>Database: Update test_file_path
       end
       API->>Queue: Add Test to Queue
       API->>User: Return Test ID and Status
   ```

2. **Test Execution**:
   ```mermaid
   sequenceDiagram
       participant Queue
       participant Worker
       participant Database
       participant WebSocket
       participant R2

       Queue->>Worker: Dequeue Test
       Worker->>Database: Update Status (running)
       Worker->>WebSocket: Notify Progress Start
       loop Test Execution
           Worker->>Database: Update Progress
           Worker->>WebSocket: Notify Progress Update
       end
       Worker->>Database: Update Status (processing_results)
       Worker->>WebSocket: Notify Processing
       Worker->>R2: Upload Results
       Worker->>Database: Update Status (completed)
       Worker->>Database: Update report_download_url
       Worker->>WebSocket: Notify Completion
   ```

3. **API Key Usage**:
   ```mermaid
   sequenceDiagram
       participant Client
       participant API
       participant Database

       Client->>API: Request with API Key
       API->>API: Hash API Key
       API->>Database: Verify Key Hash
       Database->>API: Return Validation Result
       alt Valid Key
           API->>Database: Update last_used
           API->>Client: Process Request
       else Invalid Key
           API->>Client: Return 401 Unauthorized
       end
   ```

## 🧪 Testing Requirements

1. **Unit Tests**:
   - Test all service layer functions
   - Validate database operations
   - Test authentication flows
   - Verify API key handling
   - Test webhook signature verification

2. **Integration Tests**:
   - API endpoint tests with mock database
   - WebSocket communication tests
   - R2 storage integration tests
   - Payment webhook processing tests

3. **End-to-End Tests**:
   - Complete test submission and processing flow
   - Authentication and authorization tests
   - File upload and download tests
   - Plan upgrade/downgrade tests

4. **Load Testing**:
   - Simulate multiple concurrent users
   - Test queue handling under load
   - Measure API response times under load
   - Test WebSocket performance with many connections

## 📋 Implementation Timeline

1. **Phase 1 (Week 1-2)**:
   - Set up project structure
   - Implement authentication flows
   - Create database schema and migrations
   - Develop core API endpoints

2. **Phase 2 (Week 3-4)**:
   - Implement test queue management
   - Develop test worker architecture
   - Set up R2 storage integration
   - Implement basic test execution

3. **Phase 3 (Week 5-6)**:
   - Implement AI testing algorithms
   - Develop bug detection mechanisms
   - Create report generation system
   - Integrate WebSocket for real-time updates

4. **Phase 4 (Week 7-8)**:
   - Implement payment integration
   - Develop API key management
   - Create admin dashboard
   - Add monitoring and alerting

5. **Phase 5 (Week 9-10)**:
   - Comprehensive testing
   - Performance optimization
   - Security hardening
   - Documentation and deployment

## 🚀 Deployment Requirements

1. **Environment Setup**:
   - Development environment with local database
   - Staging environment with test data
   - Production environment with high availability

2. **Infrastructure**:
   - Containerized deployment with Docker
   - Orchestration with Kubernetes
   - Load balancer for API servers
   - Separate worker node pools for test execution
   - Database with proper backups and replication

3. **CI/CD Pipeline**:
   - Automated testing on push
   - Static code analysis
   - Vulnerability scanning
   - Automated deployment to staging
   - Promotion to production after approval

4. **Monitoring**:
   - Real-time performance monitoring
   - Error tracking and alerting
   - Resource utilization dashboards
   - User activity analytics
   - System health checks

## 📄 Documentation Requirements

1. **API Documentation**:
   - OpenAPI/Swagger documentation
   - Endpoint descriptions and examples
   - Authentication instructions
   - Error code explanations

2. **Internal Documentation**:
   - Architecture overview
   - Database schema documentation
   - Component interaction diagrams
   - Deployment procedures
   - Troubleshooting guides

3. **User Documentation**:
   - API integration guides
   - Webhook handling instructions
   - Report interpretation guidelines
   - Plan comparison and limitations

## 🔧 Maintenance & Support

1. **Backup & Recovery**:
   - Daily database backups
   - Point-in-time recovery capability
   - Regular restore testing
   - Disaster recovery plan

2. **Monitoring & Alerting**:
   - 24/7 system monitoring
   - Alert escalation procedures
   - Performance anomaly detection
   - Security incident response plan

3. **Update Procedures**:
   - Zero-downtime deployments
   - Database migration processes
   - Rollback procedures
   - Feature flag capabilities

4. **Support Workflow**:
   - Issue tracking system
   - User feedback collection
   - SLA definitions
   - Escalation procedures

This backend will serve as the foundation for the DEFFATEST platform, enabling revolutionary AI-powered testing capabilities that will transform how developers ensure software quality. The implementation should focus on security, scalability, and reliability while delivering a seamless user experience.