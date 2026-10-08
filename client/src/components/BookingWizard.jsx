import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  BookOpen,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sun,
  Sunset,
  Moon,
  ChevronRight,
  Code,
  Bot,
  Cpu,
  Globe2,
  Brain,
} from 'lucide-react';
import { POPULAR_TIMEZONES, ALL_IANA_TIMEZONES } from '../utils/timezonesList.js';

export default function BookingWizard({ initialSubject, onBookingSuccess }) {
  // Stepper state (1 to 4)
  const [step, setStep] = useState(1);

  // Form state
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(9);
  const [subject, setSubject] = useState(initialSubject || 'Scratch & Game Development');

  // Auto-detect timezone
  const defaultTz = (() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return detected || 'America/New_York';
    } catch {
      return 'America/New_York';
    }
  })();
  const [parentTimezone, setParentTimezone] = useState(defaultTz);

  // Date selection state: next 14 days
  const upcomingDays = (() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();
      days.push({ iso, dayName, monthName, dayNum });
    }
    return days;
  })();

  const [selectedDate, setSelectedDate] = useState(upcomingDays[0]?.iso || '');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Parent form state
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update subject if prop changes
  useEffect(() => {
    if (initialSubject) {
      setSubject(initialSubject);
    }
  }, [initialSubject]);

  // Fetch slots whenever selectedDate or parentTimezone changes
  useEffect(() => {
    if (!selectedDate || !parentTimezone) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    setErrorMessage('');

    fetch(`/api/slots?date=${selectedDate}&timezone=${encodeURIComponent(parentTimezone)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSlots(data.data);
        } else {
          setErrorMessage(data.message || 'Failed to fetch slots.');
          setSlots([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching slots:', err);
        setErrorMessage('Network error while fetching slots. Please try again.');
        setSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, parentTimezone]);

  // Group slots into Morning, Afternoon, Evening
  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 7 && hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 17;
  });

  // Handle Booking Submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!parentName.trim()) {
      setErrorMessage('Please enter parent name.');
      return;
    }
    if (!parentEmail.trim() || !parentEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!selectedSlot) {
      setErrorMessage('Please select a time slot.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName.trim(),
          parentEmail: parentEmail.trim(),
          parentPhone: parentPhone.trim(),
          childName: childName.trim(),
          childAge: Number(childAge),
          subject,
          date: selectedDate,
          time: selectedSlot.time,
          parentTimezone,
          notes: notes.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.message ||
            'Unable to complete booking. The slot might have just been reserved by another parent. Please choose another slot.'
        );
        // Refresh slots so they see latest availability
        fetch(`/api/slots?date=${selectedDate}&timezone=${encodeURIComponent(parentTimezone)}`)
          .then((r) => r.json())
          .then((d) => d.success && setSlots(d.data));
        setSubmitting(false);
        return;
      }

      // Booking succeeded!
      onBookingSuccess(result.data);
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMessage('Server connection error. Please try again.');
      setSubmitting(false);
    }
  };

  const subjectOptions = [
    { title: 'Scratch & Game Development', icon: Code, desc: 'Ages 5-9 • Interactive stories, drag-and-drop games', color: '#FFF1ED', iconColor: '#E0522D' },
    { title: 'Python Programming', icon: Cpu, desc: 'Ages 9-14 • Syntax, games, computational thinking', color: '#FFF8E7', iconColor: '#D97706' },
    { title: 'Robotics & Micro:bit', icon: Bot, desc: 'Ages 8-15 • Circuits, sensors, automated logic', color: '#E8F8EE', iconColor: '#10B981' },
    { title: 'Web Development', icon: Globe2, desc: 'Ages 10-17 • HTML, CSS, JavaScript, live web pages', color: '#F3E8FF', iconColor: '#7C3AED' },
    { title: 'AI & Machine Learning', icon: Brain, desc: 'Ages 12-18 • Computer vision, neural nets, chatbots', color: '#E0F2FE', iconColor: '#0284C7' },
  ];

  return (
    <div id="booking-wizard-section" className="wizard-container">
      {/* Stepper Header */}
      <div className="stepper-header">
        <div className="stepper-line">
          <div
            className="stepper-line-progress"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>

        <div className={`stepper-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`} onClick={() => step > 1 && setStep(1)}>
          <div className="step-circle">{step > 1 ? '✓' : '1'}</div>
          <span className="step-title">Child & Course</span>
        </div>

        <div className={`stepper-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`} onClick={() => step > 2 && setStep(2)}>
          <div className="step-circle">{step > 2 ? '✓' : '2'}</div>
          <span className="step-title">Date & Timezone</span>
        </div>

        <div className={`stepper-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`} onClick={() => step > 3 && setStep(3)}>
          <div className="step-circle">{step > 3 ? '✓' : '3'}</div>
          <span className="step-title">Select Slot</span>
        </div>

        <div className={`stepper-step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-circle">4</div>
          <span className="step-title">Parent Details</span>
        </div>
      </div>

      {/* STEP 1: Child & Course */}
      {step === 1 && (
        <div className="step-card">
          <div className="step-card-header">
            <span className="badge badge-golden" style={{ marginBottom: '8px' }}>Step 1 of 4</span>
            <h2 className="step-card-title">Who is this trial class for?</h2>
            <p className="step-card-desc">
              We personalize the learning session to your child's age, grade, and coding background.
            </p>
          </div>

          <div className="form-row" style={{ marginBottom: '24px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Child's First Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Leo, Mia, Ethan"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Child's Age: <strong>{childAge} years old</strong></label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '10px' }}>
                <input
                  type="range"
                  min="5"
                  max="17"
                  value={childAge}
                  onChange={(e) => setChildAge(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--primary-light)',
                    fontWeight: 800,
                    fontSize: '15px',
                    color: '#B45309',
                    minWidth: '50px',
                    textAlign: 'center',
                  }}
                >
                  {childAge}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '12px' }}>
              Select Trial Subject *
            </label>
            <div className="subject-grid">
              {subjectOptions.map((opt, i) => {
                const Icon = opt.icon;
                const isSelected = subject === opt.title;
                return (
                  <div
                    key={i}
                    className={`subject-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSubject(opt.title)}
                  >
                    <div className="subject-icon-wrap" style={{ background: opt.color, color: opt.iconColor }}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="subject-title">{opt.title}</h4>
                      <p className="subject-ages" style={{ marginTop: '4px' }}>{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div style={{ color: '#DC2626', fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                if (!childName.trim()) {
                  setErrorMessage("Please enter your child's name to proceed.");
                  return;
                }
                setErrorMessage('');
                setStep(2);
              }}
              className="btn btn-primary btn-lg"
            >
              <span>Continue to Schedule</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Date & Timezone */}
      {step === 2 && (
        <div className="step-card">
          <div className="step-card-header">
            <span className="badge badge-golden" style={{ marginBottom: '8px' }}>Step 2 of 4</span>
            <h2 className="step-card-title">Choose date & your local timezone</h2>
            <p className="step-card-desc">
              All slots are calculated live to ensure seamless mentor availability with zero timezone math for you.
            </p>
          </div>

          {/* Timezone Selector */}
          <div
            style={{
              background: '#FFFDF7',
              border: '1.5px solid #F6E2B3',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '15px' }}>Your Local Timezone</span>
              </div>
              <span className="badge badge-teal">Auto-Detected</span>
            </div>

            <select
              className="form-select"
              value={parentTimezone}
              onChange={(e) => setParentTimezone(e.target.value)}
              style={{ fontWeight: 600 }}
            >
              <optgroup label="Popular Timezones">
                {POPULAR_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} ({tz.value})
                  </option>
                ))}
              </optgroup>
              <optgroup label="All Global Regions">
                {ALL_IANA_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} ({tz.value})
                  </option>
                ))}
              </optgroup>
            </select>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Selected IANA identifier: <code>{parentTimezone}</code>. Daylight saving adjustments are calculated automatically.
            </p>
          </div>

          {/* Date Chips */}
          <div style={{ marginBottom: '32px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '12px' }}>
              Select Date (Next 14 Days)
            </label>
            <div className="date-chips-row">
              {upcomingDays.map((day) => {
                const isSelected = selectedDate === day.iso;
                return (
                  <div
                    key={day.iso}
                    className={`date-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(day.iso)}
                  >
                    <span className="date-chip-day">{day.dayName}</span>
                    <span className="date-chip-num">{day.dayNum}</span>
                    <span className="date-chip-month">{day.monthName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button onClick={() => setStep(3)} className="btn btn-primary btn-lg">
              <span>View Open Slots for {selectedDate}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Pick 30-Min Slot */}
      {step === 3 && (
        <div className="step-card">
          <div className="step-card-header">
            <span className="badge badge-golden" style={{ marginBottom: '8px' }}>Step 3 of 4</span>
            <h2 className="step-card-title">Select a 30-Minute Slot</h2>
            <p className="step-card-desc">
              Times shown in your local timezone: <strong>{parentTimezone}</strong> on <strong>{selectedDate}</strong>.
            </p>
          </div>

          {loadingSlots ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Checking global mentor roster...</div>
              <p style={{ fontSize: '14px' }}>Verifying operating hours and daily quotas across 10 timezones.</p>
            </div>
          ) : slots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#FEF2F2', borderRadius: '16px', color: '#DC2626' }}>
              No available slots found for this date. Please try another day.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '32px' }}>
              {/* Morning */}
              {morningSlots.length > 0 && (
                <div className="slots-group">
                  <div className="slots-group-title">
                    <Sun size={16} color="#D97706" />
                    <span>Morning Sessions (07:00 – 11:30)</span>
                  </div>
                  <div className="slots-grid">
                    {morningSlots.map((slot) => {
                      const isSelected = selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.isAvailable}
                          className={`slot-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <span className="slot-time">{slot.time}</span>
                          <span className="slot-status">
                            {slot.isAvailable ? `${slot.availableMentorsCount} mentor${slot.availableMentorsCount > 1 ? 's' : ''}` : 'Full'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Afternoon */}
              {afternoonSlots.length > 0 && (
                <div className="slots-group">
                  <div className="slots-group-title">
                    <Sunset size={16} color="#E0522D" />
                    <span>Afternoon Sessions (12:00 – 16:30)</span>
                  </div>
                  <div className="slots-grid">
                    {afternoonSlots.map((slot) => {
                      const isSelected = selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.isAvailable}
                          className={`slot-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <span className="slot-time">{slot.time}</span>
                          <span className="slot-status">
                            {slot.isAvailable ? `${slot.availableMentorsCount} mentor${slot.availableMentorsCount > 1 ? 's' : ''}` : 'Full'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Evening */}
              {eveningSlots.length > 0 && (
                <div className="slots-group">
                  <div className="slots-group-title">
                    <Moon size={16} color="#7C3AED" />
                    <span>Evening Sessions (17:00 – 21:30)</span>
                  </div>
                  <div className="slots-grid">
                    {eveningSlots.map((slot) => {
                      const isSelected = selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.isAvailable}
                          className={`slot-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <span className="slot-time">{slot.time}</span>
                          <span className="slot-status">
                            {slot.isAvailable ? `${slot.availableMentorsCount} mentor${slot.availableMentorsCount > 1 ? 's' : ''}` : 'Full'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedSlot && (
            <div
              style={{
                background: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#059669" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#065F46' }}>
                    Selected: {selectedDate} at {selectedSlot.time} - {selectedSlot.endTime}
                  </div>
                  <div style={{ fontSize: '13px', color: '#047857' }}>
                    {selectedSlot.availableMentorsCount} eligible mentor{selectedSlot.availableMentorsCount > 1 ? 's' : ''} ready to match
                  </div>
                </div>
              </div>
              <span className="badge badge-green">Slot Locked</span>
            </div>
          )}

          {errorMessage && (
            <div style={{ color: '#DC2626', fontSize: '14px', marginBottom: '16px' }}>
              {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!selectedSlot) {
                  setErrorMessage('Please click on a time slot above to select it.');
                  return;
                }
                setErrorMessage('');
                setStep(4);
              }}
              disabled={!selectedSlot}
              className="btn btn-primary btn-lg"
            >
              <span>Continue to Parent Info</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Parent Details & Confirm */}
      {step === 4 && (
        <form onSubmit={handleSubmitBooking} className="step-card">
          <div className="step-card-header">
            <span className="badge badge-golden" style={{ marginBottom: '8px' }}>Final Step</span>
            <h2 className="step-card-title">Where should we send the class link?</h2>
            <p className="step-card-desc">
              The dummy video classroom link and calendar invite will be issued immediately upon confirmation.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div
            style={{
              background: '#FFFDF7',
              border: '1.5px solid #F6E2B3',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              marginBottom: '28px',
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px', color: 'var(--text-dark)' }}>
              Trial Session Summary
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Student</div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{childName} ({childAge} yrs)</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Subject</div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{subject}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Date & Time</div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>
                  {selectedDate} at {selectedSlot?.time}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Your Timezone</div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{parentTimezone}</div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Parent / Guardian Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Parent Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. parent@example.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mobile Number (with country code)</label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. +1 555-0199 or +91 9876543210"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Learning Goals or Prior Experience (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Beginner, loves gaming, interested in robots"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {errorMessage && (
            <div
              style={{
                padding: '14px 18px',
                background: '#FEF2F2',
                borderRadius: 'var(--radius-md)',
                color: '#DC2626',
                fontSize: '14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <button type="button" onClick={() => setStep(3)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '220px' }}
            >
              {submitting ? (
                <span>Matching Mentor...</span>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Confirm Free Trial Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
