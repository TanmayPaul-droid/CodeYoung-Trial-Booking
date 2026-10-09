import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import BookingWizard from './components/BookingWizard.jsx';
import CoursesSection from './components/CoursesSection.jsx';
import MentorsShowcase from './components/MentorsShowcase.jsx';
import WhyCodeyoung from './components/WhyCodeyoung.jsx';
import ConfirmationView from './components/ConfirmationView.jsx';
import BookingsListModal from './components/BookingsListModal.jsx';
import AccordionBasic from './components/AccordionBasic.jsx';
import WorksWheelDemo from './components/ui/works-wheel-demo.tsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'confirmation'
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  // Scroll to booking wizard
  const scrollToBooking = (subjectName = '') => {
    if (view !== 'landing') {
      setView('landing');
    }
    if (subjectName) {
      setSelectedSubject(subjectName);
    }
    setTimeout(() => {
      const el = document.getElementById('booking-wizard-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleBookingSuccess = (bookingData) => {
    setConfirmedBooking(bookingData);
    setView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookAnother = () => {
    setConfirmedBooking(null);
    setView('landing');
    setTimeout(() => {
      const el = document.getElementById('booking-wizard-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleGoHome = () => {
    setConfirmedBooking(null);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Navbar
        onBookClick={() => scrollToBooking()}
        onMentorsClick={() => {
          if (view !== 'landing') setView('landing');
          setTimeout(() => {
            document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onViewBookingsClick={() => setIsBookingsModalOpen(true)}
      />

      {view === 'confirmation' ? (
        <main className="content-wrapper">
          <ConfirmationView
            booking={confirmedBooking}
            onBookAnother={handleBookAnother}
            onGoHome={handleGoHome}
          />
        </main>
      ) : (
        <main>
          <HeroSection onStartBooking={() => scrollToBooking()} />

          <div style={{ padding: '20px 0 60px' }}>
            <div className="content-wrapper">
              <BookingWizard
                initialSubject={selectedSubject}
                onBookingSuccess={handleBookingSuccess}
              />
            </div>
          </div>

          <CoursesSection onSelectCourse={(title) => scrollToBooking(title)} />

          <MentorsShowcase
            onSelectMentor={(mentor) => {
              const firstSubject = mentor.subjects?.[0] || 'Python Programming';
              scrollToBooking(firstSubject);
            }}
          />

          <WhyCodeyoung />

          <section id="showcase-section" style={{ padding: '70px 0 80px' }}>
            <div className="content-wrapper">
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
                <span className="badge badge-golden" style={{ marginBottom: '12px' }}>Student Creations</span>
                <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '12px' }}>
                  What our students build with <span className="text-gradient">1:1 Mentorship</span>
                </h2>
                <p style={{ fontSize: '16px', color: 'var(--text-body)' }}>
                  Turn the 3D interactive wheel or scroll to browse real capstone projects created by young coders aged 5–17.
                </p>
              </div>

              <WorksWheelDemo />
            </div>
          </section>

          <section id="faq-section" style={{ padding: '70px 0 80px' }}>
            <div className="content-wrapper">
              <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
                <span className="badge badge-golden" style={{ marginBottom: '12px' }}>FAQ</span>
                <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '12px' }}>
                  Frequently Asked Questions
                </h2>
                <p style={{ fontSize: '16px', color: 'var(--text-body)' }}>
                  Everything you need to know about our trial classes, subscription plans, and secure payment methods.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className="card"
                  style={{
                    width: '100%',
                    maxWidth: '680px',
                    padding: '28px 32px',
                    background: 'white',
                    borderRadius: 'var(--radius-xl)',
                  }}
                >
                  <AccordionBasic />
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      <Footer />

      <BookingsListModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
      />
    </div>
  );
}
