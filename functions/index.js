const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function createTransporter(senderEmail, senderPassword) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: senderEmail, pass: senderPassword }
  });
}

function customerEmailHtml(booking) {
  const name    = booking.customer?.name    || 'Valued Customer';
  const service = booking.service?.name     || 'Service';
  const price   = booking.service?.price    || '';
  const date    = booking.date              || '';
  const time    = booking.time              || '';
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0d0d0d;border-top:4px solid #c9a84c;">
        <tr><td style="padding:32px 40px;text-align:center;border-bottom:1px solid #1f1f1f;">
          <p style="color:#c9a84c;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 6px;">Coollooks23</p>
          <h1 style="color:#f2f0eb;font-size:26px;margin:0;letter-spacing:1px;">Booking Confirmed</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <p style="color:#c8c5bf;font-size:15px;margin:0 0 28px;">Hi <strong style="color:#f2f0eb;">${name}</strong>, you're all booked in. See you soon.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;margin-bottom:28px;">
            <tr style="border-bottom:1px solid #2a2a2a;">
              <td style="padding:14px 18px;color:#8a8880;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:40%;">Service</td>
              <td style="padding:14px 18px;color:#f2f0eb;font-size:15px;font-weight:600;">${service}${price ? ' — $' + price : ''}</td>
            </tr>
            <tr style="border-bottom:1px solid #2a2a2a;">
              <td style="padding:14px 18px;color:#8a8880;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Date</td>
              <td style="padding:14px 18px;color:#f2f0eb;font-size:15px;font-weight:600;">${date}</td>
            </tr>
            <tr>
              <td style="padding:14px 18px;color:#8a8880;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Time</td>
              <td style="padding:14px 18px;color:#f2f0eb;font-size:15px;font-weight:600;">${time}</td>
            </tr>
          </table>
          <p style="color:#8a8880;font-size:13px;margin:0;">Need to reschedule? Reply to this email or call us directly.</p>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #1f1f1f;text-align:center;">
          <p style="color:#8a8880;font-size:12px;margin:0;">Coollooks23 Barbershop &bull; See you in the chair</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function barberEmailHtml(booking) {
  const name    = booking.customer?.name  || 'Unknown';
  const email   = booking.customer?.email || '';
  const phone   = booking.customer?.phone || '';
  const service = booking.service?.name   || 'Service';
  const price   = booking.service?.price  || '';
  const date    = booking.date            || '';
  const time    = booking.time            || '';
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0d0d0d;border-top:4px solid #c9a84c;">
        <tr><td style="padding:28px 40px;border-bottom:1px solid #1f1f1f;">
          <p style="color:#c9a84c;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 4px;">New Booking</p>
          <h2 style="color:#f2f0eb;font-size:22px;margin:0;">${name}</h2>
        </td></tr>
        <tr><td style="padding:28px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;">
            <tr style="border-bottom:1px solid #2a2a2a;">
              <td style="padding:12px 16px;color:#8a8880;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:35%;">Service</td>
              <td style="padding:12px 16px;color:#f2f0eb;font-size:14px;">${service}${price ? ' — $' + price : ''}</td>
            </tr>
            <tr style="border-bottom:1px solid #2a2a2a;">
              <td style="padding:12px 16px;color:#8a8880;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Date</td>
              <td style="padding:12px 16px;color:#f2f0eb;font-size:14px;">${date} at ${time}</td>
            </tr>
            <tr style="border-bottom:1px solid #2a2a2a;">
              <td style="padding:12px 16px;color:#8a8880;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</td>
              <td style="padding:12px 16px;color:#f2f0eb;font-size:14px;">${email}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;color:#8a8880;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Phone</td>
              <td style="padding:12px 16px;color:#f2f0eb;font-size:14px;">${phone}</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function reminderEmailHtml(booking) {
  const name    = booking.customer?.name || 'Valued Customer';
  const service = booking.service?.name  || 'Service';
  const time    = booking.time           || '';
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0d0d0d;border-top:4px solid #c9a84c;">
        <tr><td style="padding:32px 40px;text-align:center;border-bottom:1px solid #1f1f1f;">
          <p style="color:#c9a84c;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 6px;">Reminder</p>
          <h1 style="color:#f2f0eb;font-size:24px;margin:0;">Your appointment is tomorrow</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <p style="color:#c8c5bf;font-size:15px;margin:0 0 20px;">Hi <strong style="color:#f2f0eb;">${name}</strong>, just a heads-up — you have a booking tomorrow.</p>
          <p style="color:#f2f0eb;font-size:16px;font-weight:600;margin:0 0 6px;">${service}</p>
          <p style="color:#c9a84c;font-size:22px;font-weight:700;margin:0 0 28px;">${time}</p>
          <p style="color:#8a8880;font-size:13px;margin:0;">Need to reschedule? Reply to this email or call us directly.</p>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #1f1f1f;text-align:center;">
          <p style="color:#8a8880;font-size:12px;margin:0;">Coollooks23 Barbershop</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── TRIGGER: NEW BOOKING ─────────────────────────────────────────────────────

exports.onNewBooking = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap) => {
    const booking = snap.data();

    const settingsDoc = await db.collection('settings').doc('notifications').get();
    if (!settingsDoc.exists) return null;
    const s = settingsDoc.data();

    if (!s.senderEmail || !s.senderPassword) {
      console.log('No sender credentials configured — skipping notifications');
      return null;
    }

    const transporter = createTransporter(s.senderEmail, s.senderPassword);
    const sends = [];

    if (s.emailCustomer !== false && booking.customer?.email) {
      sends.push(transporter.sendMail({
        from: `Coollooks23 <${s.senderEmail}>`,
        to: booking.customer.email,
        subject: 'Booking Confirmed — Coollooks23',
        html: customerEmailHtml(booking)
      }));
    }

    if (s.notifyBarber && s.barberEmail) {
      sends.push(transporter.sendMail({
        from: `Coollooks23 <${s.senderEmail}>`,
        to: s.barberEmail,
        subject: `New Booking — ${booking.customer?.name || 'Guest'} on ${booking.date} at ${booking.time}`,
        html: barberEmailHtml(booking)
      }));
    }

    await Promise.all(sends);
    return null;
  });

// ─── SCHEDULED: 24-HOUR REMINDERS ────────────────────────────────────────────
// Runs every morning at 8am Sydney time.
// Enable Cloud Scheduler in the Firebase console for this to work.

exports.sendReminders = functions.pubsub
  .schedule('0 8 * * *')
  .timeZone('Australia/Sydney')
  .onRun(async () => {
    const settingsDoc = await db.collection('settings').doc('notifications').get();
    if (!settingsDoc.exists) return null;
    const s = settingsDoc.data();

    if (!s.reminder24h || !s.senderEmail || !s.senderPassword) return null;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const snap = await db.collection('bookings')
      .where('date', '==', tomorrowStr)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    if (snap.empty) return null;

    const transporter = createTransporter(s.senderEmail, s.senderPassword);

    await Promise.all(snap.docs.map(doc => {
      const booking = doc.data();
      if (!booking.customer?.email) return Promise.resolve();
      return transporter.sendMail({
        from: `Coollooks23 <${s.senderEmail}>`,
        to: booking.customer.email,
        subject: 'Reminder: Your appointment is tomorrow — Coollooks23',
        html: reminderEmailHtml(booking)
      });
    }));

    return null;
  });
