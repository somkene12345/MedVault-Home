import { database } from '@/lib/firebase-client'
import { ref, update, get } from 'firebase/database'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const event = await req.json()
    const { event: eventType, data } = event

    switch (eventType) {
      case 'subscription.create':
      case 'invoice.payment_succeeded': {
        const customerCode = data.customer?.customer_code
        const usersRef = ref(database, 'users')
        const snapshot = await get(usersRef)
        const users = snapshot.val() || {}

        const userEntry = Object.entries(users).find(
          ([_, userData]: [string, any]) => userData.paystackCustomerCode === customerCode
        )

        if (userEntry) {
          const [userId] = userEntry
          const currentPeriodEnds = new Date()
          currentPeriodEnds.setMonth(currentPeriodEnds.getMonth() + 1)

          await update(ref(database, `users/${userId}`), {
            subscriptionStatus: 'active',
            currentPeriodEndsAt: currentPeriodEnds.toISOString()
          })
        }
        break
      }

      case 'subscription.disable':
      case 'invoice.payment_failed': {
        const customerCode = data.customer?.customer_code
        const usersRef = ref(database, 'users')
        const snapshot = await get(usersRef)
        const users = snapshot.val() || {}

        const userEntry = Object.entries(users).find(
          ([_, userData]: [string, any]) => userData.paystackCustomerCode === customerCode
        )

        if (userEntry) {
          const [userId] = userEntry
          await update(ref(database, `users/${userId}`), {
            subscriptionStatus: 'expired'
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}