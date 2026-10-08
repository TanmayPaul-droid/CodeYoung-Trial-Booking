import React from 'react';
import { Sparkles, Calendar, Users, Award } from 'lucide-react';

export default function Navbar({ onBookClick, onMentorsClick, onViewBookingsClick, activeTab }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="brand-logo-icon">
            <span>C</span>
          </div>
          <div className="brand-text">
            code<span className="brand-tag">young</span>
          </div>
        </a>

        <ul className="nav-links">
          <li>
            <a href="#courses" className="nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Courses
            </a>
          </li>
          <li>
            <a href="#mentors" className="nav-link" onClick={(e) => { e.preventDefault(); onMentorsClick?.(); }}>
              Our Global Mentors
            </a>
          </li>
          <li>
            <a href="#why-codeyoung" className="nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('why-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Why Codeyoung
            </a>
          </li>
          <li>
            <button
              onClick={onViewBookingsClick}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Calendar size={14} />
              <span>Live Bookings</span>
            </button>
          </li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBookClick} className="btn btn-primary">
            <Sparkles size={16} />
            <span>Book a Free Trial</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
