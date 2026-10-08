import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import BookingWizard from './components/BookingWizard.jsx';
import CoursesSection from './components/CoursesSection.jsx';
import MentorsShowcase from './components/MentorsShowcase.jsx';
import WhyCodeyoung from './components/WhyCodeyoung.jsx';
import ConfirmationView from './components/ConfirmationView.jsx';
import BookingsListModal from './components/BookingsListModal.jsx';
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
