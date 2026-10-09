import React from 'react';
import { Sparkles, Calendar, Users, Award, ShieldCheck } from 'lucide-react';

export default function Navbar({ onBookClick, onMentorsClick, onViewBookingsClick }) {
  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-inner">
          <a
            href="#"
            className="nav-brand"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="brand-logo-icon">
              <span>C</span>
            </div>
            <div className="brand-text">
              code<span className="brand-tag">young</span>
            </div>
          </a>

          <ul className="nav-links">
            <li>
              <a
                href="#courses"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Curriculum
              </a>
            </li>
            <li>
              <a
                href="#mentors"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onMentorsClick?.();
                }}
              >
                <div className="status-radar">
                  <span className="status-radar-ping"></span>
                  <span className="status-radar-dot"></span>
                </div>
                <span>Global Mentors</span>
              </a>
            </li>
            <li>
              <a
                href="#why-codeyoung"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('why-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Why Us
              </a>
            </li>
            <li>
              <button
                onClick={onViewBookingsClick}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="View active live trial bookings & admin controls"
              >
                <Calendar size={14} color="#F59E0B" />
                <span>Live Audit</span>
              </button>
            </li>
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={onBookClick} className="btn btn-primary btn-shimmer">
              <Sparkles size={16} />
              <span>Book Free Trial</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
