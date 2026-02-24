import { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { APP_NAME } from '@/lib/constants'

import SignUpForm from './signup-form'

export const metadata: Metadata = {
  title: `Sign Up - ${APP_NAME}`,
}

export default async function SignUp({
  searchParams: { callbackUrl },
}: {
  searchParams: {
    callbackUrl: string
  }
}) {
  const session = await auth()
  if (session) {
    return redirect(callbackUrl || '/')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/farm-bg.jpg')] bg-cover bg-center bg-no-repeat p-6">
      {/* Phone Glass Container */}
      <div className="w-[380px] min-h-[750px] max-h-[90vh] border-[8px] border-white/20 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col backdrop-blur-md bg-white/20">

        {/* Notch/Top Bar */}
        <div className="absolute left-1/2 top-4 z-10 h-6 w-32 -translate-x-1/2 rounded-full bg-black/10 backdrop-blur-sm" />

        {/* Content Area */}
        <div className="flex-1 flex flex-col px-8 pt-16 pb-10 overflow-y-auto no-scrollbar scroll-smooth">

          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6">
             <div className="bg-white p-3 rounded-full shadow-lg mb-4">
               <Image
                src="/logo.png"
                alt={`${APP_NAME} logo`}
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
            <p className="text-gray-700 text-sm mt-1 font-medium text-center">
              Join us to start your journey
            </p>
          </div>

          {/* Form Section */}
          <div className="w-full space-y-4 pb-8">
            <SignUpForm />
          </div>

        </div>

        {/* Bottom Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full" />
      </div>
    </div>
  )
}
