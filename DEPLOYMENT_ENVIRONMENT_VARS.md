# DEFFATEST Frontend - Environment Variables Configuration

## Important Note About VITE Variables

All environment variables prefixed with `VITE_` are **intentionally public** and will be bundled into the client-side JavaScript code. This is by design and these are NOT secrets:

### Public Frontend Variables (Safe to Expose)

1. **VITE_SUPABASE_URL** 
   - This is your Supabase project URL
   - It's meant to be public and is safe to expose
   - Example: `https://njtxcvonqdpsmjsczbbd.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**
   - This is the anonymous/public key for Supabase
   - It's specifically designed to be used in client-side code
   - It has limited permissions controlled by Row Level Security (RLS) policies
   - This is NOT your service key (which should never be exposed)

3. **VITE_PADDLE_CLIENT_TOKEN**
   - This is the client-side token for Paddle payments
   - It's meant to be used in the browser for checkout
   - This is NOT your Paddle secret key or webhook secret

4. **VITE_API_BASE_URL**
   - The public API endpoint URL
   - Example: `https://api.deffatest.online`

## Why Netlify Secret Scanning Flags These

Netlify's secret scanner detects these values in the build output because Vite bundles them directly into the JavaScript files. This is expected behavior for frontend applications. We've configured `netlify.toml` to exclude these from secret scanning using:

```toml
SECRETS_SCAN_OMIT_KEYS = "VITE_API_BASE_URL,VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY,VITE_PADDLE_CLIENT_TOKEN"
```

## Setting Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to Site settings → Environment variables
3. Add the following variables:

```
VITE_SUPABASE_URL=https://njtxcvonqdpsmjsczbbd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....[your full anon key]
VITE_PADDLE_CLIENT_TOKEN=[your paddle client token]
VITE_API_BASE_URL=https://api.deffatest.online
```

## Security Best Practices

### ✅ DO:
- Use VITE_ prefix for any variables that need to be accessible in the frontend
- Use Supabase anon/public keys in the frontend
- Use Paddle client tokens in the frontend
- Implement Row Level Security (RLS) in Supabase to protect data

### ❌ DON'T:
- Never expose Supabase service keys
- Never expose Paddle webhook secrets or API keys
- Never expose database connection strings
- Never put actual secrets in VITE_ prefixed variables

## Backend Secrets (Keep These Private)

The following should ONLY be on your backend server, never in the frontend:
- Supabase Service Role Key
- Paddle Webhook Secret
- Database credentials
- API secret keys
- JWT signing secrets

## Troubleshooting Deployment

If you still get secret scanning errors after updating `netlify.toml`:

1. Make sure you've committed and pushed the updated `netlify.toml` file
2. Clear the Netlify build cache (Site settings → Build & deploy → Build settings → Clear cache and retry)
3. Trigger a new deployment

## Local Development

For local development, create a `.env` file (never commit this):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PADDLE_CLIENT_TOKEN=your_paddle_client_token
VITE_API_BASE_URL=http://localhost:3000
```

Remember: The `.env` file is for local development only and should be in `.gitignore`.
