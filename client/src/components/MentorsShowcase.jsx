import React, { useEffect, useState } from 'react';
import { Star, Clock, Globe, Award, Sparkles, BookOpen } from 'lucide-react';

export default function MentorsShowcase({ onSelectMentor }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mentors')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMentors(data.data);
        }
      })
      .catch((err) => console.error('Error fetching mentors:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="mentors" style={{ padding: '80px 0 60px', background: 'var(--bg-white)', borderTop: '1px solid var(--border-light)' }}>
      <div className="content-wrapper">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <div className="badge badge-golden" style={{ marginBottom: '12px' }}>
            <Award size={14} />
            <span>GLOBAL EDUCATOR NETWORK</span>
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '16px' }}>
            Learn from the top 1% certified STEM mentors
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-body)' }}>
            Our 10 global mentors span across America, Europe, Asia, and Australia, providing round-the-clock
            live 1:1 guidance personalized to your child's age, interests, and timezone.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading mentor roster...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {mentors.map((mentor) => (
              <div
                key={mentor._id}
                className="card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2.5px solid var(--primary)',
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: 700 }}>{mentor.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#D97706', fontWeight: 700, marginTop: '2px' }}>
                      <Star size={13} fill="#D97706" /> {mentor.rating} ({mentor.reviewCount} reviews)
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5', minHeight: '40px' }}>
                  {mentor.bio}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {mentor.subjects?.map((sub, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        background: '#F8F9FA',
                        color: 'var(--text-dark)',
                        border: '1px solid #E5E7EB',
                      }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-light)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={13} color="var(--primary)" />
                    <span>Timezone: <strong>{mentor.timezone}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color="var(--primary)" />
                    <span>Operating Hours: <strong>{mentor.operatingHours.start} - {mentor.operatingHours.end}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectMentor?.(mentor)}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 'auto', width: '100%' }}
                >
                  <Sparkles size={13} />
                  <span>Book Trial with {mentor.name.split(' ')[0]}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
