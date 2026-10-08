import React from 'react';
import { Target, Users2, Trophy, Clock, Star, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function WhyCodeyoung() {
  const features = [
    {
      icon: Users2,
      iconBg: '#FFF1ED',
      iconColor: '#E0522D',
      title: 'True 1:1 Live Mentorship',
      desc: 'No crowded group calls or passive recorded videos. Every class is completely personalized to your child\'s pace, questions, and curiosity.',
    },
    {
      icon: Trophy,
      iconBg: '#FFF8E7',
      iconColor: '#D97706',
      title: 'Project-First Learning',
      desc: 'Students don\'t memorize theory. They build working video games, mobile apps, and robotics circuits that they can proudly show to friends and family.',
    },
    {
      icon: Clock,
      iconBg: '#E8F8EE',
      iconColor: '#10B981',
      title: 'Global Timezone Flexibility',
      desc: 'Book slots in your exact local timezone with automatic Daylight Saving Time alignment. Morning, evening, or weekend options always open.',
    },
    {
      icon: HeartHandshake,
      iconBg: '#F3E8FF',
      iconColor: '#7C3AED',
      title: 'Top 1% Screened Educators',
      desc: 'All mentors undergo rigorous pedagogical training, background checks, and child engagement certifications from top STEM institutions.',
    },
  ];

  const reviews = [
    {
      name: 'Jennifer Ross',
      location: 'New York, USA',
      child: 'Ethan (Age 8)',
      subject: 'Scratch Coding',
      rating: 5,
      comment: 'Ethan loved his trial with Sarah! In just 30 minutes, he built a working maze game from scratch. Scheduling was effortless in Eastern Time.',
    },
    {
      name: 'Rajesh & Priya Patel',
      location: 'London, UK',
      child: 'Ananya (Age 12)',
      subject: 'Python Programming',
      rating: 5,
      comment: 'The mentor Emily was exceptionally patient. She broke down loops and functions so easily. Ananya was glowing with confidence after class!',
    },
    {
      name: 'David Tan',
      location: 'Singapore',
      child: 'Lucas (Age 10)',
      subject: 'Web Development',
      rating: 5,
      comment: 'Super seamless booking system! The demo link worked instantly, and the mentor was waiting on time. Highly recommend Codeyoung.',
    },
  ];

  return (
    <section id="why-section" style={{ padding: '80px 0', background: 'var(--bg-white)', borderTop: '1px solid var(--border-light)' }}>
      <div className="content-wrapper">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 54px' }}>
          <div className="badge badge-golden" style={{ marginBottom: '12px' }}>
            <span>THE CODEYOUNG ADVANTAGE</span>
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '16px' }}>
            Why 20,000+ parents choose Codeyoung
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-body)' }}>
            We combine high-caliber STEM curriculum with warm, encouraging mentorship so children develop
            lifelong digital creators' confidence.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '72px' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="card"
                style={{
                  padding: '30px 24px',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: f.iconBg,
                    color: f.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={26} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div style={{ background: 'var(--bg-cream)', borderRadius: 'var(--radius-xl)', padding: '48px 36px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Loved by parents worldwide</h3>
            <p style={{ color: 'var(--text-body)' }}>Read real experiences from families who took the free trial</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {reviews.map((r, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', color: '#F59E0B' }}>
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} size={15} fill="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', fontStyle: 'italic', lineHeight: '1.6' }}>
                  "{r.comment}"
                </p>
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-dark)' }}>{r.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {r.location} • {r.child} • {r.subject}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
