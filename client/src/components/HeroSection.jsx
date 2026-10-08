import React from 'react';
import { Sparkles, Star, ShieldCheck, Globe, Clock, CheckCircle2, Video } from 'lucide-react';

export default function HeroSection({ onStartBooking }) {
  return (
    <section className="hero-section">
      <div className="content-wrapper">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge-pill">
              <Sparkles size={16} color="#D97706" />
              <span>LIVE 1:1 ONLINE STEM & CODING SESSIONS</span>
            </div>

            <h1 className="hero-title">
              Empower your child to <span className="highlight">create</span> with code, not just consume.
            </h1>

            <p className="hero-subtitle">
              Personalized 1:1 mentoring for ages 5–17. From intuitive block programming to Python,
              AI, and Robotics — scheduled seamlessly in your local timezone with certified global mentors.
            </p>

            <div className="hero-cta-group">
              <button onClick={onStartBooking} className="btn btn-primary btn-lg">
                <Sparkles size={18} />
                <span>Book a Free Trial Class</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', color: '#F59E0B' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#F59E0B" />
                  ))}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>
                  4.9/5 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(20,000+ happy parents)</span>
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
                <div className="stat-label">Countries Covered</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Top 1%</div>
                <div className="stat-label">Vetted Mentors</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">STEM.org</div>
                <div className="stat-label">Accredited Program</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              {/* Floating Badge 1 */}
              <div className="floating-badge badge-top-right">
                <ShieldCheck size={20} color="#10B981" />
                <span>100% Free Trial</span>
              </div>

              {/* Floating Badge 2 */}
              <div className="floating-badge badge-bottom-left">
                <Globe size={20} color="#E5A62B" />
                <span>All Global Timezones</span>
              </div>

              {/* Simulated Trial Preview Card */}
              <div style={{ background: '#FFFDF9', borderRadius: '16px', border: '1.5px solid #F6E2B3', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span className="badge badge-golden">Instant Smart Match</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Available Today
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                    alt="Mentor Emily"
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '17px', color: 'var(--text-dark)' }}>Emily Watson</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Oxford Alumnus • AI & Python Specialist</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#D97706', fontWeight: 600, marginTop: '2px' }}>
                      <Star size={12} fill="#D97706" /> 4.97 Rating (280+ sessions)
                    </div>
                  </div>
                </div>

                <div style={{ background: '#F8F9FA', borderRadius: '12px', padding: '14px', marginBottom: '18px', border: '1px solid #ECE7DE' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Trial Focus Area</div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-dark)' }}>🚀 Building an AI Chatbot from Scratch</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '12px', color: 'var(--text-body)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> 30-Minute 1:1 Live Slot
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Video size={12} /> HD Video Classroom
                    </span>
                  </div>
                </div>

                <button onClick={onStartBooking} className="btn btn-primary" style={{ width: '100%' }}>
                  Select Time & Match Mentor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
