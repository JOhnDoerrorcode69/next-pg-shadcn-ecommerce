'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useFormState, useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/lib/actions/user.actions'
import { signUpDefaultValues } from '@/lib/constants'

export default function SignUpForm() {
  const [data, action] = useFormState(signUp, {
    success: false,
    message: '',
  })
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/'

  const SignUpButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button
        disabled={pending}
        className="w-full bg-[#168a46] hover:bg-[#12723a] text-white font-bold rounded-full py-6 mt-4 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        variant="default"
      >
        {pending ? 'Creating Account...' : 'Sign Up'}
      </Button>
    )
  }

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-800 font-semibold ml-1">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              required
              type="text"
              defaultValue={signUpDefaultValues.firstName}
              className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-[#168a46] text-gray-900 placeholder:text-gray-500 rounded-2xl px-4 py-6 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-800 font-semibold ml-1">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              required
              type="text"
              defaultValue={signUpDefaultValues.lastName}
              className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-[#168a46] text-gray-900 placeholder:text-gray-500 rounded-2xl px-4 py-6 shadow-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-800 font-semibold ml-1">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="john@example.com"
            required
            type="email"
            defaultValue={signUpDefaultValues.email}
             className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-[#168a46] text-gray-900 placeholder:text-gray-500 rounded-2xl px-5 py-6 shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-800 font-semibold ml-1">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            defaultValue={signUpDefaultValues.password}
             className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-[#168a46] text-gray-900 placeholder:text-gray-500 rounded-2xl px-5 py-6 shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-800 font-semibold ml-1">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            required
            type="password"
            defaultValue={signUpDefaultValues.confirmPassword}
             className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-[#168a46] text-gray-900 placeholder:text-gray-500 rounded-2xl px-5 py-6 shadow-sm"
          />
        </div>

        <div className="pt-2">
          <SignUpButton />
        </div>

        {!data.success && (
          <div className="text-center text-red-600 bg-red-100/80 p-3 rounded-xl text-sm font-medium">
            {data.message}
          </div>
        )}
        <div className="text-sm text-center text-gray-800 font-medium">
          Already have an account?{' '}
          <Link
            target="_self"
            className="font-bold text-[#168a46] hover:underline"
            href={`/sign-in?callbackUrl=${callbackUrl}`}
          >
            Sign In
          </Link>
        </div>
      </div>
    </form>
  )
}
