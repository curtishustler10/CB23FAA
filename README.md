# Coollooks23 Booking System

Custom booking system for Coollooks23 Barberz, Slacks Creek.

## Services

| Service | Duration | Price |
|---------|----------|-------|
| Haircut | 35 min | $40 |
| Haircut + Beard | 40 min | $50 |
| High School Cuts | 30 min | $30 |
| Hair Dye (Black) | 15 min | $30 |
| Hair Dye/Bleach | 40 min | $70 |
| Pensioners Haircut | 30 min | $30 |
| Facials | 60 min | $100 |
| Braiding | 120 min | $200 |

## Operating Hours

Mon-Sat: 8:00 AM - 6:00 PM

## Getting Started

1. Create Supabase project
2. Run `database-schema.sql`
3. Set up n8n
4. Connect Stripe
5. Embed `booking-widget.html`

See `setup-guide.md` for details.

---

## Free Tier Limits — Current Stack

### Firebase Firestore (Spark / Free)

| Limit | Daily | Monthly |
|-------|-------|---------|
| Document reads | 50,000 | ~1.5M |
| Document writes | 20,000 | ~600K |
| Document deletes | 20,000 | — |
| Storage | — | 1 GiB total |

**In practice:** Each booking lifecycle = ~3–5 writes. Storage fits ~500,000–1,000,000 bookings. Customers are effectively unlimited. **Firestore is not a bottleneck.**

---

### EmailJS (Free)

| Limit | |
|-------|---|
| Emails per month | **200** |
| Templates | 2 |
| Email services | 1 |

**This is the real bottleneck.** Each booking fires ~3 emails (customer confirmation, admin notification, confirmed receipt). That equals ~66 bookings/month, or roughly 2 bookings/day.

**Upgrade path:**
- Basic — $15/month → 1,000 emails → ~333 bookings/month
- Pro — $35/month → 5,000 emails → sufficient for a busy 3-barber shop

---

### Netlify (Starter / Free)

| Limit | |
|-------|---|
| Bandwidth | 100 GB/month |
| Build minutes | 300/month |

Static HTML site. 100 GB serves tens of thousands of visitors. **Not a bottleneck.**

---

### Cloudinary (Free)

| Limit | |
|-------|---|
| Storage | 25 GB |
| Monthly credits | 25 |

Gallery images are small. **Not a bottleneck.**

---

### Summary

| Question | Answer |
|----------|--------|
| Bookings/day — system limit | Effectively unlimited |
| **Bookings/day — email limit** | **~2–3 on free EmailJS** |
| Bookings/month before emails fail | **~66** |
| Bookings saved in DB | ~500,000+ |
| Customers saved | Effectively unlimited |
| Email confirmations/month | **200 (hard cap)** |

> **Recommendation:** Upgrade EmailJS to Basic ($15/mo). That is the only spend required at this scale. Everything else on free tier is fine for a local barbershop.

---

## Known Limitations

- **EmailJS 3rd template blocked** — Free tier allows 2 templates only. The cancellation notification email template could not be added. EmailJS must be upgraded to Basic ($15/mo) to wire up the cancellation flow fully.

---

## Project Status

**Website: Fully functional.** All core features are live — booking system, barber selection, slot availability, multi-service + heads counter, email confirmations (customer + admin), admin dashboard with role-based barber logins, gallery, blog, privacy policy.

**Pending:** Customer to review, approve, and pay remaining project balance before handover.

---

## Post-Handover Options

Once the remaining balance is settled, the customer needs to decide how they want to continue with the admin panel and booking system:

### Option A — Monthly Retainer (recommended)
Covers system hosting support, minor fixes, and availability if anything breaks.
Suggested: **$79–$120/month**

### Option B — One-Time Handover Fee
Full ownership transferred, no ongoing support included. Future fixes billed separately.
Suggested: **$400–$600**

> **Note:** Option A is the better deal for both sides. The system runs on free/low-cost infrastructure so the monthly fee is pure margin. For the client it is cheaper than hiring a developer each time something needs attention. Recommend leading with Option A and offering Option B only if they push back on recurring costs.
