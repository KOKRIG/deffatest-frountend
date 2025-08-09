# DEFFATEST Frontend Deployment Guide

## Netlify Deployment Instructions

### Prerequisites
- Netlify account
- GitHub/GitLab repository with the frontend code
- Environment variables ready

### Environment Variables Required

The following environment variables must be set in Netlify:

1. **VITE_SUPABASE_URL** - Your Supabase project URL
2. **VITE_SUPABASE_ANON_KEY** - Your Supabase anonymous key
3. **VITE_API_BASE_URL** - Backend API URL (e.g., `https://api.deffatest.online`)
4. **VITE_PADDLE_CLIENT_TOKEN** - Paddle client token for payment processing

### Setting Up Netlify Deployment

#### Step 1: Connect Repository
1. Log in to Netlify
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub/GitLab account
4. Select your repository

#### Step 2: Configure Build Settings
Build settings are automatically configured via `netlify.toml`, but verify:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

#### Step 3: Set Environment Variables
1. Go to Site settings → Environment variables
2. Click "Add a variable"
3. Add each required environment variable with its value
4. **Important**: Do NOT add `SECRETS_SCAN_OMIT_KEYS` here - it's already in netlify.toml

#### Step 4: Deploy
1. Trigger a deploy from the Netlify dashboard
2. Monitor the build logs for any errors

### Handling Secrets Scanning Issue

The `netlify.toml` file already includes configuration to prevent false positives from Netlify's secrets scanner:

```toml
[build.environment]
  SECRETS_SCAN_OMIT_KEYS = "VITE_API_BASE_URL"
```

This tells Netlify that `VITE_API_BASE_URL` is not a secret and can be safely embedded in the build.

### API Proxy Configuration

The `netlify.toml` includes proxy redirects for API calls:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://api.deffatest.online/api/:splat"
  status = 200
  force = true
```

This means frontend API calls to `/api/*` will be proxied to your backend, avoiding CORS issues.

### Local Development

For local development:

1. Copy `.env.example` to `.env`
2. Fill in your environment variables
3. Run `npm install`
4. Run `npm run dev`

### Troubleshooting

#### Build Fails Due to Secrets Scanning
- Verify `netlify.toml` is in the root directory
- Check that `SECRETS_SCAN_OMIT_KEYS` includes all non-sensitive variables

#### API Calls Not Working
- Verify `VITE_API_BASE_URL` is set correctly
- Check the proxy redirects in `netlify.toml`
- Ensure backend is running and accessible

#### Environment Variables Not Working
- Environment variables must start with `VITE_` to be accessible in the frontend
- Rebuild after changing environment variables in Netlify

### Production Checklist

- [ ] All environment variables set in Netlify
- [ ] `netlify.toml` present in repository root
- [ ] Backend API is running and accessible
- [ ] Supabase project is configured
- [ ] Paddle integration is set up
- [ ] CORS is properly configured on backend

### Security Notes

- Never commit `.env` files to version control
- `VITE_API_BASE_URL` is a public URL, not a secret
- Keep `VITE_SUPABASE_ANON_KEY` secure but note it's meant to be public
- Never expose backend secret keys in frontend code
