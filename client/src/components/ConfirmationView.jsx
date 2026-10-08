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
  Share2,
  Sparkles,
  ArrowRight,
  User,
  Star,
} from 'lucide-react';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar.js';

export default function ConfirmationView({ booking, onBookAnother, onGoHome }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E5A62B', '#F5B731', '#10B981', '#3B82F6', '#EC4899'],
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }
  }, []);

  if (!booking) return null;

  const mentor = booking.mentorId || {};
  const googleCalendarUrl = getGoogleCalendarUrl(booking);

  const handleCopyLink = () => {
    if (booking.meetingLink) {
      navigator.clipboard.writeText(booking.meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        {/* Celebration Badge */}
        <div className="celebration-badge">
          <CheckCircle2 size={40} />
        </div>

        <span className="badge badge-green" style={{ marginBottom: '12px' }}>
          Booking Confirmed & Mentor Assigned
        </span>

        <h1 className="confirmation-title">You're all set for the trial class!</h1>
        <p className="confirmation-subtitle">
          A confirmation with classroom details has been scheduled for <strong>{booking.parentName}</strong> ({booking.parentEmail}).
        </p>

        {/* Assigned Mentor Card */}
        <div className="assigned-mentor-card">
          <img
            src={mentor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={mentor.name}
            className="mentor-avatar"
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="badge badge-golden" style={{ fontSize: '11px', padding: '3px 8px', marginBottom: '4px' }}>
                  Assigned 1:1 STEM Mentor
                </span>
                <div className="mentor-info-name">{mentor.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: 700, fontSize: '14px' }}>
                <Star size={16} fill="#D97706" /> {mentor.rating || '4.95'}
              </div>
            </div>

            <p className="mentor-info-bio" style={{ marginTop: '6px' }}>
              {mentor.bio}
            </p>

            <div className="mentor-info-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={13} /> {mentor.timezone}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> Hours: {mentor.operatingHours?.start} - {mentor.operatingHours?.end}
              </span>
            </div>
          </div>
        </div>

        {/* Dual Timezone Card - Crucial PRD requirement */}
        <div className="dual-tz-card">
          {/* Parent Timezone Column */}
          <div className="tz-col">
            <div className="tz-col-header">
              <User size={14} color="#0D9488" />
              <span>Parent Local Time ({booking.parentTimezone})</span>
            </div>
            <div className="tz-col-time">
              {booking.parentLocalStartTime || 'Scheduled Time'}
            </div>
            <div className="tz-col-sub">
              Duration: 30 Minutes • Ends {booking.parentLocalEndTime}
            </div>
          </div>

          <div className="tz-divider" />

          {/* Mentor Timezone Column */}
          <div className="tz-col">
            <div className="tz-col-header">
              <Globe size={14} color="#E5A62B" />
              <span>Mentor Local Time ({mentor.timezone})</span>
            </div>
            <div className="tz-col-time">
              {booking.mentorLocalStartTime || 'Mentor Time'}
            </div>
            <div className="tz-col-sub">
              Mentor ends at {booking.mentorLocalEndTime}
            </div>
          </div>
        </div>

        {/* Meeting Link Box */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ textAlign: 'left', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>
            1:1 Live Video Classroom Link
          </div>
          <div className="meeting-link-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Video size={20} color="#2563EB" />
              <div className="meeting-link-text">{booking.meetingLink}</div>
            </div>
            <button
              onClick={handleCopyLink}
              className="btn btn-secondary btn-sm"
              style={{ flexShrink: 0 }}
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Calendar Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <Calendar size={16} />
            <span>Add to Google Calendar</span>
          </a>

          <button
            onClick={() => downloadIcsFile(booking)}
            className="btn btn-secondary"
          >
            <Download size={16} />
            <span>Download .ics Invite</span>
          </button>
        </div>

        {/* Student & Course Summary Details */}
        <div
          style={{
            background: '#F9FAFB',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '36px',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>
            Session Details & Preparation
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-body)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong>Student:</strong> {booking.childName} ({booking.childAge} years old)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong>Topic:</strong> {booking.subject}
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong>Device Required:</strong> Laptop or Desktop with Chrome/Edge, webcam, and microphone.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong>Reference ID:</strong> <code style={{ background: '#ECEFF1', padding: '2px 6px', borderRadius: '4px' }}>{booking._id}</code>
            </li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={onBookAnother} className="btn btn-primary btn-lg">
            <Sparkles size={18} />
            <span>Book Another Trial Class</span>
          </button>

          <button onClick={onGoHome} className="btn btn-secondary btn-lg">
            <span>Back to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
}
