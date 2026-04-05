const functions = require('firebase-functions');
const admin     = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// ─── EMAILJS CONFIG ───────────────────────────────────────────────────────────
const EMAILJS_SVC        = 'service_5uftud9';
const EMAILJS_PK         = '4TD6bNFXZ5s96pSVY';
const EMAILJS_TPL_BARBER = 'template_lmtskhf';
const SITE_URL           = 'https://coollooksbarberz.com';

async function sendEmailJS(templateId, params) {
  const body = {
    service_id:      EMAILJS_SVC,
    template_id:     templateId,
    user_id:         EMAILJS_PK,
    template_params: params
  };
  if (process.env.EMAILJS_PRIVATE_KEY) {
    body.accessToken = process.env.EMAILJS_PRIVATE_KEY;
  }
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EmailJS ${res.status}: ${text}`);
  }
}

// ─── TRIGGER: NEW BOOKING ─────────────────────────────────────────────────────
// Fires on every new booking. Reads admins collection server-side (no permission
// issues) and sends barber + admin notification emails via EmailJS REST API.

exports.onNewBooking = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const bookingId     = context.params.bookingId;
    const booking       = snap.data();
    const selectedBarber = booking.barber || 'Any';
    const notifToken    = booking.notifToken || '';
    const custName      = booking.customer?.name  || 'Customer';
    const custEmail     = booking.customer?.email || '';
    const serviceLabel  = Array.isArray(booking.services)
      ? booking.services.map(s => s.name).join(', ')
      : (booking.service?.name || 'Service');
    const heads         = booking.heads || 1;
    const totalPrice    = booking.total_price != null ? booking.total_price : 0;
    const priceLabel    = '$' + Number(totalPrice).toFixed(2).replace(/\.00$/, '') +
                          (heads > 1 ? ` (${heads} heads)` : '');
    const dateLabel     = booking.date || '';
    const timeLabel     = booking.time || '';

    const emailLog = [];

    try {
      const adminSnap = await db.collection('admins').get();
      const allBarbers = [], adminAccounts = [];

      adminSnap.forEach(doc => {
        const d = doc.data();
        if (d.role === 'barber' && d.email) allBarbers.push(d);
        if (d.role === 'admin'  && d.email) adminAccounts.push(d);
      });

      const targets = selectedBarber === 'Any'
        ? allBarbers
        : allBarbers.filter(b => b.barber === selectedBarber);

      // Notify matched barber(s)
      for (const barberDoc of targets) {
        const base = `${SITE_URL}/barber-action.html?id=${bookingId}&barber=${encodeURIComponent(barberDoc.barber)}&token=${notifToken}`;
        try {
          await sendEmailJS(EMAILJS_TPL_BARBER, {
            to_email:       barberDoc.email,
            barber_name:    barberDoc.barber,
            customer_name:  custName,
            customer_email: custEmail,
            service_name:   serviceLabel,
            booking_date:   dateLabel,
            booking_time:   timeLabel,
            price:          priceLabel,
            confirm_link:   base + '&action=confirm',
            decline_link:   base + '&action=decline'
          });
          emailLog.push({ to: barberDoc.email, role: 'barber', name: barberDoc.barber, status: 'sent' });
        } catch (err) {
          emailLog.push({ to: barberDoc.email, role: 'barber', name: barberDoc.barber, status: 'failed', error: err.message });
        }
      }

      // Notify admin(s)
      for (const adminDoc of adminAccounts) {
        const base = `${SITE_URL}/barber-action.html?id=${bookingId}&barber=${encodeURIComponent(selectedBarber)}&token=${notifToken}`;
        try {
          await sendEmailJS(EMAILJS_TPL_BARBER, {
            to_email:       adminDoc.email,
            barber_name:    adminDoc.name || 'Admin',
            customer_name:  custName,
            customer_email: custEmail,
            service_name:   serviceLabel,
            booking_date:   dateLabel,
            booking_time:   timeLabel,
            price:          priceLabel,
            confirm_link:   base + '&action=confirm',
            decline_link:   base + '&action=decline'
          });
          emailLog.push({ to: adminDoc.email, role: 'admin', name: adminDoc.name || 'Admin', status: 'sent' });
        } catch (err) {
          emailLog.push({ to: adminDoc.email, role: 'admin', name: adminDoc.name || 'Admin', status: 'failed', error: err.message });
        }
      }
    } catch (err) {
      emailLog.push({ role: 'system', status: 'failed', error: 'admins fetch failed: ' + err.message });
    }

    await snap.ref.update({ email_log: emailLog });
    return null;
  });

// ─── SCHEDULED: 24-HOUR REMINDERS ────────────────────────────────────────────
// Runs every morning at 8am Sydney time.

exports.sendReminders = functions.pubsub
  .schedule('0 8 * * *')
  .timeZone('Australia/Sydney')
  .onRun(async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const snap = await db.collection('bookings')
      .where('date', '==', tomorrowStr)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    if (snap.empty) return null;

    // Reminder emails are handled per-booking via EmailJS if needed in future
    console.log(`${snap.size} reminder(s) due for ${tomorrowStr} — not yet wired`);
    return null;
  });
