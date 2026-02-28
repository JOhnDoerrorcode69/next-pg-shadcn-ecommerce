'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FaBoxOpen,
  FaClipboardList,
  FaDollarSign,
  FaPlus,
  FaEye,
  FaExclamationTriangle
} from 'react-icons/fa'
import { cn } from '@/lib/utils'

// Mock Data for Dashboard
const stats = [
  {
    label: 'Total Products',
    value: '24',
    icon: FaBoxOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    label: 'Active Orders',
    value: '12',
    icon: FaClipboardList,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    label: 'Revenue',
    value: '₹45,200',
    icon: FaDollarSign,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
]

const recentOrders = [
  {
    id: 'ORD-001',
    product: 'Organic Fertilizer 5kg',
    customer: 'Rahul Kumar',
    date: '2024-05-10',
    amount: '₹450',
    status: 'Pending',
  },
  {
    id: 'ORD-002',
    product: 'Pesticide Sprayer',
    customer: 'Amit Singh',
    date: '2024-05-09',
    amount: '₹1,200',
    status: 'Shipped',
  },
  {
    id: 'ORD-003',
    product: 'Hybrid Tomato Seeds',
    customer: 'Sunita Devi',
    date: '2024-05-08',
    amount: '₹250',
    status: 'Delivered',
  },
]

type OnboardingStatus = {
  level1Completed: boolean
  level2Status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED'
  bankStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED'
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED'
  canCreateDraft: boolean
  canPublishLive: boolean
  canReceivePayouts: boolean
}

export default function SellerDashboard() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/seller/proxy/status')
        if (!res.ok) throw new Error('Failed to fetch status')
        const data = await res.json()
        setStatus(data)
      } catch (err) {
        console.warn('Fallback: Using mock status because backend is not ready')
        // Mock status with all false flags to demonstrate gating
        setStatus({
          level1Completed: false,
          level2Status: 'NOT_SUBMITTED',
          bankStatus: 'NOT_SUBMITTED',
          kycStatus: 'NOT_SUBMITTED',
          canCreateDraft: false,
          canPublishLive: false,
          canReceivePayouts: false
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  if (loading) {
    return <div className="text-white p-6">Loading dashboard data...</div>
  }

  return (
    <div className="space-y-8 text-white">

      {/* Onboarding Alert Banner */}
      {!status?.canCreateDraft && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-4 shadow-sm backdrop-blur-md">
          <FaExclamationTriangle className="text-yellow-400 text-xl mt-1 shrink-0" />
          <div className="flex-1">
            <h3 className="text-yellow-300 font-bold text-lg">Complete Your Onboarding</h3>
            <p className="text-yellow-100/80 mt-1">
              You need to complete your seller onboarding before you can start creating products.
            </p>
          </div>
          <Link
            href="/seller/onboarding"
            className="shrink-0 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold py-2 px-4 rounded transition-colors"
          >
            Start Onboarding
          </Link>
        </div>
      )}

      {status?.canCreateDraft && !status?.canPublishLive && (
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 flex items-start gap-4 shadow-sm backdrop-blur-md">
          <FaExclamationTriangle className="text-blue-400 text-xl mt-1 shrink-0" />
          <div className="flex-1">
            <h3 className="text-blue-300 font-bold text-lg">Onboarding Under Review</h3>
            <p className="text-blue-100/80 mt-1">
              You can create draft products, but publishing them is restricted until your documents are approved.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-white/70">Overview of your store performance</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/seller/products"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/10"
          >
            <FaEye /> View Products
          </Link>

          {status?.canCreateDraft ? (
            <Link
              href="/seller/products/add"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4ade80] to-[#2E7D32] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
            >
              <FaPlus /> Add Product
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 rounded-full bg-gray-500/50 px-6 py-2.5 text-sm font-semibold text-white/50 cursor-not-allowed border border-gray-400/20"
              title="Complete onboarding to add products"
            >
              <FaPlus /> Add Product (Locked)
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", !status?.canCreateDraft && "opacity-50 pointer-events-none")}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-[40px] shadow-[0_8px_30px_0_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={cn('rounded-full p-3', stat.bg)}>
                <stat.icon className={cn('text-xl', stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className={cn("rounded-2xl border border-white/20 bg-white/10 backdrop-blur-[40px] shadow-[0_8px_30px_0_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.1)]", !status?.canReceivePayouts && "opacity-50 pointer-events-none")}>
        <div className="border-b border-white/10 p-6 flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Orders</h3>
          {!status?.canReceivePayouts && (
            <span className="text-xs font-semibold bg-red-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/30">
              Payouts Locked
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.product}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 text-white/70">{order.date}</td>
                  <td className="px-6 py-4 font-bold">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        order.status === 'Delivered'
                          ? 'bg-green-400/20 text-green-300'
                          : order.status === 'Shipped'
                          ? 'bg-blue-400/20 text-blue-300'
                          : 'bg-yellow-400/20 text-yellow-300'
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
