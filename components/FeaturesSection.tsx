'use client'

import { 
  FiUsers, 
  FiBarChart2, 
  FiCpu, 
  FiShield, 
  FiUserPlus, 
  FiSmartphone 
} from "react-icons/fi";

interface Feature {
  icon: React.ReactNode;  // Change from 'Element' to 'React.ReactNode'
  title: string;
  description: string;
}

const features: Feature[] = [
  { 
    icon: <FiUsers size={48} />, 
    title: 'Patient Management', 
    description: 'Comprehensive patient records, diagnosis tracking, and medical history in one place.' 
  },
  { 
    icon: <FiBarChart2 size={48} />, 
    title: 'Advanced Analytics', 
    description: 'Real-time insights, department performance, and patient outcome tracking.' 
  },
  { 
    icon: <FiCpu size={48} />, 
    title: 'AI-Powered Assistant', 
    description: 'Smart diagnosis suggestions and ICD-10 code recommendations.' 
  },
  { 
    icon: <FiShield size={48} />, 
    title: 'Bank-Level Security', 
    description: 'End-to-end encryption and secure access controls for sensitive data.' 
  },
  { 
    icon: <FiUserPlus size={48} />, 
    title: 'Multi-Doctor Support', 
    description: 'Add unlimited doctors under your department with role-based access.' 
  },
  { 
    icon: <FiSmartphone size={48} />, 
    title: 'Mobile Responsive', 
    description: 'Access patient records from anywhere, on any device.' 
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '100px 32px', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: '16px' }}>
          <span
            style={{
              background: 'linear-gradient(135deg, rgba(94, 138, 223, 0.1), rgba(1, 220, 186, 0.1))',
              padding: '6px 16px',
              borderRadius: '40px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#5e8adf'
            }}
          >
            Powerful Features
          </span>
        </div>
        <h2 style={{ fontSize: '40px', fontWeight: 700, color: '#1a365d', marginBottom: '16px' }}>
          Everything you need to manage<br />your department efficiently
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: '#4a5568',
            marginBottom: '48px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          Built for healthcare professionals who demand excellence
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: '#f8fafc',
                borderRadius: '20px',
                padding: '32px',
                textAlign: 'left',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer'
              }}
              className="feature-card"
            >
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '16px',
                color: '#5e8adf',
                display: 'flex',
                alignItems: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a365d', marginBottom: '12px' }}>{feature.title}</h3>
              <p style={{ color: '#4a5568', lineHeight: 1.6 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        @media (max-width: 768px) {
          section {
            padding: 60px 20px !important;
          }
          h2 {
            font-size: 28px !important;
          }
        }
      `}</style>
    </section>
  )
}