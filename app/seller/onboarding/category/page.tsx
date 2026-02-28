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
      requiredFieldsJson: JSON.stringify(categoryData)
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
      console.error(err)
      setError(err.message || 'An error occurred during submission. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8">
      <div>
        <h1 className="h1-bold">Seller Onboarding: Step 3</h1>
        <p className="text-emerald-100/80 mt-2 font-medium">Category Selection & Approvals</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="p-6 border border-white/20 rounded-xl bg-black/20 backdrop-blur-md space-y-5">
          <Label htmlFor="categoryType" className="text-lg text-emerald-50 font-semibold block mb-3">Select Primary Business Category</Label>
          <Select onValueChange={(val) => setCategoryType(val)}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-emerald-500">
              <SelectValue placeholder="Select a category..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1b431e] border-white/20 text-white">
              <SelectItem value="MACHINERIES_NEW" className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">Machineries (New)</SelectItem>
              <SelectItem value="MRO" className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">Maintenance, Repair, and Operations (MRO)</SelectItem>
              <SelectItem value="SEEDS_FERTILIZERS" className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">Seeds & Fertilizers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Category Fields */}
        <div className="p-6 border border-white/20 rounded-xl bg-black/20 backdrop-blur-md min-h-[250px] transition-all duration-300">
          {!categoryType && (
            <div className="flex items-center justify-center h-full min-h-[150px] text-emerald-100/50 italic text-center">
              Please select a category above to view specific requirements.
            </div>
          )}

          {categoryType === 'MACHINERIES_NEW' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="h3-bold border-b border-white/10 pb-3">Machinery Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hpCapacity" className="text-emerald-50">HP / PTO / Capacity Details</Label>
                  <Input id="hpCapacity" name="hpCapacity" placeholder="e.g. 50 HP, 540 RPM PTO" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warrantyInfo" className="text-emerald-50">Warranty Terms</Label>
                  <Input id="warrantyInfo" name="warrantyInfo" placeholder="e.g. 1 Year Manufacturer Warranty" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceContact" className="text-emerald-50">Service Support Contact Details</Label>
                  <Input id="serviceContact" name="serviceContact" placeholder="Toll-free or service email" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealerAuthDoc" className="text-emerald-50">Dealer Authorization Document (Optional)</Label>
                  <Input id="dealerAuthDoc" name="dealerAuthDoc" type="file" accept=".pdf,image/*" className="bg-white/10 border-white/20 text-white file:text-emerald-900 file:bg-emerald-100 file:border-0 hover:file:bg-emerald-200 file:rounded-md cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {categoryType === 'MRO' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="h3-bold border-b border-white/10 pb-3">Bulk Upload for MRO</h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="mroCsv" className="text-emerald-50">Upload Products CSV/Excel</Label>
                  <Input
                    id="mroCsv"
                    name="mroCsv"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleMroUpload}
                    required
                    className="bg-white/10 border-white/20 text-white file:text-emerald-900 file:bg-emerald-100 file:border-0 hover:file:bg-emerald-200 file:rounded-md cursor-pointer"
                  />
                  <p className="text-xs text-emerald-100/70 mt-1">Download our template to ensure correct column mapping.</p>
                </div>

                {mroMappingPreview && (
                  <div className="p-4 bg-emerald-900/40 border border-emerald-500/30 rounded-lg text-sm text-emerald-100 animate-in zoom-in-95 duration-200">
                    <span className="font-semibold block mb-1 text-emerald-400">Mapping Preview Successful:</span>
                    {mroMappingPreview}
                  </div>
                )}
              </div>
            </div>
          )}

          {categoryType === 'SEEDS_FERTILIZERS' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="h3-bold border-b border-white/10 pb-3">Seeds & Fertilizers Compliance</h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="batchMfgExpiry" className="text-emerald-50">Batch, Manufacturing & Expiry Info Format</Label>
                  <Input id="batchMfgExpiry" name="batchMfgExpiry" placeholder="e.g. Printed on packaging, Valid for 2 years" required className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 focus-visible:ring-emerald-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseUpload" className="text-emerald-50">Trade/Storage License Upload (If applicable)</Label>
                  <Input id="licenseUpload" name="licenseUpload" type="file" accept=".pdf,image/*" className="bg-white/10 border-white/20 text-white file:text-emerald-900 file:bg-emerald-100 file:border-0 hover:file:bg-emerald-200 file:rounded-md cursor-pointer" />
                </div>
                <div className="flex items-start gap-3 mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <input
                    type="checkbox"
                    id="sellerDeclaration"
                    name="sellerDeclaration"
                    className="mt-1 w-5 h-5 text-emerald-600 border-white/30 rounded focus:ring-emerald-500 bg-black/20"
                    required
                  />
                  <Label htmlFor="sellerDeclaration" className="font-medium text-sm leading-relaxed text-emerald-50 cursor-pointer">
                    I declare that all products sold under this category comply with the Insecticides Act, 1968, and the Fertilizer (Control) Order, 1985.
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button type="submit" className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all active:scale-95" disabled={loading || (categoryType === 'MRO' && !mroMappingPreview)}>
            {loading ? 'Submitting...' : 'Submit Category Approval & Go to Dashboard'}
          </Button>
        </div>
      </form>
    </div>
  )
}
