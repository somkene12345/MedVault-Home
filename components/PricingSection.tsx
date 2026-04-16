'use client'

import { Plan } from '@/lib/types'
import { FiTrendingUp } from 'react-icons/fi'

const plans: Plan[] = [
  {
    name: 'Monthly',
    priceNGN: 75000,
    priceUSD: '$49',
    period: 'per month',
    features: ['30-day free trial', 'Unlimited patients', 'Unlimited doctors', 'AI Assistant', 'Analytics dashboard'],
    popular: false
  },
  {
    name: 'Yearly',
    priceNGN: 750000,
    priceUSD: '$499',
    period: 'per year',
    features: ['30-day free trial', 'Unlimited patients', 'Unlimited doctors', 'AI Assistant', 'Analytics dashboard', 'Save ₦150,000'],
    popular: true
  }
]

interface PricingSectionProps {
  onSelectPlan: (amount: number, planName: string) => void
}

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const monthlyYearlyCost = 75000 * 12
  const yearlyCost = 750000
  const savings = monthlyYearlyCost - yearlyCost

  return (
    <section id="pricing" style={{ padding: '100px 32px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7f5 100%)' }}>
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
            Simple Pricing
          </span>
        </div>
        <h2 style={{ fontSize: '40px', fontWeight: 700, color: '#1a365d', marginBottom: '16px' }}>
          Start with a 30-day free trial<br />No credit card required
        </h2>
        <p style={{ fontSize: '18px', color: '#4a5568', marginBottom: '48px' }}>
          Choose the plan that works for your department
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap'
          }}
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '380px',
                width: '100%',
                position: 'relative',
                boxShadow: plan.popular ? '0 20px 40px rgba(94, 138, 223, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
                transform: plan.popular ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.3s'
              }}
              className="pricing-card"
            >
              {plan.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #5e8adf, #01dcba)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '40px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  ⭐ BEST VALUE
                </div>
              )}
              <h3 style={{ fontSize: '28px', fontWeight: 700, color: '#1a365d', marginBottom: '8px' }}>{plan.name}</h3>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 800, color: '#5e8adf' }}>₦{plan.priceNGN.toLocaleString()}</span>
                <span style={{ color: '#4a5568' }}> / {plan.period}</span>
              </div>
              
              {plan.name === 'Yearly' && (
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#10b981', 
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <FiTrendingUp size={14} />
                    Save ₦{savings.toLocaleString()} (16.7% off)
                  </span>
                  <div style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>
                    ≈ ₦62,500/month
                  </div>
                </div>
              )}
              
              {plan.name === 'Monthly' && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>
                    ₦{monthlyYearlyCost.toLocaleString()}/year
                  </div>
                </div>
              )}
              
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px' }}>≈ {plan.priceUSD} USD</p>
              
              <ul style={{ listStyle: 'none', marginBottom: '32px', textAlign: 'left' }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#01dcba', fontSize: '20px' }}>✓</span>
                    <span style={{ color: '#4a5568' }}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => onSelectPlan(plan.priceNGN, plan.name)}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: plan.popular ? 'linear-gradient(135deg, #5e8adf, #01dcba)' : 'white',
                  border: plan.popular ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '12px',
                  color: plan.popular ? 'white' : '#5e8adf',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="plan-btn"
              >
                Start Free Trial
              </button>
              
              {plan.name === 'Monthly' && (
                <div style={{ marginTop: '16px', fontSize: '12px', color: '#718096', textAlign: 'center' }}>
                  🔄 Cancel anytime
                </div>
              )}
              {plan.name === 'Yearly' && (
                <div style={{ marginTop: '16px', fontSize: '12px', color: '#718096', textAlign: 'center' }}>
                  💰 Best value for long-term commitment
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .pricing-card:hover {
          transform: translateY(-8px) scale(${(props: any) => props.plan?.popular ? '1.02' : '1'}) !important;
        }
        .plan-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(94, 138, 223, 0.3);
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