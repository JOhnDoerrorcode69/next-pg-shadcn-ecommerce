'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Level2Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadDocument = async (docType: string, file: File | null) => {
    if (!file) return null;

    const formData = new FormData()
    formData.append('docType', docType)
    formData.append('file', file)

    const response = await fetch('/api/seller/proxy/documents', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload ${docType}`)
    }
    return await response.json()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget

    // Extract files from inputs
    const getFile = (name: string) => {
      const input = form.elements.namedItem(name) as HTMLInputElement
      return input?.files?.[0] || null
    }

    try {
      // Upload all required documents
      const uploads = [
        uploadDocument('PAN_PROOF', getFile('panProof')),
        uploadDocument('BANK_PROOF', getFile('bankProof')),
        uploadDocument('SIGNATORY_ID', getFile('signatoryId')),
        uploadDocument('LIVE_SELFIE', getFile('liveSelfie')),
        uploadDocument('ADDRESS_PROOF', getFile('addressProof')),
      ]

      // Optional uploads
      const gstCert = getFile('gstCert')
      if (gstCert) uploads.push(uploadDocument('GST_CERT', gstCert))

      const shopImage = getFile('shopImage')
      if (shopImage) uploads.push(uploadDocument('SHOP_IMAGE', shopImage))

      // Wait for all uploads to complete
      await Promise.all(uploads)

      // Submit level 2 textual data
      const payload = {
        panNumber: (form.elements.namedItem('panNumber') as HTMLInputElement).value,
        gstin: (form.elements.namedItem('gstin') as HTMLInputElement).value,
        bankAccountNumber: (form.elements.namedItem('bankAccountNumber') as HTMLInputElement).value,
        bankIfscCode: (form.elements.namedItem('bankIfscCode') as HTMLInputElement).value,
      }

      const response = await fetch('/api/seller/proxy/level2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit Level 2 details')
      }

      router.push('/seller/onboarding/category')
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
        <h1 className="h1-bold">Seller Onboarding: Step 2</h1>
        <p className="text-emerald-100/80 mt-2 font-medium">Business & Document Verification</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        <div className="p-6 border border-white/20 rounded-xl bg-black/20 backdrop-blur-md space-y-5">
          <h2 className="h3-bold border-b border-white/10 pb-3">Business & Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="panNumber" className="text-emerald-50">PAN Number</Label>
              <Input id="panNumber" name="panNumber" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Enter a valid PAN" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstin" className="text-emerald-50">GSTIN</Label>
              <Input id="gstin" name="gstin" pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" title="Enter a valid GSTIN" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber" className="text-emerald-50">Bank Account Number</Label>
              <Input id="bankAccountNumber" name="bankAccountNumber" type="text" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankIfscCode" className="text-emerald-50">Bank IFSC Code</Label>
              <Input id="bankIfscCode" name="bankIfscCode" pattern="^[A-Z]{4}0[A-Z0-9]{6}$" title="Enter a valid IFSC code" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 rounded-xl bg-black/20 backdrop-blur-md space-y-5">
          <h2 className="h3-bold border-b border-white/10 pb-3">Mandatory Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="panProof" className="text-emerald-50">PAN Proof (Image/PDF)</Label>
              <Input id="panProof" name="panProof" type="file" accept=".pdf,image/*" required className="bg-white/10 border-white/20 text-white file:text-emerald-900 file:bg-emerald-100 file:border-0 hover:file:bg-emerald-200 file:rounded-md cursor-pointer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankProof" className="text-emerald-50">Bank Proof (Cancelled Cheque)</Label>
              <Input id="bankProof" name="bankProof" type="file" accept=".pdf,image/*" required className="bg-white/10 border-white/20 text-white file:text-emerald-900 file:bg-emerald-100 file:border-0 hover:file:bg-emerald-200 file:rounded-md cursor-pointer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signatoryId" className="text-emerald-50">Signatory ID (Aadhaar/Voter ID)</Label>
              <Input id="signatoryId" name="signatoryId" type="file" accept=".pdf,image/*" required className="bg-white/10 border-white/20 text-white file:text-emerald-900 file:bg-emerald-100 file:border-0 hover:file:bg-emerald-200 file:rounded-md cursor-pointer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressProof" className="text-emerald-50">Address Proof</Label>
              <Input id="addressProof" name="addressProof" type="file" accept=".pdf,image/*" required className="bg-white/10 border-white/20 text-white file:text-emerald-900 file:bg-emerald-100 file:border-0 hover:file:bg-emerald-200 file:rounded-md cursor-pointer" />
            </div>

            <div className="space-y-2 md:col-span-2 pt-2">
              <Label htmlFor="liveSelfie" className="text-emerald-50">Live Selfie Upload</Label>
              <Input id="liveSelfie" name="liveSelfie" type="file" accept="image/*" capture="user" required className="bg-white/10 border-white/20 text-white file:text-emerald-900 file:bg-emerald-100 file:border-0 hover:file:bg-emerald-200 file:rounded-md cursor-pointer" />
              <p className="text-xs text-emerald-100/70 mt-1">Please ensure good lighting and clear face visibility.</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/20 rounded-xl bg-black/20 backdrop-blur-md space-y-5">
          <h2 className="h3-bold border-b border-white/10 pb-3">Optional Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gstCert" className="text-emerald-50">GST Certificate</Label>
              <Input id="gstCert" name="gstCert" type="file" accept=".pdf,image/*" className="bg-white/10 border-white/20 text-white file:text-emerald-900 file:bg-emerald-100 file:border-0 hover:file:bg-emerald-200 file:rounded-md cursor-pointer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopImage" className="text-emerald-50">Geo-tagged Shop Image</Label>
              <Input id="shopImage" name="shopImage" type="file" accept="image/*" className="bg-white/10 border-white/20 text-white file:text-emerald-900 file:bg-emerald-100 file:border-0 hover:file:bg-emerald-200 file:rounded-md cursor-pointer" />
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
            {loading ? 'Uploading...' : 'Upload & Continue to Category Approval'}
          </Button>
        </div>
      </form>
    </div>
  )
}
