'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import FeaturesSection from '@/components/FeaturesSection'
import PricingSection from '@/components/PricingSection'
import RegistrationForm from '@/components/RegistrationForm'

export default function HomePage() {
  const [showRegistration, setShowRegistration] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(75000)
  const [selectedPlan, setSelectedPlan] = useState('Monthly')

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSelectPlan = (amount: number, planName: string) => {
    setSelectedAmount(amount)
    setSelectedPlan(planName)
    setShowRegistration(true)
    scrollToSection('register')
  }

  return (
    <>
      <Navbar scrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section
        id="hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '120px 32px 80px',
          background: 'linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div className="animate-fadeInUp">
            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  background: 'rgba(94, 138, 223, 0.1)',
                  padding: '6px 16px',
                  borderRadius: '40px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#5e8adf'
                }}
              >
                ✨ AI-Powered Healthcare Platform
              </span>
            </div>
            <h1 style={{ fontSize: '52px', fontWeight: 800, color: '#1a365d', marginBottom: '20px', lineHeight: 1.2 }}>
              Smart Patient Management for Modern Departments
            </h1>
            <p style={{ fontSize: '18px', color: '#4a5568', marginBottom: '32px', lineHeight: 1.6 }}>
              MedVault helps healthcare departments manage patient records, track outcomes, and leverage AI insights — all in one secure platform.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => scrollToSection('pricing')}
                style={{
                  background: 'linear-gradient(135deg, #5e8adf, #01dcba)',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '40px',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(94, 138, 223, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Start Free Trial
              </button>
              <button
                onClick={() => scrollToSection('features')}
                style={{
                  background: 'white',
                  border: '2px solid #e2e8f0',
                  padding: '14px 32px',
                  borderRadius: '40px',
                  color: '#4a5568',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#5e8adf'
                  e.currentTarget.style.color = '#5e8adf'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.color = '#4a5568'
                }}
              >
                Learn More
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '400px',
                height: '400px',
                background: 'linear-gradient(135deg, rgba(94, 138, 223, 0.1), rgba(1, 220, 186, 0.1))',
                borderRadius: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}
            >
                <img 
    src="https://images.pexels.com/photos/5452291/pexels-photo-5452291.jpeg?auto=compress&cs=tinysrgb&w=600&loading=lazy"
    alt="Doctor with tablet"
    style={{
      width: '100%',
      maxWidth: '400px',
      maxHeight: '400px',
      height: '100%',
      borderRadius: '24px',
      objectFit: 'cover',}}/>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <PricingSection onSelectPlan={handleSelectPlan} />

      {/* Registration trigger section */}
      <div id="register" style={{ height: '1px' }} />

      {showRegistration && (
        <RegistrationForm
          selectedAmount={selectedAmount}
          selectedPlan={selectedPlan}
          onSuccess={() => setShowRegistration(false)}
          onClose={() => setShowRegistration(false)}
        />
      )}

      {/* Footer */}
      <footer
        style={{
          background: '#1a365d',
          color: 'white',
          padding: '48px 32px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
              <img src="/favicon.ico" alt="MedVault Logo" style={{ width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center', }} />
            <span style={{ fontSize: '24px', fontWeight: 700 }}>MedVault</span>
          </div>
          <p style={{ color: '#a0aec0', marginBottom: '24px' }}>
            Secure, AI-powered patient management for modern healthcare departments.
          </p>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            © {new Date().getFullYear()} Hex Technologies. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 80px 20px !important;
          }
          h1 {
            font-size: 36px !important;
          }
          section div div {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
        }
      `}</style>
    </>
  )
}