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
      legalBusinessName: formData.get('legalBusinessName'),
      storeName: formData.get('storeName'),
      pickupAddress: formData.get('pickupAddress'),
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
        throw new Error('Failed to submit Level 1 details')
      }

      router.push('/seller/onboarding/level2')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during submission. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8">
      <div>
        <h1 className="h1-bold">Seller Onboarding: Step 1</h1>
        <p className="text-emerald-100/80 mt-2 font-medium">Basic Business Details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* OTP Flow */}
        <div className="p-6 border border-white/20 rounded-xl bg-black/20 backdrop-blur-md space-y-5">
          <h2 className="h3-bold border-b border-white/10 pb-3">Mobile Verification</h2>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <Label htmlFor="mobile" className="text-emerald-50">Mobile Number</Label>
              <Input
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                disabled={otpVerified}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500"
              />
            </div>
            {!otpVerified && (
              <Button type="button" onClick={handleSendOtp} variant="secondary" className="w-full md:w-auto bg-white/20 hover:bg-white/30 text-white border-0">
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </Button>
            )}
          </div>

          {otpSent && !otpVerified && (
            <div className="flex flex-col md:flex-row gap-4 items-end mt-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex-1 w-full space-y-2">
                <Label htmlFor="otp" className="text-emerald-50">Enter OTP (use 1234)</Label>
                <Input
                  id="otp"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="Enter 4-digit OTP"
                  className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500"
                />
              </div>
              <Button type="button" onClick={handleVerifyOtp} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white">
                Verify
              </Button>
            </div>
          )}
          {otpVerified && <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">✓</span>
            Mobile verified successfully
          </p>}
        </div>

        {/* Business Details */}
        <div className="p-6 border border-white/20 rounded-xl bg-black/20 backdrop-blur-md space-y-5">
          <h2 className="h3-bold border-b border-white/10 pb-3">Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="legalBusinessName" className="text-emerald-50">Legal Business Name</Label>
              <Input id="legalBusinessName" name="legalBusinessName" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-emerald-50">Store Name</Label>
              <Input id="storeName" name="storeName" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pickupAddress" className="text-emerald-50">Pickup Address</Label>
              <Input id="pickupAddress" name="pickupAddress" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button type="submit" className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all active:scale-95" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Continue to Next Step'}
          </Button>
        </div>
      </form>
    </div>
  )
}
