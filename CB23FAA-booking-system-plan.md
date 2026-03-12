# Project Plan: Custom Booking System

## For: CB23FAA - Coollooks Barberz 23

---

## Overview

**Build:** Custom booking system with subscription payments
**Tech Stack:** n8n + Supabase + Stripe
**Monthly Cost:** ~$0-5
**Client Price:** $70/month

---

## Features

### Must Have (MVP)
- [ ] Online booking widget (embeddable on website)
- [ ] Service selection & time slots
- [ ] User accounts (clients can book/manage)
- [ ] Recurring subscription billing ($70/mo)
- [ ] Admin dashboard (owner manages bookings)
- [ ] Booking notifications (email/SMS)

### Nice to Have
- [ ] Payment at booking vs subscription model
- [ ] Multi-staff support
- [ ] Calendar sync
- [ ] Review collection
- [ ] Package credits (e.g., 5 cuts = $300)

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Website    │────▶│    n8n     │────▶│  Supabase   │
│ (Widget)    │     │  (Backend)  │     │  (Database)│
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Stripe    │
                    │ (Payments)  │
                    └─────────────┘
```

---

## Implementation Steps

### Phase 1: Setup (Day 1)
- [ ] Create Supabase project
- [ ] Set up database tables
- [ ] Configure Stripe account
- [ ] Set up n8n instance

### Phase 2: Database (Day 1-2)
- [ ] Users table
- [ ] Services table
- [ ] Bookings table
- [ ] Subscriptions table

### Phase 3: Backend (n8n) (Day 2-3)
- [ ] Create booking workflow
- [ ] User registration/login
- [ ] Stripe payment flow
- [ ] Subscription management
- [ ] Webhook handlers

### Phase 4: Frontend Widget (Day 3-4)
- [ ] Booking form (HTML/JS widget)
- [ ] User dashboard
- [ ] Admin panel

### Phase 5: Integration (Day 4-5)
- [ ] Embed widget on website
- [ ] Test payments
- [ ] Notifications

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Setup | 1 day | ⬜ |
| Database | 1-2 days | ⬜ |
| Backend | 2-3 days | ⬜ |
| Frontend | 1-2 days | ⬜ |
| Integration | 1 day | ⬜ |

**Total: 5-8 days**

---

## What I Need from You (Curt)

1. **Client info:**
   - Exact services list with prices
   - Operating hours
   - Staff names (if multiple)

2. **Access:**
   - WordPress/admin access to website
   - Stripe account (or create one)
   - Email for notifications

3. **Decisions:**
   - Subscription vs per-booking payment?
   - Pay at booking or monthly subscription?
   - Any specific features needed?

---

## Cost to Run

| Item | Monthly Cost |
|------|-------------|
| Supabase | $0 (free tier) |
| n8n | $0 (self-hosted) |
| Stripe | 2.9% + 30¢ per tx |
| Email (n8n) | $0 (free tier) |

**Total: ~$0-5/month**

---

## Revenue

- Setup fee: $500-1000
- Monthly: $70
- Your cost: ~$5
- **Profit: ~$65/mo**

---

## Next Steps

1. Confirm features with client
2. Get service list + hours
3. Get Stripe account access
4. Start Phase 1

---

## Notes

_Waiting on client confirmation_
