# Netlify Deployment Guide for DEFFATEST Frontend

## Important: Environment Variables Required

The following environment variables MUST be set in your Netlify dashboard before deployment:

### 1. Go to Netlify Dashboard
- Navigate to your site's settings
- Go to "Site configuration" → "Environment variables"

### 2. Add These Required Variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://njtxcvonqdpsmjsczbbd.supabase.co
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>

# API Backend URL
VITE_API_BASE_URL=https://api.deffatest.online

# Paddle Configuration
VITE_PADDLE_CLIENT_TOKEN=live_09ed53acf46a3d5e4cc657c32bf
```

### 3. Fixing the Secrets Scanning Issue

Netlify is detecting hardcoded secrets in your build output. We've already updated the code to:

1. **Removed all hardcoded secrets** from the source files
2. **Use environment variables exclusively** for sensitive data
3. **Added proper error handling** for missing environment variables

### 4. Build Settings

Ensure your build settings in Netlify are:
- **Base directory**: (leave empty or set to your repo root)
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 5. Additional Netlify Configuration

If secrets scanning continues to be an issue, you can:

#### Option A: Disable Secrets Scanning (Not Recommended for Production)
Add this environment variable:
```
SECRETS_SCAN_ENABLED=false
```

#### Option B: Omit Specific Paths from Scanning
Add this environment variable:
```
SECRETS_SCAN_OMIT_PATHS=dist/assets/*.js
```

### 6. Paddle Checkout Issues

The Paddle checkout should now work correctly with the following fixes applied:

1. **Proper Paddle Billing v2 initialization** with token-only setup
2. **Production environment** set correctly
3. **Valid price IDs** configured for all plans
4. **Error handling** for missing configuration

### 7. Verify Paddle Setup

Make sure in your Paddle Dashboard:
1. You're using **Paddle Billing** (not Classic)
2. Your products and prices are **active**
3. The client token matches what's in your Paddle settings
4. Webhook endpoints are configured if needed

### 8. Testing After Deployment

Once deployed, test:
1. Check browser console for any errors
2. Try clicking on a pricing plan
3. Verify Paddle checkout opens correctly
4. Check that environment variables are loaded (no console warnings)

## Troubleshooting

### If Paddle Checkout Doesn't Open:
1. Check browser console for errors
2. Verify VITE_PADDLE_CLIENT_TOKEN is set in Netlify
3. Ensure you're using the correct Paddle environment (production)
4. Check that price IDs match your Paddle dashboard

### If Build Still Fails Due to Secrets:
1. Clear Netlify build cache
2. Trigger a new deployment
3. Ensure no .env file is committed to the repository
4. Check that all environment variables are set in Netlify dashboard

## Security Best Practices

1. **Never commit .env files** to your repository
2. **Always use environment variables** for sensitive data
3. **Rotate API keys regularly**
4. **Use Netlify's environment variables** for all secrets
5. **Keep webhook secrets** server-side only

## Contact Support

If issues persist after following this guide:
1. Check Netlify build logs for specific errors
2. Verify all environment variables are correctly set
3. Ensure Paddle account is properly configured for production
