
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

  return localizedTime || new Date(booking.startTimeUTC).toISOString();
}

function createJoinButton(classLink) {
  return `
    <p style="margin:24px 0;">
      <a href="${escapeHtml(classLink)}"
         style="display:inline-block;background:#f59e0b;color:#111827;
                padding:13px 22px;border-radius:8px;
                text-decoration:none;font-weight:bold;">
        Join Live Class
      </a>
    </p>
  `;
}

function validateMeetingLink(classLink) {
  let url;

  try {
    url = new URL(classLink);
  } catch {
    throw new Error('The classroom link is invalid.');
  }

  const allowedHosts = new Set([
    'code-young-trial-booking.vercel.app',
    'localhost',
    '127.0.0.1',
  ]);

  const isLocalHost = ['localhost', '127.0.0.1'].includes(url.hostname);

  const validProtocol =
    url.protocol === 'https:' ||
    (url.protocol === 'http:' && isLocalHost);

  if (!validProtocol || !allowedHosts.has(url.hostname)) {
    throw new Error('The classroom link host or protocol is not allowed.');
  }
}

/**
 * Sends one email using the Mailjet Send API v3.1.
 *
 * Required environment variables:
 * MAILJET_API_KEY
 * MAILJET_SECRET_KEY
 * EMAIL_FROM
 */
async function sendOneEmail(message, label) {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;

  if (!apiKey || !secretKey) {
    console.error(
      `[Email] ${label} failed: Mailjet credentials are missing.`
    );
    return false;
  }

  const senderMatch = message.from.match(/^(.*?)\s*<([^>]+)>$/);

  const senderName = senderMatch
    ? senderMatch[1].trim()
    : 'CodeYoung';

  const senderEmail = senderMatch
    ? senderMatch[2].trim()
    : message.from.trim();

  const payload = {
    Messages: [
      {
        From: {
          Email: senderEmail,
          Name: senderName,
        },
        To: message.to.map((email) => ({
          Email: email,
        })),
        Subject: message.subject,
        TextPart: message.text,
        HTMLPart: message.html,
      },
    ],
  };

  try {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${apiKey}:${secretKey}`).toString('base64'),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      console.error(
        `[Email] ${label} failed: Mailjet returned an invalid response.`,
        `HTTP ${response.status}`
      );
      return false;
    }

    const mailResult = result?.Messages?.[0];

    if (!response.ok || mailResult?.Status !== 'success') {
      console.error(
        `[Email] ${label} failed. HTTP status: ${response.status}`,
        JSON.stringify(result)
      );
      return false;
    }

    const recipientResults = mailResult?.To;

    if (
      !Array.isArray(recipientResults) ||
      recipientResults.length !== message.to.length
    ) {
      console.error(
        `[Email] ${label}: Unexpected recipient results.`,
        JSON.stringify(result)
      );
      return false;
    }

    const failedRecipients = recipientResults.filter(
      (recipient) => recipient?.Message !== 'success'
    );

    if (failedRecipients.length > 0) {
      console.error(
        `[Email] ${label}: Some recipients were rejected.`,
        JSON.stringify(failedRecipients)
      );
      return false;
    }

    console.log(`[Email] ${label} accepted by Mailjet.`);
    return true;
  } catch (error) {
    console.error(
      `[Email] ${label} request failed:`,
      error.message
    );
    return false;
  }
}

export async function sendBookingEmails({ booking, mentor }) {
  if (
    !process.env.MAILJET_API_KEY ||
    !process.env.MAILJET_SECRET_KEY
  ) {
    throw new Error('Mailjet credentials are not configured.');
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

  validateMeetingLink(booking.meetingLink);

  const from =
    process.env.EMAIL_FROM ||
    'CodeYoung <paultanmay40@gmail.com>';

  console.log('[Email Debug] Parent recipient:', booking.parentEmail);
  console.log('[Email Debug] Mentor recipient:', mentor.email);
  console.log('[Email Debug] Sender:', from);

  const parentName = booking.parentName || 'Parent';
  const childName = booking.childName || 'Student';
  const mentorName = mentor.name || 'Your assigned mentor';
  const subject = booking.subject || 'Trial Class';

  const parentTime = getClassTime(booking, 'parent');
  const mentorTime = getClassTime(booking, 'mentor');
  const classLink = booking.meetingLink;

  const parentMessage = {
    from,
    to: [booking.parentEmail],
    subject: 'Your CodeYoung trial class is confirmed!',

    text: `Hello ${parentName},

Your CodeYoung trial class has been confirmed.

Student: ${childName}
Subject: ${subject}
Mentor: ${mentorName}
Class time in your timezone: ${parentTime}
Duration: 30 minutes

Join your class: ${classLink}

Please keep this link private.

Regards,
CodeYoung Team`,

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
    to: [mentor.email],
    subject: 'New CodeYoung trial class assigned',

    text: `Hello ${mentorName},

A new CodeYoung trial class has been assigned to you.

Student: ${childName}
Subject: ${subject}
Parent: ${parentName}
Class time in your timezone: ${mentorTime}
Duration: 30 minutes

Join your class: ${classLink}

Please keep this link private.

Regards,
CodeYoung Team`,

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

  const results = await Promise.allSettled([
    sendOneEmail(parentMessage, 'Parent email'),
    sendOneEmail(mentorMessage, 'Mentor email'),
  ]);

  return {
    parentSent:
      results[0].status === 'fulfilled' &&
      results[0].value === true,

    mentorSent:
      results[1].status === 'fulfilled' &&
      results[1].value === true,
  };
}
