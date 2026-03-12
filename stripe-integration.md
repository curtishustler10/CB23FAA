# Stripe Subscription Integration

## Create Subscription Product

1. Go to Stripe Dashboard → Products
2. Create Product:
   - Name: "Coollooks23 Monthly Booking"
   - Price: $70/month
   - Recurring: Monthly
3. Copy the Price ID (starts with `price_`)

## Stripe Checkout Flow

```javascript
// Client-side: Create Checkout Session
const response = await fetch('/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    price_id: 'price_xxxxx',
    customer_email: 'customer@email.com'
  })
});

const { sessionId } = await response.json();
stripe.redirectToCheckout({ sessionId });
```

## n8n Stripe Nodes

### 1. Create Customer
- **Node:** Stripe > Create Customer
- **Email:** `{{ $json.email }}`
- **Name:** `{{ $json.name }}`

### 2. Create Subscription
- **Node:** Stripe > Create Subscription
- **Customer:** `{{ $json.stripe_customer_id }}`
- **Price:** `price_xxxxx`

### 3. Webhook for Payment Success
- **Trigger:** Stripe > Subscription Updated
- **Event:** `invoice.paid`
- **Action:** Update booking status to confirmed

---

## Subscription Webhook Handler

```
Stripe Webhook
       │
       ▼
IF: invoice.paid
       │
       ├──▶ Update user: subscription_active = true
       │
       └──▶ Send welcome email
```

---

## Test Mode

Use Stripe **Test Mode** keys:
- `sk_test_xxxxx` (secret)
- `pk_test_xxxxx` (publishable)

Test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
