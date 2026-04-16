export interface PaystackConfig {
  email: string
  amount: number
  reference: string
}

export interface PaystackResponse {
  reference: string
  status: string
  message: string
  transaction: string
  trxref: string
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string
        email: string
        amount: number
        currency: string
        ref: string
        callback: (response: PaystackResponse) => void
        onClose: () => void
      }) => {
        openIframe: () => void
      }
    }
  }
}

export const initializePaystackPayment = (config: PaystackConfig): Promise<PaystackResponse> => {
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
      callback: (response: PaystackResponse) => {
        resolve(response)
      },
      onClose: () => {
        reject(new Error('Payment window closed'))
      }
    })

    handler.openIframe()
  })
}

export const generateReference = (): string => {
  return `MEDVAULT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}