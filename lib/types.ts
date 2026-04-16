export interface User {
  uid: string
  username: string
  email: string
  password: string
  role: 'hod' | 'user'
  department: string
  institution?: string
  subscriptionStatus: 'trialing' | 'active' | 'expired' | 'cancelled'
  trialEndsAt?: string
  currentPeriodEndsAt?: string
  paystackCustomerCode?: string
  paystackSubscriptionCode?: string
  createdAt: string
  preferences?: {
    showStats?: boolean
    showAnalytics?: boolean
    showForm?: boolean
    showTable?: boolean
    showDoctors?: boolean
  }
}

export interface RegistrationFormData {
  departmentName: string
  hodName: string
  hodEmail: string
  hodPassword: string
  confirmPassword: string
}

export interface Plan {
  name: string
  priceNGN: number
  priceUSD: string
  period: string
  features: string[]
  popular: boolean
}