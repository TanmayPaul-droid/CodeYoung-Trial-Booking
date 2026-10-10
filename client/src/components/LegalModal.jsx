import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, FileText, Cookie, Check, CheckCircle2 } from 'lucide-react';

export default function LegalModal({ isOpen, initialTab = 'privacy', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [cookiePreferences, setCookiePreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('codeyoung_cookie_consent');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      essential: true,
      analytics: true,
      preferences: true,
      marketing: false,
    };
  });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggle = (key) => {
    if (key === 'essential') return;
    setCookiePreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const savePreferences = (prefs = cookiePreferences) => {
    try {
      localStorage.setItem('codeyoung_cookie_consent', JSON.stringify(prefs));
    } catch (e) {
      // ignore
    }
    setToastMessage('Cookie settings updated successfully!');
    setTimeout(() => {
      setToastMessage('');
      onClose();
    }, 1200);
  };

  const handleAcceptAll = () => {
    const allEnabled = {
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true,
    };
    setCookiePreferences(allEnabled);
    savePreferences(allEnabled);
  };

  const handleRejectOptional = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    setCookiePreferences(essentialOnly);
    savePreferences(essentialOnly);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRadius: 'var(--radius-xl, 20px)',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px 16px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-teal" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                Legal & Governance
              </span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark, #0F172A)' }}>
              {activeTab === 'privacy' && 'Privacy Policy'}
              {activeTab === 'terms' && 'Terms of Service'}
              {activeTab === 'cookies' && 'Cookie Settings'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              transition: 'background 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 28px',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <button
            onClick={() => setActiveTab('privacy')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'privacy' ? 'white' : 'transparent',
              color: activeTab === 'privacy' ? 'var(--primary, #2563EB)' : '#64748B',
              boxShadow: activeTab === 'privacy' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <ShieldCheck size={15} />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'terms' ? 'white' : 'transparent',
              color: activeTab === 'terms' ? 'var(--primary, #2563EB)' : '#64748B',
              boxShadow: activeTab === 'terms' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <FileText size={15} />
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'cookies' ? 'white' : 'transparent',
              color: activeTab === 'cookies' ? 'var(--primary, #2563EB)' : '#64748B',
              boxShadow: activeTab === 'cookies' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Cookie size={15} />
            Cookie Settings
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '24px 28px',
            overflowY: 'auto',
            flex: 1,
            fontSize: '14px',
            lineHeight: '1.7',
            color: '#334155',
          }}
        >
          {toastMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ECFDF5',
                color: '#065F46',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '18px',
                fontWeight: 600,
                fontSize: '13px',
                border: '1px solid #A7F3D0',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{toastMessage}</span>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <p style={{ marginBottom: '16px', color: '#64748B' }}>
                <em>Last Updated: October 2026. Effective globally for all students, parents, and mentors.</em>
              </p>
              
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                1. Our Commitment to Student & Child Safety
              </h4>
              <p style={{ marginBottom: '16px' }}>
                Codeyoung is an accredited STEM.org learning provider deeply committed to safeguarding young learners. We strictly adhere to the Children's Online Privacy Protection Act (COPPA), GDPR-K guidelines, and worldwide data protection standards. We never monetize, sell, or advertise student personal information.
              </p>

              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                2. Information We Collect
              </h4>
              <p style={{ marginBottom: '16px' }}>
                We collect only the essential details necessary to provide tailored 1:1 mentorship and live class scheduling:
              </p>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px', listStyleType: 'disc' }}>
                <li>Parent contact details (name, email, phone number, and timezone) to coordinate trial sessions.</li>
                <li>Student's first name, age, and STEM track interests to curate suitable lesson plans.</li>
                <li>Session attendance records, code artifacts, and mentor progress evaluations.</li>
              </ul>

              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                3. Secure 1:1 Live Video Classrooms
              </h4>
              <p style={{ marginBottom: '16px' }}>
                Live 1:1 video sessions are conducted via encrypted peer connections. Lessons are monitored for quality control, pedagogy enhancement, and student child protection. Parents can review mentorship feedback or request session data deletion at any time.
              </p>

              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                4. Parental Rights & Data Deletion
              </h4>
              <p>
                Parents have full control over their child’s digital footprint. You can view, export, or permanently purge any profile data or project history by contacting privacy@codeyoung.com.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              <p style={{ marginBottom: '16px', color: '#64748B' }}>
                <em>Last Updated: October 2026. Standard terms for trial sessions and subscriptions.</em>
              </p>

              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                1. Eligibility & Parent Consent
              </h4>
              <p style={{ marginBottom: '16px' }}>
                All student registrations and free trial session bookings must be authorized by a parent or legal guardian aged 18 or above. By booking a trial session, you confirm consent for your child to participate in live video instruction with a verified mentor.
              </p>

              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                2. 1:1 Trial Class Booking & Attendance
              </h4>
              <p style={{ marginBottom: '16px' }}>
                Trial sessions are synchronized to your local timezone. Please ensure your child connects via a computer with a functional webcam, microphone, and stable internet. If you need to reschedule or cancel, please provide at least 2 hours notice via your confirmation link or customer support.
              </p>

              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                3. Student Intellectual Property
              </h4>
              <p style={{ marginBottom: '16px' }}>
                Students retain 100% intellectual ownership of all software, games, animations, robotics firmware, and websites created during Codeyoung classes. Codeyoung provides educational tools and guidance while celebrating students’ creative authorship.
              </p>

              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                4. Code of Conduct & Respectful Environment
              </h4>
              <p>
                We foster an encouraging, positive environment. Both mentors and learners are expected to treat one another with patience and mutual respect. Any violation of child safety guidelines will result in immediate termination of the session and account review.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div>
              <p style={{ marginBottom: '20px', color: '#64748B' }}>
                We use cookies and browser storage to optimize your trial booking experience, detect timezones accurately, and preserve your curriculum preferences. Choose which categories you permit below.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {/* Essential Cookies */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>Essential & Security Cookies</span>
                      <span className="badge badge-teal" style={{ fontSize: '11px' }}>Always Active</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                      Required for timezone synchronization, session authentication, CSRF security, and wizard booking state.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    style={{ marginTop: '4px', cursor: 'not-allowed' }}
                  />
                </div>

                {/* Preference Cookies */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Preferences & Localization
                    </span>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                      Remembers your preferred learning tracks (e.g. Scratch, Python, AI), chosen mentor filters, and local format.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookiePreferences.preferences}
                    onChange={() => handleToggle('preferences')}
                    style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                </div>

                {/* Analytics Cookies */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Performance & Analytics
                    </span>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                      Aggregated metrics that help us evaluate booking conversion speed and improve interactive student demos.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookiePreferences.analytics}
                    onChange={() => handleToggle('analytics')}
                    style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                </div>

                {/* Marketing Cookies */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Marketing & Communications
                    </span>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                      Allows us to deliver personalized reminder emails and promotional credits for seasonal STEM coding camps.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={() => handleToggle('marketing')}
                    style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '13px' }}
                >
                  Reject Non-Essential
                </button>
                <button
                  type="button"
                  onClick={() => savePreferences()}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '13px' }}
                >
                  Save Preferences
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="btn btn-primary btn-sm"
                  style={{
                    fontSize: '13px',
                    background: 'var(--primary-dark, #1D4ED8)',
                  }}
                >
                  Accept All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F8FAFC',
          }}
        >
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>
            Codeyoung Education Technologies © {new Date().getFullYear()}
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '13px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
