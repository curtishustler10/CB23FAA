# n8n Booking System Automation

## Architecture

```
USER                    n8n                      SUPABASE           STRIPE
  │                      │                         │                  │
  │── Book ────────────▶│                         │                  │
  │                      │── Create booking ──────▶│                  │
  │                      │                         │                  │
  │                      │◀── Confirm ────────────│                  │
  │                      │                         │                  │
  │                      │── Create/check ────────▶│                  │
  │                      │   customer              │                  │
  │                      │                         │                  │
  │                      │◀── Customer ID ────────│                  │
  │                      │                         │                  │
  │                      │── Create subscription ──────────────────▶│
  │                      │                         │                  │
  │                      │◀── Subscription ID ──────────────────│
  │                      │                         │                  │
  │                      │── Update booking ──────▶│                  │
  │                      │── Send confirmation ────▶│ (email)        │
  │                      │                         │                  │
  │◀── Confirmation ────│                         │                  │
```

---

## n8n Workflows

### 1. Booking Flow

**Trigger:** Webhook from website widget

**Steps:**
1. Receive booking data (name, email, service, date, time)
2. Validate availability (check for conflicts)
3. Create customer in Supabase
4. Create booking record
5. Generate booking confirmation
6. Send email to client
7. Send notification to owner

```
Webhook → Check Availability → Create Customer → Create Booking → Send Email → Notify Owner
```

---

### 2. Subscription/Payment Flow

**Trigger:** Booking created OR Stripe webhook

**For Subscription Model ($70/mo):**

1. Check if customer exists in Stripe
2. If not, create Stripe customer
3. Create subscription ($70/mo)
4. Store subscription ID in Supabase
5. Send welcome email

```
Booking Created → Find/Create Stripe Customer → Create Subscription → Store ID → Send Welcome
```

---

### 3. Webhook Handlers

**Stripe Webhooks:**
- `invoice.paid` → Update booking status, send confirmation
- `invoice.payment_failed` → Notify owner, pause booking
- `customer.subscription.updated` → Update status

**Webhook:**
- `booking.cancelled` → Cancel subscription, notify owner

---

### 4. Reminder Flow

**Trigger:** Scheduled (daily at 8am)

1. Query tomorrow's bookings
2. Send reminder email/SMS to clients
3. Send daily summary to owner

```
Scheduled (Daily 8AM) → Query Tomorrow's Bookings → Send Reminders → Send Summary
```

---

### 5. Admin Notifications

| Event | Notification |
|-------|---------------|
| New Booking | Email to owner |
| Booking Cancelled | Email to owner |
| Payment Failed | Email to owner + client |
| New Subscription | Email to owner |
| Daily Summary | Morning email with all bookings |

---

## Database Schema (Supabase)

### users table
```sql
id (uuid, PK)
email (text)
phone (text)
name (text)
stripe_customer_id (text)
created_at (timestamp)
```

### services table
```sql
id (uuid, PK)
name (text)
duration_minutes (int)
price (decimal)
category (text)
```

### bookings table
```sql
id (uuid, PK)
user_id (uuid, FK)
service_id (uuid, FK)
date_time (timestamp)
status (text) -- confirmed, cancelled, completed
stripe_subscription_id (text)
notes (text)
created_at (timestamp)
```

### subscriptions table
```sql
id (uuid, PK)
user_id (uuid, FK)
stripe_subscription_id (text)
status (text) -- active, paused, cancelled
current_period_end (timestamp)
```

---

## n8n Nodes Used

| Node | Purpose |
|------|---------|
| Webhook | Receive bookings |
| Supabase | Database operations |
| Stripe | Payments & subscriptions |
| Gmail/Email | Send confirmations |
| Telegram | Notify owner |
| Function | Data transformation |
| IF | Conditional logic |
| Schedule | Daily reminders |

---

## Cost

| Resource | Cost |
|----------|------|
| n8n (self-hosted) | $0 |
| Supabase (free tier) | $0 |
| Stripe | 2.9% + 30¢ per transaction |
| Gmail (n8n) | $0 |

---

## Integration with Website

**Widget Code:**
```html
<script src="https://your-domain.com/booking-widget.js"></script>
<div id="booking-widget" data-shop="coollooks23"></div>
```

**Embed Option:**
```html
<iframe src="https://your-domain.com/widget/coollooks23" width="100%" height="600"></iframe>
```

---

## Setup Checklist

- [ ] Create Supabase project
- [ ] Create database tables
- [ ] Set up n8n
- [ ] Connect Stripe
- [ ] Create booking workflow
- [ ] Create payment workflow
- [ ] Create reminder workflow
- [ ] Build widget
- [ ] Test end-to-end
- [ ] Deploy to website
