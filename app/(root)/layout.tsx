import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      className="flex min-h-screen flex-col text-white"
      style={{
        background: 'linear-gradient(135deg, #0a210c, #1b431e, #2E7D32)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {children}
      </main>
      <Footer />
    </div>
  )
}
