import { Resend } from 'resend'
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants'
import PurchaseReceiptEmail from './purchase-receipt'
import { Order } from '@/types'

const resend = new Resend((process.env.RESEND_API_KEY as string) || 're_dummy_key')

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Email will not be sent.')
    return
  }
  const res = await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: 'Order Confirmation',
    react: <PurchaseReceiptEmail order={order} />,
  })
  console.log(res)
}
