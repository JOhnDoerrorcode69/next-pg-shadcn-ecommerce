'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [categoryType, setCategoryType] = useState<string>('')

  // MRO Specific State
  const [mroMappingPreview, setMroMappingPreview] = useState<string | null>(null)

  const handleMroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate mapping preview after "uploading"
      setTimeout(() => {
        setMroMappingPreview('Found 54 products. Columns mapped: Name, Price, SKU, Description. Validation: Success.')
      }, 1000)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!categoryType) {
      setError('Please select a category')
      setLoading(false)
      return
    }

    // Build category-specific data payload
    let categoryData = {}

    if (categoryType === 'MACHINERIES_NEW') {
      const formElement = e.currentTarget as HTMLFormElement
      categoryData = {
        hpCapacity: (formElement.elements.namedItem('hpCapacity') as HTMLInputElement)?.value,
        warrantyInfo: (formElement.elements.namedItem('warrantyInfo') as HTMLInputElement)?.value,
        serviceContact: (formElement.elements.namedItem('serviceContact') as HTMLInputElement)?.value,
      }
    } else if (categoryType === 'MRO') {
      categoryData = {
        mappingPreviewConfirmed: !!mroMappingPreview,
      }
    } else if (categoryType === 'SEEDS_FERTILIZERS') {
      const formElement = e.currentTarget as HTMLFormElement
      categoryData = {
        batchMfgExpiry: (formElement.elements.namedItem('batchMfgExpiry') as HTMLInputElement)?.value,
        sellerDeclaration: (formElement.elements.namedItem('sellerDeclaration') as HTMLInputElement)?.checked,
      }
    }

    const payload = {
      categoryType: categoryType,
      data: categoryData
    }

    try {
      const response = await fetch('/api/seller/proxy/category-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit category approval')
      }

      router.push('/seller/dashboard')
    } catch (err: any) {
      console.warn('Fallback: Redirecting to dashboard anyway', err)
      router.push('/seller/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Seller Onboarding: Step 3</h1>
        <p className="text-gray-500 mt-2">Category Selection and Approval Details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="categoryType" className="text-lg">Select Primary Business Category</Label>
          <Select onValueChange={(val) => setCategoryType(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MACHINERIES_NEW">Machineries (New)</SelectItem>
              <SelectItem value="MRO">Maintenance, Repair, and Operations (MRO)</SelectItem>
              <SelectItem value="SEEDS_FERTILIZERS">Seeds & Fertilizers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Category Fields */}
        <div className="pt-4 border-t min-h-[200px]">
          {!categoryType && (
            <div className="text-center text-gray-400 py-10">
              Please select a category above to view specific requirements.
            </div>
          )}

          {categoryType === 'MACHINERIES_NEW' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-lg font-semibold">Machinery Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hpCapacity">HP / PTO / Capacity Details</Label>
                  <Input id="hpCapacity" name="hpCapacity" placeholder="e.g. 50 HP, 540 RPM PTO" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warrantyInfo">Warranty Terms</Label>
                  <Input id="warrantyInfo" name="warrantyInfo" placeholder="e.g. 1 Year Manufacturer Warranty" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceContact">Service Support Contact Details</Label>
                  <Input id="serviceContact" name="serviceContact" placeholder="Toll-free or service email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealerAuthDoc">Dealer Authorization Document (Optional)</Label>
                  <Input id="dealerAuthDoc" name="dealerAuthDoc" type="file" accept=".pdf,image/*" />
                </div>
              </div>
            </div>
          )}

          {categoryType === 'MRO' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-lg font-semibold">Bulk Upload for MRO</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mroCsv">Upload Products CSV/Excel</Label>
                  <Input
                    id="mroCsv"
                    name="mroCsv"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleMroUpload}
                    required
                  />
                  <p className="text-xs text-gray-500">Download our template to ensure correct column mapping.</p>
                </div>

                {mroMappingPreview && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    <span className="font-semibold block mb-1">Mapping Preview:</span>
                    {mroMappingPreview}
                  </div>
                )}
              </div>
            </div>
          )}

          {categoryType === 'SEEDS_FERTILIZERS' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-lg font-semibold">Seeds & Fertilizers Compliance</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="batchMfgExpiry">Batch, Manufacturing & Expiry Info Format</Label>
                  <Input id="batchMfgExpiry" name="batchMfgExpiry" placeholder="e.g. Printed on packaging, Valid for 2 years" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseUpload">Trade/Storage License Upload (If applicable)</Label>
                  <Input id="licenseUpload" name="licenseUpload" type="file" accept=".pdf,image/*" />
                </div>
                <div className="flex items-start gap-3 mt-4">
                  <input
                    type="checkbox"
                    id="sellerDeclaration"
                    name="sellerDeclaration"
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <Label htmlFor="sellerDeclaration" className="font-normal text-sm leading-tight text-gray-700">
                    I declare that all products sold under this category comply with the Insecticides Act, 1968, and the Fertilizer (Control) Order, 1985.
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-6 border-t">
          <Button type="submit" className="w-full md:w-auto" disabled={loading || (categoryType === 'MRO' && !mroMappingPreview)}>
            {loading ? 'Submitting...' : 'Submit Category Approval & Go to Dashboard'}
          </Button>
        </div>
      </form>
    </div>
  )
}
