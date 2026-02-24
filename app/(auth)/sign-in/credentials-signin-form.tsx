'use client'
import { useSearchParams } from 'next/navigation'
import { useFormState, useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import { signInDefaultValues } from '@/lib/constants'
import Link from 'next/link'

export default function CredentialsSignInForm() {
  const [data, action] = useFormState(signInWithCredentials, {
    message: '',
    success: false,
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/'

  const SignInButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button
        disabled={pending}
        className="w-full bg-[#168a46] hover:bg-[#12723a] text-white font-bold rounded-full py-6 mt-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        variant="default"
      >
        {pending ? 'Submitting...' : 'Sign In'}
      </Button>
    )
  }

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-800 font-semibold ml-1">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            required
            type="email"
            defaultValue={signInDefaultValues.email}
            className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-[#168a46] text-gray-900 placeholder:text-gray-500 rounded-2xl px-5 py-6 shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-800 font-semibold ml-1">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            defaultValue={signInDefaultValues.password}
            className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-[#168a46] text-gray-900 placeholder:text-gray-500 rounded-2xl px-5 py-6 shadow-sm"
          />
        </div>

        <div className="pt-2">
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-red-600 bg-red-100/80 p-3 rounded-xl text-sm font-medium">
            {data.message}
          </div>
        )}
        {!data && (
          <div className="text-center text-red-600 bg-red-100/80 p-3 rounded-xl text-sm font-medium">
            Unknown error happened.{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-red-700 underline"
              onClick={() => window.location.reload()}
            >
              Please reload
            </Button>
          </div>
        )}

        <div className="text-sm text-center text-gray-800 font-medium">
          Don&apos;t have an account?{' '}
          <Link
            target="_self"
            className="font-bold text-[#168a46] hover:underline"
            href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  )
}
