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
