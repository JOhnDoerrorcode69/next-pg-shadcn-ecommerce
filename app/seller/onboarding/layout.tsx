import React from 'react'

export default function SellerOnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col text-white w-full">
      <header className="glass-morphic border-b border-white/20 py-4 px-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Become a Seller</h1>
          <nav className="text-sm text-emerald-100 font-medium">
            Secure Onboarding Portal
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 z-10 relative">
        <div className="glass-morphic rounded-xl shadow-sm border border-white/20 min-h-[500px] text-white overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
