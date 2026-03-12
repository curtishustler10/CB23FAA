# Phase 2: Setup Guide

## 1. Create Supabase Project

1. Go to: https://supabase.com
2. Create new project "coollooks23-booking"
3. Save your credentials:
   - Project URL: `https://xxxxx.supabase.co`
   - Service Role Key: `eyJxxxxx`

## 2. Run Database Schema

1. Go to Supabase → SQL Editor
2. Copy and paste contents of `database-schema.sql`
3. Run the query

## 3. Set up n8n

**Option A: Run on your server**
```bash
# Install n8n
npm install -g n8n

# Start n8n
n8n start
```

**Option B: Use n8n.cloud**
1. Go to https://n8n.io
2. Create account
3. Import workflow from `n8n-workflow-booking.json`

## 4. Connect Stripe

1. Go to https://stripe.com
2. Create account
3. Get API keys:
   - Publishable Key
   - Secret Key
4. Create Product: "Monthly Subscription" - $70/mo
5. Get Price ID

## 5. Environment Variables

Create `.env` file:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PRICE_ID=price_xxxxx
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/booking
```

---

## What I Created

| File | Status |
|------|--------|
| Database schema | ✅ Ready |
| n8n workflow | ✅ Ready |
| Booking widget | ✅ Ready |
| Setup guide | ✅ Complete |

---

## What's Needed Now

1. [ ] Create Supabase project
2. [ ] Run database schema
3. [ ] Set up n8n
4. [ ] Connect Stripe
5. [ ] Deploy widget

Do you have Supabase/Stripe accounts I can work with?
