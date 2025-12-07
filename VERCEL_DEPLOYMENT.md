# Vercel Deployment Guide

## Environment Variables Setup

To deploy this application to Vercel, you **must** configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://xxxxxxxxxxxxx.supabase.co`
   - Find it in: Supabase Dashboard → Project Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public API key
   - Find it in: Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public`

3. **DEEPSEEK_API_KEY**
   - Your OpenRouter API key for DeepSeek models
   - Get it from: https://openrouter.ai/keys
   - This is used for the AI chat functionality

### How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - **Environment**: Select all (Production, Preview, Development)
4. Repeat for all three variables
5. **Redeploy** your application after adding variables

### Verification

After adding environment variables and redeploying, verify they're set correctly:

1. Go to your Vercel deployment
2. Check the build logs - you should not see Supabase connection errors
3. Test the application:
   - Sign up/Login should work
   - Dashboard should load products
   - Chat functionality should work

### Troubleshooting

**Error: "Your project's URL and API key are required"**
- ✅ Make sure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- ✅ Check that there are no extra spaces or quotes in the values
- ✅ Ensure variables are set for the correct environment (Production/Preview/Development)

**Error: "DeepSeek API key is not configured"**
- ✅ Make sure `DEEPSEEK_API_KEY` is set in Vercel
- ✅ Verify the API key is valid and has credits

**Build fails during prerendering**
- ✅ This usually means environment variables are missing
- ✅ Add all required variables and redeploy

### Important Notes

- Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` files to Git (already in `.gitignore`)
- Always use Vercel's environment variable settings for production
- After adding/changing environment variables, you must redeploy

