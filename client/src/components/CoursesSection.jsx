import React from 'react';
import { Code, Bot, Cpu, Globe2, Brain, ArrowRight } from 'lucide-react';

export const COURSES = [
  {
    id: 'scratch',
    title: 'Scratch & Game Development',
    ages: 'Ages 5 – 9',
    badge: 'Popular for Beginners',
    badgeColor: 'badge-coral',
    icon: Code,
    iconBg: '#FFF1ED',
    iconColor: '#E0522D',
    description: 'Block-based coding to build interactive video games, animated stories, and logic foundations.',
    outcomes: ['20+ Mini Games Created', 'Drag-and-Drop Logic', 'Creative Storytelling'],
  },
  {
    id: 'python',
    title: 'Python & Algorithmic Logic',
    ages: 'Ages 9 – 14',
    badge: 'Top Rated',
    badgeColor: 'badge-golden',
    icon: Cpu,
    iconBg: '#FFF8E7',
    iconColor: '#D97706',
    description: 'Real-world syntax, data structures, conditional problem-solving, and computational thinking.',
    outcomes: ['Real Syntax Fluency', 'Calculator & Game Apps', 'Problem Solving Skills'],
  },
  {
    id: 'robotics',
    title: 'Robotics & Hardware Systems',
    ages: 'Ages 8 – 15',
    badge: 'Hands-on STEM',
    badgeColor: 'badge-teal',
    icon: Bot,
    iconBg: '#E8F8EE',
    iconColor: '#10B981',
    description: 'Micro:bit, Arduino simulation, sensors, motor circuits, and automated robotics logic.',
    outcomes: ['Sensor Interfacing', 'Automation Circuits', 'Tinkercad 3D Design'],
  },
  {
    id: 'web',
    title: 'Web Apps & Full Stack Coding',
    ages: 'Ages 10 – 17',
    badge: 'Real-World Skills',
    badgeColor: 'badge-purple',
    icon: Globe2,
    iconBg: '#F3E8FF',
    iconColor: '#7C3AED',
    description: 'Build real deployed web apps using HTML5, CSS3, modern JavaScript, and interactive APIs.',
    outcomes: ['Live Deployed Website', 'Responsive UI Design', 'Frontend JavaScript'],
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning for Kids',
    ages: 'Ages 12 – 18',
    badge: 'Next-Gen Tech',
    badgeColor: 'badge-blue',
    icon: Brain,
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    description: 'Understand neural networks, train computer vision models, and build intelligent AI bots.',
    outcomes: ['Image Recognition Models', 'Generative AI Concepts', 'Data Analytics'],
  },
];

export default function CoursesSection({ onSelectCourse }) {
  return (
    <section id="courses-section" style={{ padding: '80px 0', background: 'var(--bg-cream)' }}>
      <div className="content-wrapper">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <div className="badge badge-golden" style={{ marginBottom: '12px' }}>
            <span>COMPREHENSIVE K-12 STEM CURRICULUM</span>
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '16px' }}>
            Learning pathways engineered for every age & skill
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-body)' }}>
            Every trial session is customized to your child's age group. Select a discipline below to try it out
            with a dedicated 1:1 mentor.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {COURSES.map((course) => {
            const IconComponent = course.icon;
            return (
              <div
                key={course.id}
                className="card"
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      background: course.iconBg,
                      color: course.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComponent size={28} />
                  </div>
                  <span className={`badge ${course.badgeColor}`}>{course.badge}</span>
                </div>

                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {course.ages}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '4px' }}>{course.title}</h3>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: '1.6' }}>
                  {course.description}
                </p>

                <div style={{ background: '#FAF7F0', borderRadius: '12px', padding: '14px', marginTop: 'auto' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
                    What they'll accomplish:
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-body)' }}>
                    {course.outcomes.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectCourse(course.title)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <span>Book Free Trial in this Course</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
