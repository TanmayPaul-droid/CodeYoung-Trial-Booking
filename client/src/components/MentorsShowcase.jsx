import React, { useEffect, useState } from 'react';
import { Star, Clock, Globe, Award, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MentorsShowcase({ onSelectMentor }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetch('https://codeyoung-trial-booking-2.onrender.com/api/mentors')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMentors(data.data);
        }
      })
      .catch((err) => console.error('Error fetching mentors:', err))
      .finally(() => setLoading(false));

    // Update time every 15 seconds for live clocks
    const interval = setInterval(() => setCurrentTime(new Date()), 15000);
    return () => clearInterval(interval);
  }, []);

  const getMentorLocalTime = (tz) => {
    try {
      return currentTime.toLocaleTimeString('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });
    } catch {
      return '';
    }
  };

  const isOperatingNow = (tz, opHours) => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).formatToParts(currentTime);
      const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
      const startH = parseInt(opHours?.start?.split(':')[0] || '9', 10);
      const endH = parseInt(opHours?.end?.split(':')[0] || '17', 10);
      return hour >= startH && hour < endH;
    } catch {
      return true;
    }
  };

  const filteredMentors = mentors.filter((m) => {
    if (selectedRegion === 'americas') return m.timezone?.includes('America');
    if (selectedRegion === 'europe') return m.timezone?.includes('Europe');
    if (selectedRegion === 'asia') return m.timezone?.includes('Asia') || m.timezone?.includes('Australia');
    return true;
  });

  return (
    <section id="mentors" style={{ padding: '90px 0 70px', position: 'relative' }}>
      <div className="content-wrapper">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <div className="announcement-pill" style={{ marginBottom: '14px' }}>
            <Award size={14} color="#D97706" />
            <span>TOP 1% CERTIFIED GLOBAL EDUCATORS</span>
          </div>
          <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
            Learn 1:1 with vetted STEM mentors worldwide
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: '1.6' }}>
            Operating strictly within their local daytime hours (09:00 - 17:00) with a strict daily quota
            of 2 classes, ensuring your child receives their peak energy and attention.
          </p>

          {/* Region Filter Tabs */}
          <div className="segmented-control" style={{ marginTop: '24px' }}>
            <button
              className={`segmented-tab ${selectedRegion === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedRegion('all')}
            >
              All Global ({mentors.length})
            </button>
            <button
              className={`segmented-tab ${selectedRegion === 'americas' ? 'active' : ''}`}
              onClick={() => setSelectedRegion('americas')}
            >
              Americas
            </button>
            <button
              className={`segmented-tab ${selectedRegion === 'europe' ? 'active' : ''}`}
              onClick={() => setSelectedRegion('europe')}
            >
              Europe & UK
            </button>
            <button
              className={`segmented-tab ${selectedRegion === 'asia' ? 'active' : ''}`}
              onClick={() => setSelectedRegion('asia')}
            >
              Asia & Pacific
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Synchronizing mentor network...</div>
            <p>Fetching active IANA profiles across 10 regions.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '24px' }}>
            {filteredMentors.map((mentor) => {
              const localTimeStr = getMentorLocalTime(mentor.timezone);
              const operating = isOperatingNow(mentor.timezone, mentor.operatingHours);

              return (
                <div
                  key={mentor._id}
                  className="card card-interactive"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    borderRadius: 'var(--radius-xl)',
                    background: 'white',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2.5px solid var(--primary)',
                          boxShadow: '0 4px 10px var(--primary-glow)',
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)' }}>{mentor.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#D97706', fontWeight: 800, marginTop: '2px' }}>
                          <Star size={13} fill="#D97706" /> {mentor.rating} ({mentor.reviewCount} reviews)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Local Time & Status Pill */}
                  <div
                    style={{
                      background: operating ? '#F0FDF4' : '#F8FAFC',
                      border: `1px solid ${operating ? '#BBF7D0' : '#E2E8F0'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {operating ? (
                        <span className="status-radar">
                          <span className="status-radar-ping"></span>
                          <span className="status-radar-dot"></span>
                        </span>
                      ) : (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94A3B8' }}></span>
                      )}
                      <span style={{ fontWeight: 700, color: operating ? '#166534' : 'var(--text-muted)' }}>
                        {operating ? 'Active Shift' : 'Off-Duty'}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-dark)' }}>
                      {localTimeStr}
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5', minHeight: '40px' }}>
                    {mentor.bio}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {mentor.subjects?.map((sub, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-pill)',
                          background: '#F1F5F9',
                          color: 'var(--text-dark)',
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-light)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Globe size={12} color="var(--primary)" />
                      <span>Timezone: <strong>{mentor.timezone}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} color="var(--primary)" />
                      <span>Shift: <strong>{mentor.operatingHours.start} - {mentor.operatingHours.end}</strong> (Daily Cap: 2)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectMentor?.(mentor)}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 'auto', width: '100%', fontWeight: 700 }}
                  >
                    <Sparkles size={13} color="var(--primary)" />
                    <span>Match with {mentor.name.split(' ')[0]}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
