import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, Globe, User, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function BookingsListModal({ isOpen, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.data);
        }
      })
      .catch((err) => console.error('Error fetching bookings:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen]);

  const handleResetSeed = async () => {
    if (!window.confirm('Reset database to original 10 mentors and clear existing test bookings?')) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch('/api/reset-seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage('Database reset and mentors reseeded successfully!');
        fetchBookings();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setResetting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: '920px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '32px',
          borderRadius: 'var(--radius-xl)',
          background: 'white',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-teal" style={{ marginBottom: '6px' }}>System Audit & Live Bookings</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>Live Trial Class Bookings ({bookings.length})</h3>
          </div>
          <button
            onClick={onClose}
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
            }}
          >
            <X size={18} />
          </button>
        </div>

        {message && (
          <div style={{ background: '#ECFDF5', color: '#065F46', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button onClick={fetchBookings} disabled={loading} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh Bookings</span>
          </button>

          <button onClick={handleResetSeed} disabled={resetting} className="btn btn-outline btn-sm">
            <span>Reset Demo DB</span>
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '6px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              No trial bookings created yet. Use the booking wizard to create your first class!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {bookings.map((b) => (
                <div
                  key={b._id}
                  style={{
                    border: '1.5px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    background: '#FFFDF9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge badge-green" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        Confirmed
                      </span>
                      <strong style={{ fontSize: '16px' }}>{b.childName} ({b.childAge} yrs)</strong>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>• {b.subject}</span>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-hover)' }}>
                      Assigned Mentor: <strong>{b.mentorId?.name || 'Assigned'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '13px', color: 'var(--text-body)' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Parent: </span>
                      {b.parentName} ({b.parentEmail})
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Parent Local: </span>
                      <strong>{b.parentLocalStartTime}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Mentor Local: </span>
                      <strong>{b.mentorLocalStartTime}</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>UTC: {new Date(b.startTimeUTC).toUTCString()}</span>
                    <span>•</span>
                    <span>Meeting: <code style={{ color: '#2563EB' }}>{b.meetingLink}</code></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
