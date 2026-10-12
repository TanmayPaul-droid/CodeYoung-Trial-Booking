
import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Star,
  ShieldCheck,
  Globe,
  Clock,
  Video,
  ArrowRight,
} from 'lucide-react';

// If the backend is deployed separately, set VITE_API_URL
// to your backend base URL. Otherwise, the app uses same-origin /api.
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const FALLBACK_AVATAR =
  'https://ui-avatars.com/api/?name=STEM+Mentor&background=FEF3C7&color=92400E';

function getMentorsFromResponse(result) {
  // Support common API response formats.
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.mentors)) return result.mentors;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.mentors)) return result.data.mentors;
  if (Array.isArray(result?.results)) return result.results;
  return [];
}

function getMentorSubjects(mentor) {
  const subjects =
    mentor.subjects ||
    mentor.specializations ||
    mentor.expertise;

  if (Array.isArray(subjects)) {
    return subjects.join(' • ');
  }

  if (typeof subjects === 'string' && subjects.trim()) {
    return subjects;
  }

  return mentor.bio || mentor.description || 'STEM Education Specialist';
}

function getMentorImage(mentor) {
  return (
    mentor.image ||
    mentor.avatar ||
    mentor.photo ||
    mentor.profileImage ||
    mentor.imageUrl ||
    FALLBACK_AVATAR
  );
}

export default function HeroSection({ onStartBooking }) {
  const [mentor, setMentor] = useState(null);
  const [loadingMentor, setLoadingMentor] = useState(true);
  const [mentorError, setMentorError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMentors() {
      try {
        setLoadingMentor(true);
        setMentorError(false);

        const response = await fetch(
          `${API_BASE_URL}/api/mentors`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Mentor API returned ${response.status}`);
        }

        const result = await response.json();
        const mentors = getMentorsFromResponse(result);

        // Only display a mentor that is active in the actual mentor list.
        const activeMentors = mentors.filter((item) => {
          if (item.isActive === false || item.active === false) {
            return false;
          }

          if (
            typeof item.status === 'string' &&
            item.status.toLowerCase() !== 'active'
          ) {
            return false;
          }

          return Boolean(item.name || item.fullName);
        });

        if (activeMentors.length === 0) {
          setMentor(null);
          setMentorError(true);
          return;
        }

        // Use a real mentor returned by the backend.
        setMentor(activeMentors[0]);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load homepage mentor:', error);
          setMentor(null);
          setMentorError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingMentor(false);
        }
      }
    }

    fetchMentors();

    return () => controller.abort();
  }, []);

  const mentorName = mentor?.name || mentor?.fullName || 'STEM Mentor';
  const mentorSubjects = mentor ? getMentorSubjects(mentor) : '';
  const mentorImage = mentor ? getMentorImage(mentor) : FALLBACK_AVATAR;

  const mentorRating =
    typeof mentor?.rating === 'number' ||
    typeof mentor?.rating === 'string'
      ? Number(mentor.rating)
      : null;

  const mentorSessions =
    mentor?.sessions ??
    mentor?.totalSessions ??
    mentor?.sessionCount ??
    null;

  return (
    <section className="hero-section">
      <div className="content-wrapper">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="announcement-pill">
              <Sparkles size={15} color="#D97706" />
              <span>
                LIVE 1:1 STEM MENTORING • WORLDWIDE TIMEZONES
              </span>
            </div>

            <h1 className="hero-title">
              Empower your child to{' '}
              <span className="text-gradient">
                create with code
              </span>
              , not just consume.
            </h1>

            <p className="hero-subtitle">
              Personalized 1:1 mentorship for ages 5–17. From
              intuitive block programming to Python, AI, and
              Robotics — scheduled seamlessly in your local
              timezone with global STEM mentors.
            </p>

            <div className="hero-cta-group">
              <button
                onClick={onStartBooking}
                className="btn btn-primary btn-lg btn-shimmer"
              >
                <Sparkles size={18} />
                <span>Book a Free Trial Class</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById('mentors')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#F59E0B',
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill="#F59E0B"
                    />
                  ))}

                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '14px',
                      color: 'var(--text-dark)',
                      marginLeft: '4px',
                    }}
                  >
                    4.98/5
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                  }}
                >
                  Global STEM learning experience
                </div>
              </div>
            </div>

            <div className="hero-stats-row">
              <div className="stat-item">
                <div className="stat-number">10+</div>
                <div className="stat-label">Global Mentors</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">1:1</div>
                <div className="stat-label">Personalized Classes</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">30 Min</div>
                <div className="stat-label">Trial Sessions</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">Global</div>
                <div className="stat-label">Timezone Support</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="floating-badge badge-top-right">
                <ShieldCheck size={18} color="#10B981" />
                <span>100% Free Trial • No Card</span>
              </div>

              <div className="floating-badge badge-bottom-left">
                <Globe size={18} color="#F59E0B" />
                <span>Zero Timezone Math</span>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(180deg, #FFFFFF 0%, #FFFDF9 100%)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid #FDE68A',
                  padding: '24px',
                  boxShadow:
                    '0 10px 25px -5px rgba(245, 158, 11, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '18px',
                  }}
                >
                  <span className="badge badge-golden">
                    Smart Mentor Match
                  </span>

                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#059669',
                      background: '#D1FAE5',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    {loadingMentor
                      ? 'Loading Mentor...'
                      : mentor
                        ? 'Active Mentor'
                        : 'Mentor Unavailable'}
                  </span>
                </div>

                {loadingMentor ? (
                  <div
                    style={{
                      padding: '28px 8px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Loading your mentor...
                  </div>
                ) : mentor ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        marginBottom: '18px',
                      }}
                    >
                      <img
                        src={mentorImage}
                        alt={mentorName}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_AVATAR;
                        }}
                        style={{
                          width: '58px',
                          height: '58px',
                          flexShrink: 0,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2.5px solid var(--primary)',
                          boxShadow:
                            '0 4px 12px var(--primary-glow)',
                        }}
                      />

                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: '18px',
                            color: 'var(--text-dark)',
                          }}
                        >
                          {mentorName}
                        </div>

                        <div
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {mentorSubjects}
                        </div>

                        {mentorRating !== null &&
                          Number.isFinite(mentorRating) && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                color: '#D97706',
                                fontWeight: 700,
                                marginTop: '4px',
                              }}
                            >
                              <Star
                                size={13}
                                fill="#F59E0B"
                              />
                              {mentorRating.toFixed(2)} Rating
                              {mentorSessions != null &&
                                ` (${mentorSessions} sessions)`}
                            </div>
                          )}
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
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          fontWeight: 800,
                          letterSpacing: '0.5px',
                          marginBottom: '4px',
                        }}
                      >
                        Mentor Specialization
                      </div>

                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '15px',
                          color: 'var(--text-dark)',
                        }}
                      >
                        {mentorSubjects}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          flexWrap: 'wrap',
                          marginTop: '12px',
                          fontSize: '12px',
                          color: 'var(--text-body)',
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <Clock size={13} color="#F59E0B" />
                          30-Min Trial Slot
                        </span>

                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <Video size={13} color="#0D9488" />
                          Live Video Class
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      padding: '24px 8px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {mentorError
                      ? 'Unable to load an active mentor. Please try booking again shortly.'
                      : 'No active mentors are currently available.'}
                  </div>
                )}

                <button
                  onClick={onStartBooking}
                  className="btn btn-primary btn-shimmer"
                  style={{
                    width: '100%',
                    padding: '14px',
                  }}
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
