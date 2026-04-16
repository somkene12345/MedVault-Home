'use client'

import { useState, useEffect } from 'react'
import { database } from '@/lib/firebase-client'
import { ref, set, get } from 'firebase/database'
import { generateReference } from '@/lib/paystack'
import { RegistrationFormData } from '@/lib/types'
import crypto from 'crypto'
import { FaAndroid } from "react-icons/fa";
import { FaWindows } from "react-icons/fa";

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateDepartmentId(): string {
  return `dept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

interface RegistrationFormProps {
  selectedAmount: number
  selectedPlan: string
  onSuccess: () => void
  onClose: () => void
}

export default function RegistrationForm({ selectedAmount, selectedPlan, onSuccess, onClose }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    departmentName: '',
    hodName: '',
    hodEmail: '',
    hodPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isPaystackReady, setIsPaystackReady] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrAndroidUrl, setQrAndroidUrl] = useState('')
  const [qrWindowsUrl, setQrWindowsUrl] = useState('')

  const ANDROID_APP_URL = 'https://github.com/somkene12345/MedVault/releases/download/Android/MedVault.apk';
  const WINDOWS_APP_URL = 'https://github.com/somkene12345/MedVault/releases/download/Windows/MedVault.Setup.1.0.0.exe';

  useEffect(() => {
    if (window.PaystackPop) {
      setIsPaystackReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    
    script.onload = () => {
      setIsPaystackReady(true)
    }
    
    script.onerror = () => {
      setError('Failed to load payment system. Please refresh the page.')
    }
    
    document.body.appendChild(script)
    
    return () => {}
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const initializePaystackPayment = (config: { email: string; amount: number; reference: string }): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.PaystackPop) {
        reject(new Error('Paystack SDK not loaded'))
        return
      }

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: config.email,
        amount: config.amount * 100,
        currency: 'NGN',
        ref: config.reference,
        callback: (response: any) => {
          resolve(response)
        },
        onClose: () => {
          reject(new Error('Payment window closed'))
        }
      })

      handler.openIframe()
    })
  }

  // Generate QR code URL using free API
  const generateQRCode = (text: string): string => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (formData.hodPassword !== formData.confirmPassword) {
    setError('Passwords do not match')
    return
  }

  if (formData.hodPassword.length < 6) {
    setError('Password must be at least 6 characters')
    return
  }

  setLoading(true)
  setError('')

  try {
    const usersRef = ref(database, 'users')
    const snapshot = await get(usersRef)
    const users = snapshot.val() || {}
    
    const usernameExists = Object.values(users).some((user: any) => user.username === formData.hodName)
    if (usernameExists) {
      setError('A user with this name already exists. Please use a different name.')
      setLoading(false)
      return
    }

    const hodUid = crypto.randomUUID ? crypto.randomUUID() : `hod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const departmentId = generateDepartmentId()
    const hashedPassword = hashPassword(formData.hodPassword)
    const departmentNameShort = formData.departmentName.split(',')[0].trim()
    const now = new Date()
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 30) // 30-day free trial

    // Save department with UUID
    await set(ref(database, `departments/${departmentId}`), {
      name: departmentNameShort,
      displayName: formData.departmentName,
      hodId: hodUid,
      hodName: formData.hodName,
      hodEmail: formData.hodEmail,
      createdAt: now.toISOString(),
      subscriptionActive: true, // Trial is active
      trialActive: true,
      trialEndsAt: trialEndsAt.toISOString(),
      subscriptionStatus: 'trialing',
      currentPeriodEndsAt: trialEndsAt.toISOString(),
      totalPatients: 0,
      totalDoctors: 0,
      selectedPlan: selectedPlan === "Yearly" ? "yearly" : "monthly",
      settings: {
        allowMultipleHODs: false,
        autoApproveDoctors: true,
        theme: "light"
      }
    })

    // Save user with departmentId reference
    const userData = {
      username: formData.hodName,
      password: hashedPassword,
      role: 'hod',
      institution: formData.departmentName,
      department: departmentNameShort,
      departmentId: departmentId,
      email: formData.hodEmail,
      subscriptionStatus: 'trialing',
      trialEndsAt: trialEndsAt.toISOString(),
      currentPeriodEndsAt: trialEndsAt.toISOString(),
      selectedPlan: selectedPlan === "Yearly" ? "yearly" : "monthly",
      createdAt: now.toISOString(),
      preferences: {
        showStats: true,
        showAnalytics: true,
        showForm: true,
        showTable: true,
        showDoctors: false
      }
    }

    await set(ref(database, `users/${hodUid}`), userData)
    await set(ref(database, `departmentUsers/${departmentId}/users/${hodUid}`), true)

    // Generate QR codes
    setQrAndroidUrl(generateQRCode(ANDROID_APP_URL))
    setQrWindowsUrl(generateQRCode(WINDOWS_APP_URL))
    setShowQR(true)
    
    // Store credentials for auto-login
    localStorage.setItem('user', JSON.stringify({
      uid: hodUid,
      username: formData.hodName,
      role: 'hod',
      institution: formData.departmentName,
      departmentId: departmentId,
      subscriptionStatus: 'trialing'
    }))
    localStorage.setItem('pass', formData.hodPassword)
    
    setLoading(false)
  } catch (err) {
    console.error('Registration error:', err)
    setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    setLoading(false)
  }
}

  // QR Code Success Screen
  if (showQR) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '40px',
            position: 'relative',
            textAlign: 'center'
          }}
        >
          <button
            onClick={() => {
              setShowQR(false)
              onSuccess()
              setTimeout(() => {
                window.location.href = 'https://medvault-seven.vercel.app'
              }, 500)
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#a0aec0'
            }}
          >
            ×
          </button>

          <div style={{ marginBottom: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1a365d', marginBottom: '8px' }}>
              Registration Successful!
            </h2>
            <p style={{ color: '#4a5568', marginBottom: '32px' }}>
              Your 30-day free trial has started. Download the MedVault app to continue.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            marginBottom: '32px'
          }}>
            {/* Android QR Code */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}><FaAndroid/></div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a365d', marginBottom: '16px' }}>
                  Android App
                </h3>
                <img
                  src={qrAndroidUrl}
                  alt="Android App QR Code"
                  style={{
                    width: '180px',
                    height: '180px',
                    margin: '0 auto 16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <a
                  href={ANDROID_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: '#3ddc84',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    marginTop: '8px'
                  }}
                >
                  Download APK
                </a>
              </div>
            </div>

            {/* Windows QR Code */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}><FaWindows/></div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1a365d', marginBottom: '16px' }}>
                  Windows App
                </h3>
                <img
                  src={qrWindowsUrl}
                  alt="Windows App QR Code"
                  style={{
                    width: '180px',
                    height: '180px',
                    margin: '0 auto 16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <a
                  href={WINDOWS_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: '#0078d4',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    marginTop: '8px'
                  }}
                >
                  Download Setup
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setShowQR(false)
              onSuccess()
              setTimeout(() => {
                window.location.href = 'https://medvault-seven.vercel.app'
              }, 500)
            }}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #5e8adf, #01dcba)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '32px',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#a0aec0'
          }}
        >
          ×
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a365d', marginBottom: '8px' }}>
          Register Your Department
        </h2>
        <p style={{ color: '#4a5568', marginBottom: '24px' }}>
          Selected plan: <strong>{selectedPlan}</strong> • ₦{selectedAmount.toLocaleString()}
          <br />
          <span style={{ color: '#01dcba', fontSize: '14px' }}>✓ 30-day free trial included</span>
        </p>

        {!isPaystackReady && (
          <div
            style={{
              background: '#fef3c7',
              color: '#d97706',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}
          >
            ⏳ Loading payment system... Please wait a moment.
          </div>
        )}

        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: '#2d3748' }}>Department / Institution Name *</label>
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="e.g., Internal Medicine Department, ESUTH"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: '#2d3748' }}>Head of Department Name *</label>
            <input
              type="text"
              name="hodName"
              value={formData.hodName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="e.g., Uzoma Okechukwu"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: '#2d3748' }}>HOD Email *</label>
            <input
              type="email"
              name="hodEmail"
              value={formData.hodEmail}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="hod@hospital.com"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: '#2d3748' }}>HOD Password *</label>
            <input
              type="password"
              name="hodPassword"
              value={formData.hodPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, color: '#2d3748' }}>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', fontSize: '13px', color: '#166534' }}>
            💳 Your card will be charged after the 30-day free trial ends. You can cancel anytime.
          </div>

          <button
            type="submit"
            disabled={loading || !isPaystackReady}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #5e8adf, #01dcba)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: 600,
              fontSize: '16px',
              cursor: (loading || !isPaystackReady) ? 'not-allowed' : 'pointer',
              opacity: (loading || !isPaystackReady) ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : !isPaystackReady ? 'Loading Payment System...' : `Start 30-Day Free Trial • Pay ₦${selectedAmount.toLocaleString()} after trial`}
          </button>
        </form>
      </div>
    </div>
  )
}