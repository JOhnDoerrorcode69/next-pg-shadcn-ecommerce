import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '')

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()

    console.log('Proxying file upload to backend:', `${API_BASE}/api/seller/onboarding/documents`)

    // Convert to a new FormData object to cleanly pass to fetch
    const backendFormData = new FormData()
    formData.forEach((value, key) => {
      backendFormData.append(key, value)
    })

    const response = await fetch(`${API_BASE}/api/seller/onboarding/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        // Note: Do not set Content-Type to multipart/form-data here.
        // fetch will automatically set it with the correct boundary when passing FormData.
      },
      body: backendFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.warn('Backend returned an error for file upload:', errorText)
      return NextResponse.json({ error: 'Backend error', details: errorText }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying to backend:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
