
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function getClassTime(booking, audience) {
  const localizedTime =
    audience === 'parent'
      ? booking.parentLocalStartTime
      : booking.mentorLocalStartTime;

  if (localizedTime) {
    return localizedTime;
  }

  return new Date(booking.startTimeUTC).toISOString();
}

function createJoinButton(classLink) {
  const safeLink = escapeHtml(classLink);

  return `
    <p style="margin:24px 0;">
      <a href="${safeLink}"
         style="display:inline-block;background:#f59e0b;color:#111827;
                padding:13px 22px;border-radius:8px;
                text-decoration:none;font-weight:bold;">
        Join Live Class
      </a>
    </p>
  `;
}

export async function sendBookingEmails({ booking, mentor }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('Email credentials are not configured.');
  }

  if (!booking || !mentor) {
    throw new Error('Booking or assigned mentor is missing.');
  }

  if (!booking.parentEmail || !mentor.email) {
    throw new Error('Parent email or mentor email is missing.');
  }

  if (!booking.meetingLink) {
    throw new Error('Booking meetingLink is missing.');
  }

  const classLink = booking.meetingLink;

  // Only allow links to your own deployed classroom or localhost for testing.
  let parsedLink;

  try {
    parsedLink = new URL(classLink);
  } catch {
    throw new Error('The classroom link is invalid.');
  }

  const allowedHosts = new Set([
    'code-young-trial-booking.vercel.app',
    'localhost',
    '127.0.0.1',
  ]);

  if (
    parsedLink.protocol !== 'https:' &&
    !(parsedLink.protocol === 'http:' &&
      ['localhost', '127.0.0.1'].includes(parsedLink.hostname))
  ) {
    throw new Error('The classroom link must use HTTPS.');
  }

  if (!allowedHosts.has(parsedLink.hostname)) {
    throw new Error('The classroom link host is not allowed.');
  }

  const parentName = booking.parentName || 'Parent';
  const childName = booking.childName || 'Student';
  const mentorName = mentor.name || 'Your assigned mentor';
  const subject = booking.subject || 'Trial Class';
  const parentTime = getClassTime(booking, 'parent');
  const mentorTime = getClassTime(booking, 'mentor');

  const from = `"CodeYoung" <${process.env.EMAIL_USER}>`;

  const parentMessage = {
    from,
    to: booking.parentEmail,
    subject: 'Your CodeYoung trial class is confirmed!',
    text: `
Hello ${parentName},

Your CodeYoung trial class has been confirmed.

Student: ${childName}
Subject: ${subject}
Mentor: ${mentorName}
Class time in your timezone: ${parentTime}
Duration: 30 minutes

Join your live class:
${classLink}

Please keep this link private.

Regards,
CodeYoung Team
    `.trim(),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1f2937;">
        <h2 style="color:#d97706;">Your trial class is confirmed!</h2>
        <p>Hello ${escapeHtml(parentName)},</p>
        <p>Your CodeYoung trial class has been successfully booked.</p>

        <div style="background:#f9fafb;padding:18px;border-radius:10px;">
          <p><strong>Student:</strong> ${escapeHtml(childName)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Mentor:</strong> ${escapeHtml(mentorName)}</p>
          <p><strong>Your local class time:</strong> ${escapeHtml(parentTime)}</p>
          <p><strong>Duration:</strong> 30 minutes</p>
        </div>

        ${createJoinButton(classLink)}

        <p>Please keep your classroom link private.</p>
        <p>Regards,<br>CodeYoung Team</p>
      </div>
    `,
  };

  const mentorMessage = {
    from,
    to: mentor.email,
    subject: 'New CodeYoung trial class assigned',
    text: `
Hello ${mentorName},

A new CodeYoung trial class has been assigned to you.

Student: ${childName}
Subject: ${subject}
Parent: ${parentName}
Class time in your timezone: ${mentorTime}
Duration: 30 minutes

Join your live class:
${classLink}

Please keep this link private.

Regards,
CodeYoung Team
    `.trim(),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1f2937;">
        <h2 style="color:#d97706;">New trial class assigned</h2>
        <p>Hello ${escapeHtml(mentorName)},</p>
        <p>A new CodeYoung trial class has been assigned to you.</p>

        <div style="background:#f9fafb;padding:18px;border-radius:10px;">
          <p><strong>Student:</strong> ${escapeHtml(childName)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Parent:</strong> ${escapeHtml(parentName)}</p>
          <p><strong>Mentor local time:</strong> ${escapeHtml(mentorTime)}</p>
          <p><strong>Duration:</strong> 30 minutes</p>
        </div>

        ${createJoinButton(classLink)}

        <p>Please keep your classroom link private.</p>
        <p>Regards,<br>CodeYoung Team</p>
      </div>
    `,
  };

  // Attempt both deliveries independently.
  const results = await Promise.allSettled([
    transporter.sendMail(parentMessage),
    transporter.sendMail(mentorMessage),
  ]);

  const parentSent = results[0].status === 'fulfilled';
  const mentorSent = results[1].status === 'fulfilled';

  if (!parentSent) {
    console.error(
      '[Email] Parent email failed:',
      results[0].reason?.message
    );
  }

  if (!mentorSent) {
    console.error(
      '[Email] Mentor email failed:',
      results[1].reason?.message
    );
  }

  return { parentSent, mentorSent };
}
