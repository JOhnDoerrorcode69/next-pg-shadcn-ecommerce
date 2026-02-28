import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '')

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await req.json()

    console.log('Proxying to backend:', `${API_BASE}/api/seller/onboarding/level2/submit`)

    const response = await fetch(`${API_BASE}/api/seller/onboarding/level2/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.warn('Backend returned an error:', errorText)
      return NextResponse.json({ error: 'Backend error', details: errorText }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying to backend:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
