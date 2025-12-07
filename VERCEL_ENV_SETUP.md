# Step-by-Step: Adding Environment Variables in Vercel

## Where to Add Environment Variables

**⚠️ Important:** Add these in **Vercel's Dashboard**, NOT in code files!

### Step-by-Step Instructions

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in to your account

2. **Select Your Project**
   - Click on your project name (e.g., "LoanPick" or "loan-product-dashboard")

3. **Navigate to Settings**
   - Click on **"Settings"** tab (top navigation bar)

4. **Go to Environment Variables**
   - In the left sidebar, click on **"Environment Variables"**

5. **Add Each Variable**

   Click the **"Add New"** button and add these three variables:

   #### Variable 1: NEXT_PUBLIC_SUPABASE_URL
   ```
   Name:  NEXT_PUBLIC_SUPABASE_URL
   Value: https://ufylpphxlpfeclfeheix.supabase.co
   Environment: ☑ Production ☑ Preview ☑ Development
   ```
   Click **"Save"**

   #### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   Name:  NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [Your Supabase anon key - get it from Supabase Dashboard]
   Environment: ☑ Production ☑ Preview ☑ Development
   ```
   Click **"Save"**

   #### Variable 3: DEEPSEEK_API_KEY
   ```
   Name:  DEEPSEEK_API_KEY
   Value: [Your OpenRouter API key]
   Environment: ☑ Production ☑ Preview ☑ Development
   ```
   Click **"Save"**

6. **Redeploy**
   - After adding all variables, go to **"Deployments"** tab
   - Click the **"..."** menu on your latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger a new deployment

## Where to Find the Values

### Supabase URL & Key
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### OpenRouter API Key
1. Go to: https://openrouter.ai/keys
2. Sign in or create account
3. Create a new API key
4. Copy the key → Use for `DEEPSEEK_API_KEY`

## Visual Guide

```
Vercel Dashboard
└── Your Project
    └── Settings (tab)
        └── Environment Variables (sidebar)
            └── Add New (button)
                ├── Name: NEXT_PUBLIC_SUPABASE_URL
                ├── Value: [paste your URL]
                └── Environment: [select all]
                    └── Save
```

## Verification

After adding variables and redeploying:
- ✅ Build should complete successfully
- ✅ No "Missing Supabase environment variables" errors
- ✅ Application should work when deployed

## Security Note

⚠️ **Never commit actual API keys or URLs to Git!**
- The `.gitignore` file already excludes `.env.local`
- Only add values in Vercel's dashboard
- Documentation files should NOT contain real values

