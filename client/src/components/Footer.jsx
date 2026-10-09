import React from 'react';
import { Award, ShieldCheck, Heart, Sparkles, Globe } from 'lucide-react';

export default function Footer() {
  const globalRegions = [
    '🇺🇸 United States (EDT/PDT)',
    '🇬🇧 United Kingdom (BST)',
    '🇮🇳 India (IST)',
    '🇦🇺 Australia (AEST)',
    '🇸🇬 Singapore (SGT)',
    '🇯🇵 Japan (JST)',
    '🇦🇪 UAE (GST)',
    '🇩🇪 Germany (CEST)',
  ];

  return (
    <footer className="footer">
      <div className="content-wrapper">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="brand-logo-icon" style={{ width: '34px', height: '34px', fontSize: '18px' }}>
                C
              </div>
              <div className="brand-text" style={{ color: 'white' }}>
                code<span className="brand-tag">young</span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '20px' }}>
              Transforming young consumers of technology into confident digital creators. Live 1:1 online
              coding, robotics, and AI classes tailored to your child's pace and imagination.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '13px', fontWeight: 700 }}>
              <Award size={16} />
              <span>STEM.org Accredited Educational Institution</span>
            </div>
          </div>

          {/* Programs Col */}
          <div className="footer-col">
            <h4>STEM Learning Tracks</h4>
            <ul className="footer-links">
              <li><a href="#courses">Scratch Coding (Ages 5-9)</a></li>
              <li><a href="#courses">Python Foundations (Ages 9-14)</a></li>
              <li><a href="#courses">Robotics & Hardware (Ages 8-15)</a></li>
              <li><a href="#courses">Web Application Dev (Ages 10-17)</a></li>
              <li><a href="#courses">AI & Neural Networks (Ages 12-18)</a></li>
            </ul>
          </div>

          {/* Platform & Mentors Col */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><a href="#mentors">Our 10 Global Mentors</a></li>
              <li><a href="#why-codeyoung">Why 1:1 Mentoring</a></li>
              <li><a href="#why-codeyoung">Parent Reviews & Stories</a></li>
              <li><a href="#">Child Safety & Protection</a></li>
              <li><a href="#">Pedagogical Framework</a></li>
            </ul>
          </div>

          {/* Global Operations Col */}
          <div className="footer-col">
            <h4>Global Synchronized Network</h4>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '14px' }}>
              Live 1:1 sessions operating continuously across 10+ timezones:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {globalRegions.map((region, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(255, 255, 255, 0.07)',
                    color: '#E2E8F0',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontWeight: 500,
                  }}
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Codeyoung. All rights reserved. Built with modern 21st.dev UI standards.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Safety Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
