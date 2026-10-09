import React from 'react';
import { Sparkles, Star, ShieldCheck, Globe, Clock, CheckCircle2, Video, ArrowRight, Laptop } from 'lucide-react';

export default function HeroSection({ onStartBooking }) {
  return (
    <section className="hero-section">
      <div className="content-wrapper">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="announcement-pill">
              <Sparkles size={15} color="#D97706" />
              <span>LIVE 1:1 STEM MENTORING • WORLDWIDE TIMEZONES</span>
            </div>

            <h1 className="hero-title">
              Empower your child to <span className="text-gradient">create with code</span>, not just consume.
            </h1>

            <p className="hero-subtitle">
              Personalized 1:1 mentorship for ages 5–17. From intuitive block programming to Python,
              AI, and Robotics — scheduled seamlessly in your local timezone with certified global mentors.
            </p>

            <div className="hero-cta-group">
              <button onClick={onStartBooking} className="btn btn-primary btn-lg btn-shimmer">
                <Sparkles size={18} />
                <span>Book a Free Trial Class</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-secondary btn-lg"
              >
                <span>Explore Mentors</span>
              </button>
            </div>

            <div className="hero-trust-row">
              <div className="avatar-stack">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Parent"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Parent"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Parent"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                  alt="Parent"
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#F59E0B" />
                  ))}
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-dark)', marginLeft: '4px' }}>
                    4.98/5
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Trusted by 20,000+ parents across 10+ countries
                </div>
              </div>
            </div>

            <div className="hero-stats-row">
              <div className="stat-item">
                <div className="stat-number">200k+</div>
                <div className="stat-label">Classes Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10+</div>
                <div className="stat-label">Timezones Synchronized</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Top 1%</div>
                <div className="stat-label">Certified STEM Mentors</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">STEM.org</div>
                <div className="stat-label">Accredited Pedagogy</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              {/* Floating Badge 1 */}
              <div className="floating-badge badge-top-right">
                <ShieldCheck size={18} color="#10B981" />
                <span>100% Free Trial • No Card</span>
              </div>

              {/* Floating Badge 2 */}
              <div className="floating-badge badge-bottom-left">
                <Globe size={18} color="#F59E0B" />
                <span>Zero Timezone Math</span>
              </div>

              {/* Simulated Live Trial Match Preview Card */}
              <div
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF9 100%)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid #FDE68A',
                  padding: '24px',
                  boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px',
                  }}
                >
                  <span className="badge badge-golden">Instant Smart Match</span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#D1FAE5',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    <span className="status-radar">
                      <span className="status-radar-ping"></span>
                      <span className="status-radar-dot"></span>
                    </span>
                    Available Today
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                    alt="Mentor Emily"
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2.5px solid var(--primary)',
                      boxShadow: '0 4px 12px var(--primary-glow)',
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-dark)' }}>Emily Watson</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Oxford Alumna • AI & Python Specialist</div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: '#D97706',
                        fontWeight: 700,
                        marginTop: '2px',
                      }}
                    >
                      <Star size={13} fill="#F59E0B" /> 4.97 Rating (280+ sessions)
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: '#F8FAFC',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginBottom: '20px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Trial Project Highlight
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-dark)' }}>
                    🚀 Building an AI Chatbot from Scratch
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginTop: '10px',
                      fontSize: '12px',
                      color: 'var(--text-body)',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={13} color="#F59E0B" /> 30-Min 1:1 Live Slot
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Video size={13} color="#0D9488" /> HD Video Classroom
                    </span>
                  </div>
                </div>

                <button
                  onClick={onStartBooking}
                  className="btn btn-primary btn-shimmer"
                  style={{ width: '100%', padding: '14px' }}
                >
                  <span>Select Time & Match Mentor</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
