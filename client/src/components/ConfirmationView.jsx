
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Globe,
  Video,
  Copy,
  Check,
  Download,
  Sparkles,
  User,
  Star,
  Laptop,
  ExternalLink,
} from 'lucide-react';
import {
  getGoogleCalendarUrl,
  downloadIcsFile,
} from '../utils/calendar.js';

export default function ConfirmationView({
  booking,
  onBookAnother,
  onGoHome,
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: [
          '#F59E0B',
          '#D97706',
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
          '#EC4899',
        ],
      });
    } catch {
      // Confetti is optional.
    }
  }, []);

  if (!booking) return null;

  const mentor = booking.mentorId || {};
  const googleCalendarUrl = getGoogleCalendarUrl(booking);

  // Only allow valid HTTP(S) classroom URLs.
  const meetingLink = booking.meetingLink || '';
  let validMeetingLink = '';

  try {
    const parsedUrl = new URL(meetingLink);

    if (['http:', 'https:'].includes(parsedUrl.protocol)) {
      validMeetingLink = parsedUrl.href;
    }
  } catch {
    validMeetingLink = '';
  }

  const handleCopyLink = async () => {
    if (!validMeetingLink) {
      setCopyError('The classroom link is unavailable.');
      return;
    }

    try {
      await navigator.clipboard.writeText(validMeetingLink);
      setCopied(true);
      setCopyError('');

      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(
        'Copy failed. Click the classroom link to open it, or copy the URL manually.'
      );
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="celebration-badge">
          <CheckCircle2 size={44} />
        </div>

        <span
          className="badge badge-green"
          style={{ marginBottom: '14px' }}
        >
          Booking Confirmed • Mentor Assigned Instantly
        </span>

        <h1 className="confirmation-title">
          You're all set for the trial class!
        </h1>

        <p className="confirmation-subtitle">
          Classroom details and calendar invite have been reserved for{' '}
          <strong>{booking.parentName}</strong>{' '}
          ({booking.parentEmail}).
        </p>

        {/* Assigned mentor */}
        <div className="assigned-mentor-card">
          <img
            src={
              mentor.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
            }
            alt={mentor.name || 'Assigned mentor'}
            className="mentor-avatar"
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <span
                  className="badge badge-golden"
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    marginBottom: '4px',
                  }}
                >
                  Assigned 1:1 STEM Mentor
                </span>

                <div className="mentor-info-name">
                  {mentor.name || 'Your assigned mentor'}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#D97706',
                  fontWeight: 800,
                  fontSize: '15px',
                }}
              >
                <Star size={16} fill="#F59E0B" />
                {mentor.rating || '4.95'}
              </div>
            </div>

            {mentor.bio && (
              <p
                className="mentor-info-bio"
                style={{ marginTop: '6px' }}
              >
                {mentor.bio}
              </p>
            )}

            <div className="mentor-info-meta">
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Globe size={13} color="var(--primary)" />
                {mentor.timezone || 'Timezone unavailable'}
              </span>

              <span>•</span>

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Clock size={13} color="var(--primary)" />
                Hours: {mentor.operatingHours?.start || '--:--'} -{' '}
                {mentor.operatingHours?.end || '--:--'}
              </span>
            </div>
          </div>
        </div>

        {/* Parent and mentor local times */}
        <div className="dual-tz-card">
          <div className="tz-col">
            <div className="tz-col-header">
              <User size={14} color="#0D9488" />
              <span>
                Parent Local Time ({booking.parentTimezone})
              </span>
            </div>

            <div className="tz-col-time">
              {booking.parentLocalStartTime || 'Scheduled Time'}
            </div>

            <div className="tz-col-sub">
              Duration: 30 Minutes • Ends{' '}
              {booking.parentLocalEndTime || 'See calendar invite'}
            </div>
          </div>

          <div className="tz-divider" />

          <div className="tz-col">
            <div className="tz-col-header">
              <Globe size={14} color="#F59E0B" />
              <span>
                Mentor Local Time ({mentor.timezone || 'Local timezone'})
              </span>
            </div>

            <div className="tz-col-time">
              {booking.mentorLocalStartTime || 'Mentor Time'}
            </div>

            <div className="tz-col-sub">
              Mentor ends at{' '}
              {booking.mentorLocalEndTime || 'See calendar invite'}
            </div>
          </div>
        </div>

        {/* Clickable classroom link */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              textAlign: 'left',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 800,
              color: 'var(--text-dark)',
            }}
          >
            1:1 Live Video Classroom Link
          </div>

          <div
            className="meeting-link-box"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: '1 1 250px',
                minWidth: 0,
              }}
            >
              <Video
                size={20}
                color="#166534"
                style={{ flexShrink: 0 }}
              />

              {validMeetingLink ? (
                <a
                  href={validMeetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meeting-link-text"
                  aria-label="Open the trial classroom in a new tab"
                  style={{
                    color: '#166534',
                    overflowWrap: 'anywhere',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    flex: 1,
                    minWidth: 0,
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {validMeetingLink}
                </a>
              ) : (
                <span className="meeting-link-text">
                  Classroom link is unavailable.
                </span>
              )}
            </div>

            {validMeetingLink && (
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-secondary btn-sm"
                style={{ flexShrink: 0 }}
              >
                {copied ? (
                  <Check size={14} color="#10B981" />
                ) : (
                  <Copy size={14} />
                )}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
          </div>

          {copyError && (
            <p
              role="alert"
              style={{
                color: '#B91C1C',
                fontSize: '12px',
                marginTop: '8px',
              }}
            >
              {copyError}
            </p>
          )}

          {validMeetingLink && (
            <p style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '8px' }}>
              Click the green URL to open the demo classroom in a new tab.
            </p>
          )}
        </div>

        {/* Calendar actions */}
        <div
          style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '36px',
          }}
        >
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <Calendar size={16} color="#4285F4" />
            <span>Add to Google Calendar</span>
          </a>

          <button
            type="button"
            onClick={() => downloadIcsFile(booking)}
            className="btn btn-secondary"
          >
            <Download size={16} />
            <span>Download .ics Invite</span>
          </button>
        </div>

        {/* Session details */}
        <div
          style={{
            background: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            padding: '22px',
            textAlign: 'left',
            marginBottom: '36px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: 'var(--text-dark)',
              marginBottom: '12px',
            }}
          >
            Session Details &amp; Preparation
          </div>

          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--text-body)',
              padding: 0,
              margin: 0,
            }}
          >
            <li>
              <strong>Student:</strong> {booking.childName} (
              {booking.childAge} years old)
            </li>

            <li>
              <strong>Topic:</strong> {booking.subject}
            </li>

            <li
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Laptop size={14} color="var(--primary)" />
              <span>
                <strong>Device Required:</strong> Laptop or Desktop with
                Chrome/Edge, webcam, and microphone.
              </span>
            </li>

            <li>
              <strong>Reference ID:</strong>{' '}
              <code
                style={{
                  background: '#E2E8F0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  overflowWrap: 'anywhere',
                }}
              >
                {booking._id || 'Unavailable'}
              </code>
            </li>
          </ul>
        </div>

        {/* Footer actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={onBookAnother}
            className="btn btn-primary btn-lg btn-shimmer"
          >
            <Sparkles size={18} />
            <span>Book Another Trial Class</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="btn btn-secondary btn-lg"
          >
            <span>Back to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
}
