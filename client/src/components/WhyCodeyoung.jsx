import React, { useState, useEffect } from 'react';
import { Target, Users2, Trophy, Clock, Star, HeartHandshake, CheckCircle2, Globe, Shield, Sparkles } from 'lucide-react';

export default function WhyCodeyoung() {
  const [worldTimes, setWorldTimes] = useState({
    ny: '',
    london: '',
    kolkata: '',
    sg: '',
  });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setWorldTimes({
        ny: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }),
        london: now.toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }),
        kolkata: now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }),
        sg: now.toLocaleTimeString('en-US', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit' }),
      });
    };
    updateTimes();
    const interval = setInterval(updateTimes, 10000);
    return () => clearInterval(interval);
  }, []);

  const reviews = [
    {
      name: 'Jennifer Ross',
      location: 'New York, USA',
      child: 'Ethan (Age 8)',
      subject: 'Scratch Coding',
      rating: 5,
      comment: 'Ethan loved his trial with Sarah! In just 30 minutes, he built a working maze game from scratch. Scheduling was effortless in Eastern Time.',
    },
    {
      name: 'Rajesh & Priya Patel',
      location: 'London, UK',
      child: 'Ananya (Age 12)',
      subject: 'Python Programming',
      rating: 5,
      comment: 'The mentor Emily was exceptionally patient. She broke down loops and functions so easily. Ananya was glowing with confidence after class!',
    },
    {
      name: 'David Tan',
      location: 'Singapore',
      child: 'Lucas (Age 10)',
      subject: 'Web Development',
      rating: 5,
      comment: 'Super seamless booking system! The demo link worked instantly, and the mentor was waiting on time. Highly recommend Codeyoung.',
    },
  ];

  return (
    <section id="why-section" style={{ padding: '90px 0 80px', position: 'relative' }}>
      <div className="content-wrapper">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px' }}>
          <div className="announcement-pill" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="#D97706" />
            <span>THE 21ST CENTURY STEM ADVANTAGE</span>
          </div>
          <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
            Engineered for genuine creativity, <span className="text-gradient">not rote memorization</span>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: '1.6' }}>
            We pair Silicon Valley grade curriculum with patient, inspiring 1:1 mentorship so kids gain
            the confidence to build software, games, and AI systems.
          </p>
        </div>

        {/* 21st.dev Bento Grid */}
        <div className="bento-grid" style={{ marginBottom: '48px' }}>
          {/* Bento 1 (Span 8): 1:1 vs Crowded Classrooms */}
          <div className="bento-card bento-card-span-8">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span className="badge badge-golden">Pedagogy First</span>
                <span className="badge badge-teal">Individual Focus</span>
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
                True 1:1 Live Guidance vs 1:30 Mass Zoom Calls
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', maxWidth: '600px' }}>
                Every student learns at a different rhythm. Our mentors adapt instantaneously to your child's questions, debugging their code live without judgment.
              </p>
            </div>

            <div className="compare-container">
              <div className="compare-row highlight">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#D97706" />
                  <span>Codeyoung 1:1 Experience</span>
                </div>
                <span>100% Mentorship Time • Custom Code Debugging • Student-Led Projects</span>
              </div>
              <div className="compare-row muted">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>✕</span>
                  <span>Typical Group Online Classes</span>
                </div>
                <span>1:30 Student Ratio • Passive Screen Watching • Fixed One-Size Pace</span>
              </div>
            </div>
          </div>

          {/* Bento 2 (Span 4): Global Timezone Synchronizer */}
          <div className="bento-card bento-card-span-4" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="badge badge-teal">
                  <Globe size={13} />
                  <span>Real-Time IANA Engine</span>
                </span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                Zero Timezone Math
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', marginBottom: '16px' }}>
                Automatic Daylight Saving Time synchronization across 10 global regions.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 'auto' }}>
              <div style={{ background: 'white', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>🇺🇸 New York</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-mono)' }}>{worldTimes.ny || '10:45 AM'}</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: 700 }}>Live EDT</div>
              </div>
              <div style={{ background: 'white', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>🇬🇧 London</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-mono)' }}>{worldTimes.london || '03:45 PM'}</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: 700 }}>Live BST</div>
              </div>
              <div style={{ background: 'white', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>🇮🇳 Kolkata</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-mono)' }}>{worldTimes.kolkata || '08:15 PM'}</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: 700 }}>Live IST</div>
              </div>
              <div style={{ background: 'white', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>🇸🇬 Singapore</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-mono)' }}>{worldTimes.sg || '10:45 PM'}</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: 700 }}>Live SGT</div>
              </div>
            </div>
          </div>

          {/* Bento 3 (Span 4): STEM.org Accredited & Top 1% Screening */}
          <div className="bento-card bento-card-span-4" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FEF3C7 100%)', border: '1px solid #FDE68A' }}>
            <div>
              <span className="badge badge-golden" style={{ marginBottom: '12px' }}>
                <Trophy size={13} />
                <span>Accredited Standards</span>
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                Top 1% Screened Educators
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: '1.5' }}>
                Rigorous background checks, pedagogical certifications, and degrees from Stanford, Oxford, and top STEM institutes.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', padding: '14px', background: 'rgba(255,255,255,0.8)', borderRadius: 'var(--radius-md)' }}>
              <Shield size={28} color="#D97706" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '13px', color: '#92400E' }}>STEM.org Verified Credential</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Child safety verified & pedagogical audit approved</div>
              </div>
            </div>
          </div>

          {/* Bento 4 (Span 8): Verified Parent Feedback */}
          <div className="bento-card bento-card-span-8">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '8px' }}>Real Family Feedback</span>
                <h3 style={{ fontSize: '24px', fontWeight: 800 }}>Loved by Parents Across 10+ Nations</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" />
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {reviews.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: '#F8FAFC',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <p style={{ fontSize: '13px', color: 'var(--text-body)', fontStyle: 'italic', lineHeight: '1.5' }}>
                    "{r.comment}"
                  </p>
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-dark)' }}>{r.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {r.location} • {r.child}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
