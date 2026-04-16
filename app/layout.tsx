import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MedVault - Smart Health Records Management',
  description: 'Secure, AI-powered patient management system for hospitals and departments. Start your 30-day free trial today.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        {/* Load Paystack SDK */}
        <Script 
          src="https://js.paystack.co/v1/inline.js"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  )
}