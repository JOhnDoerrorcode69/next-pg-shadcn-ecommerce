import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '')

export async function GET() {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Fetching status from backend:', `${API_BASE}/api/seller/onboarding/status`)

    const response = await fetch(`${API_BASE}/api/seller/onboarding/status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.warn('Backend returned an error for status:', errorText)
      return NextResponse.json({ error: 'Backend error', details: errorText }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying to backend:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
