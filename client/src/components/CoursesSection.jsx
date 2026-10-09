import React from 'react';
import { Code, Bot, Cpu, Globe2, Brain, ArrowRight, Sparkles } from 'lucide-react';

export const COURSES = [
  {
    id: 'scratch',
    title: 'Scratch & Game Development',
    ages: 'Ages 5 – 9',
    badge: 'Beginner Favorite',
    badgeColor: 'badge-coral',
    icon: Code,
    iconBg: '#FFE4E6',
    iconColor: '#BE123C',
    description: 'Block-based coding to build interactive arcade games, animated stories, and core logic foundations.',
    outcomes: ['20+ Mini Games Created', 'Drag-and-Drop Logic Blocks', 'Creative Animation & Audio'],
  },
  {
    id: 'python',
    title: 'Python & Algorithmic Logic',
    ages: 'Ages 9 – 14',
    badge: 'Industry Standard',
    badgeColor: 'badge-golden',
    icon: Cpu,
    iconBg: '#FEF3C7',
    iconColor: '#B45309',
    description: 'Real-world syntax, data structures, conditional problem-solving, and clean algorithmic thinking.',
    outcomes: ['Real Python Syntax Mastery', 'Interactive Calculator & Games', 'Computational Problem Solving'],
  },
  {
    id: 'robotics',
    title: 'Robotics & Hardware Systems',
    ages: 'Ages 8 – 15',
    badge: 'Hands-on STEM',
    badgeColor: 'badge-teal',
    icon: Bot,
    iconBg: '#CCFBF1',
    iconColor: '#0F766E',
    description: 'Micro:bit circuits, Arduino virtual breadboarding, sensors, motor drivers, and automated systems.',
    outcomes: ['Sensor Interfacing & I/O', 'Automation Circuit Simulation', 'Tinkercad 3D Circuit Logic'],
  },
  {
    id: 'web',
    title: 'Web Apps & Full Stack Coding',
    ages: 'Ages 10 – 17',
    badge: 'Real-World Production',
    badgeColor: 'badge-purple',
    icon: Globe2,
    iconBg: '#EDE9FE',
    iconColor: '#6D28D9',
    description: 'Build real deployed web applications using HTML5, modern CSS, dynamic JavaScript, and APIs.',
    outcomes: ['Live Deployed Web Application', 'Responsive Mobile Design', 'Interactive DOM Manipulation'],
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning for Kids',
    ages: 'Ages 12 – 18',
    badge: 'Next-Gen Frontier',
    badgeColor: 'badge-blue',
    icon: Brain,
    iconBg: '#DBEAFE',
    iconColor: '#1D4ED8',
    description: 'Understand neural networks, train computer vision image models, and build custom conversational chatbots.',
    outcomes: ['Computer Vision Models', 'Generative AI Prompt Engineering', 'Data Analytics & Ethics'],
  },
];

export default function CoursesSection({ onSelectCourse }) {
  return (
    <section id="courses-section" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="content-wrapper">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px' }}>
          <div className="announcement-pill" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="#D97706" />
            <span>K-12 STEM CURRICULUM PATHWAYS</span>
          </div>
          <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
            Disciplines engineered for every age & experience level
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-body)', lineHeight: '1.6' }}>
            Every trial session is customized to your child's age group. Select a pathway below to experience it live
            with a certified 1:1 mentor.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {COURSES.map((course) => {
            const IconComponent = course.icon;
            return (
              <div
                key={course.id}
                className="card card-interactive"
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'white',
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
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <IconComponent size={26} />
                  </div>
                  <span className={`badge ${course.badgeColor}`}>{course.badge}</span>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {course.ages}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '4px', letterSpacing: '-0.3px' }}>
                    {course.title}
                  </h3>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: '1.6' }}>
                  {course.description}
                </p>

                <div
                  style={{
                    background: '#F8FAFC',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    border: '1px solid var(--border-subtle)',
                    marginTop: 'auto',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Key Learning Milestones:
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-body)' }}>
                    {course.outcomes.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectCourse(course.title)}
                  className="btn btn-primary btn-shimmer"
                  style={{ width: '100%', marginTop: '6px' }}
                >
                  <span>Book Free Trial in {course.title.split(' ')[0]}</span>
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
