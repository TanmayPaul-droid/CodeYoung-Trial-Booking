import React from 'react';
import { ShieldCheck, Award, Heart, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="content-wrapper">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="brand-logo-icon" style={{ width: '32px', height: '32px', fontSize: '18px' }}>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E5A62B', fontSize: '13px', fontWeight: 600 }}>
              <Award size={16} />
              <span>STEM.org Accredited Educational Institution</span>
            </div>
          </div>

          {/* Programs Col */}
          <div className="footer-col">
            <h4>STEM Courses</h4>
            <ul className="footer-links">
              <li><a href="#courses">Scratch Programming (Ages 5-9)</a></li>
              <li><a href="#courses">Python for Beginners (Ages 9-14)</a></li>
              <li><a href="#courses">Robotics & Electronics (Ages 8-15)</a></li>
              <li><a href="#courses">Web App Development (Ages 10-17)</a></li>
              <li><a href="#courses">Artificial Intelligence & ML (Ages 12-18)</a></li>
              <li><a href="#courses">Competitive Computational Math</a></li>
            </ul>
          </div>

          {/* Company Col */}
          <div className="footer-col">
            <h4>Codeyoung</h4>
            <ul className="footer-links">
              <li><a href="#mentors">Our Global Mentors</a></li>
              <li><a href="#why-codeyoung">Why Codeyoung</a></li>
              <li><a href="#why-codeyoung">Parent Reviews & Stories</a></li>
              <li><a href="#">Curriculum Pedagogy</a></li>
              <li><a href="#">Safety & Child Protection</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          {/* Global Operations Col */}
          <div className="footer-col">
            <h4>Global Presence</h4>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '14px' }}>
              Mentors operating across 10+ timezones with seamless scheduling:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['United States', 'United Kingdom', 'Canada', 'India', 'UAE & Dubai', 'Singapore', 'Australia', 'Germany'].map((c, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#CBD5E1',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Codeyoung. All rights reserved. Empowering future innovators worldwide.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
