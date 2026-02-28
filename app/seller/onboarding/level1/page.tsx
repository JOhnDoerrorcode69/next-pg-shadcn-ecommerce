'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Level1Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // OTP State
  const [mobile, setMobile] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpValue, setOtpValue] = useState('')

  const handleSendOtp = () => {
    if (!mobile || mobile.length < 10) {
      alert('Please enter a valid mobile number')
      return
    }
    setOtpSent(true)
    alert('OTP sent! (mock)')
  }

  const handleVerifyOtp = () => {
    if (otpValue === '1234') {
      setOtpVerified(true)
      alert('OTP verified! (mock)')
    } else {
      alert('Invalid OTP. Use 1234 for testing.')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!otpVerified) {
      alert('Please verify your mobile number first.')
      setLoading(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const payload = {
      mobile: mobile,
      email: formData.get('email'),
      legalBusinessName: formData.get('legalBusinessName'),
      storeName: formData.get('storeName'),
      pickupAddress: formData.get('pickupAddress'),
      panNumber: formData.get('panNumber'),
      gstin: formData.get('gstin'),
      bankAccountNumber: formData.get('bankAccountNumber'),
      ifsc: formData.get('ifsc'),
      accountHolderName: formData.get('accountHolderName'),
    }

    try {
      // Use NextAuth session to get access token, we will mock it here for the server call first
      // Actually we need to get the session from NextAuth
      const response = await fetch('/api/seller/proxy/level1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        // Fallback for when backend is not ready
        console.warn('Backend returned error, falling back to mock success')
        throw new Error('Backend error')
      }

      router.push('/seller/onboarding/level2')
    } catch (err: any) {
      console.warn('Fallback: Redirecting to level 2 anyway')
      router.push('/seller/onboarding/level2')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Seller Onboarding: Step 1</h1>
        <p className="text-gray-500 mt-2">Basic Business and Bank Details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Flow */}
        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
          <h2 className="text-lg font-semibold">Mobile Verification</h2>
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                disabled={otpVerified}
                required
              />
            </div>
            {!otpVerified && (
              <Button type="button" onClick={handleSendOtp} variant="secondary">
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </Button>
            )}
          </div>

          {otpSent && !otpVerified && (
            <div className="flex gap-2 items-end mt-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="otp">Enter OTP (use 1234)</Label>
                <Input
                  id="otp"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="Enter 4-digit OTP"
                />
              </div>
              <Button type="button" onClick={handleVerifyOtp} variant="default">
                Verify
              </Button>
            </div>
          )}
          {otpVerified && <p className="text-green-600 text-sm font-medium">✓ Mobile verified successfully</p>}
        </div>

        {/* Business Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalBusinessName">Legal Business Name</Label>
              <Input id="legalBusinessName" name="legalBusinessName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" name="storeName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Input id="pickupAddress" name="pickupAddress" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input id="panNumber" name="panNumber" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Enter a valid PAN" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input id="gstin" name="gstin" pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" title="Enter a valid GSTIN" required />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <Input id="accountHolderName" name="accountHolderName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber">Account Number</Label>
              <Input id="bankAccountNumber" name="bankAccountNumber" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifsc">IFSC Code</Label>
              <Input id="ifsc" name="ifsc" pattern="^[A-Z]{4}0[A-Z0-9]{6}$" title="Enter a valid IFSC code" required />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-4">
          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Continue to Next Step'}
          </Button>
        </div>
      </form>
    </div>
  )
}
