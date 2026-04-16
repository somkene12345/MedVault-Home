'use client'

import { useState, useEffect } from 'react'
import { FiX, FiDownload} from 'react-icons/fi'
import {MdOutlineQrCode2} from 'react-icons/md'
import { FaAndroid } from "react-icons/fa";
import { FaWindows } from "react-icons/fa";

interface NavbarProps {
  scrollToSection: (id: string) => void
}

export default function Navbar({ scrollToSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)

  const ANDROID_APP_URL = 'https://github.com/somkene12345/MedVault-Home/releases/download/Android/MedVault.apk';
  const WINDOWS_APP_URL = 'https://github.com/somkene12345/MedVault-Home/releases/download/Windows/MedVault.Setup.1.0.0.exe';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const generateQRCodeUrl = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
          zIndex: 1000,
          padding: '16px 32px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => scrollToSection('hero')}
          >
            <img src="/favicon.ico" alt="MedVault Logo" style={{ width: '40px', height: '40px' }} />
            <span
              style={{
                fontSize: '24px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1a365d, #5e8adf)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              MedVault
            </span>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '32px' }}>
              <button
                onClick={() => scrollToSection('features')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#4a5568',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5e8adf')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4a5568')}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#4a5568',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5e8adf')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4a5568')}
              >
                Pricing
              </button>
              <button
                onClick={() => setShowInstallModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#4a5568',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5e8adf')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4a5568')}
              >
                <FiDownload size={16} />
                Install
              </button>
            </div>
            <button
              onClick={() => scrollToSection('register')}
              style={{
                background: 'linear-gradient(135deg, #5e8adf, #01dcba)',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '40px',
                color: 'white',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(94, 138, 223, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Get Started
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#1a365d'
            }}
            className="mobile-menu-btn"
          >
            ☰
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            background: 'white',
            padding: '24px',
            zIndex: 999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <button
            onClick={() => {
              scrollToSection('features')
              setIsMobileMenuOpen(false)
            }}
            style={{ background: 'none', border: 'none', fontSize: '18px', padding: '12px', textAlign: 'left', cursor: 'pointer' }}
          >
            Features
          </button>
          <button
            onClick={() => {
              scrollToSection('pricing')
              setIsMobileMenuOpen(false)
            }}
            style={{ background: 'none', border: 'none', fontSize: '18px', padding: '12px', textAlign: 'left', cursor: 'pointer' }}
          >
            Pricing
          </button>
          <button
            onClick={() => {
              setShowInstallModal(true)
              setIsMobileMenuOpen(false)
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiDownload size={18} />
            Install App
          </button>
          <button
            onClick={() => {
              scrollToSection('register')
              setIsMobileMenuOpen(false)
            }}
            style={{
              background: 'linear-gradient(135deg, #5e8adf, #01dcba)',
              border: 'none',
              padding: '12px',
              borderRadius: '40px',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Get Started
          </button>
        </div>
      )}

      {/* Installation Modal */}
      {showInstallModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
          onClick={() => setShowInstallModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '40px',
              position: 'relative',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInstallModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#a0aec0',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#4a5568')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#a0aec0')}
            >
              <FiX size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #5e8adf, #01dcba)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <FiDownload size={40} color="white" />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a365d', marginBottom: '8px' }}>
                Download MedVault App
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                Choose your platform to get started
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '32px',
                marginBottom: '32px'
              }}
            >
              {/* Android Card */}
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '20px',
                  padding: '28px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                className="install-card"
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    background: '#3ddc84',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}
                >
                  <FaAndroid size={32} color="white" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a365d', marginBottom: '8px' }}>
                  Android App
                </h3>
                <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
                  Download the APK file for Android devices
                </p>
                
                {/* QR Code */}
                <div style={{ marginBottom: '20px' }}>
                  <img
                    src={generateQRCodeUrl(ANDROID_APP_URL)}
                    alt="Android App QR Code"
                    style={{
                      width: '160px',
                      height: '160px',
                      margin: '0 auto',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                  <p style={{ fontSize: '11px', color: '#a0aec0', marginTop: '8px' }}>
                    Scan QR code with your phone
                  </p>
                </div>

                <a
                  href={ANDROID_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: '#3ddc84',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'transform 0.2s'
                  }}
                  className="download-btn"
                >
                  <FiDownload size={16} />
                  Download APK
                </a>
              </div>

              {/* Windows Card */}
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '20px',
                  padding: '28px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                className="install-card"
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    background: '#0078d4',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}
                >
                  <FaWindows size={32} color="white" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1a365d', marginBottom: '8px' }}>
                  Windows App
                </h3>
                <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
                  Download the installer for Windows PC
                </p>

                {/* QR Code */}
                <div style={{ marginBottom: '20px' }}>
                  <img
                    src={generateQRCodeUrl(WINDOWS_APP_URL)}
                    alt="Windows App QR Code"
                    style={{
                      width: '160px',
                      height: '160px',
                      margin: '0 auto',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                  <p style={{ fontSize: '11px', color: '#a0aec0', marginTop: '8px' }}>
                    Scan QR code to download
                  </p>
                </div>

                <a
                  href={WINDOWS_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: '#0078d4',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'transform 0.2s'
                  }}
                  className="download-btn"
                >
                  <FiDownload size={16} />
                  Download Setup
                </a>
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0',
                marginTop: '8px'
              }}
            >
              <p style={{ fontSize: '12px', color: '#a0aec0' }}>
                MedVault is also available as a web app at{' '}
                <a
                  href="https://medvault-seven.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#5e8adf', textDecoration: 'none' }}
                >
                  medvault-seven.vercel.app
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          nav div:first-child div:first-child {
            display: none !important;
          }
        }
        
        .install-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        
        .download-btn:hover {
          transform: translateY(-2px);
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}