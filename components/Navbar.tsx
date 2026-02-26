'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { APP_NAME } from '@/lib/constants'

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/all?q=${searchTerm.trim()}`)
    }
  }

  return (
    <nav className="fixed top-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8">
      <div className="glass-morphic mx-auto flex h-16 max-w-[1400px] items-center justify-between rounded-full px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white sm:text-2xl italic">
            {APP_NAME}
          </span>
        </Link>

        {/* Search Bar - Hidden on mobile, visible on lg */}
        <form
          onSubmit={handleSearch}
          className="hidden max-w-md flex-1 px-8 lg:block"
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              className="h-10 w-full rounded-full border-none bg-white/10 pl-10 text-white placeholder:text-white/60 focus-visible:ring-1 focus-visible:ring-white/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          {!session && (
            <Link href="/become-seller">
              <Button
                variant="ghost"
                className="rounded-full text-white hover:bg-white/10 hover:text-white"
              >
                Become a Seller
              </Button>
            </Link>
          )}

          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 rounded-full text-white hover:bg-white/10 hover:text-white"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline-block">
                    {session.user?.name || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl border-white/20 bg-black/80 text-white backdrop-blur-xl"
              >
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white">
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white">
                  <Link href="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:bg-white/10 focus:text-white"
                  onSelect={(e) => {
                    e.preventDefault()
                    signOut({ callbackUrl: '/' })
                  }}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign-in">
              <Button className="rounded-full bg-white text-[#1b431e] hover:bg-gray-100 hover:-translate-y-1 transition-transform">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="rounded-full p-2 text-white hover:bg-white/10 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="glass-morphic mt-2 rounded-2xl p-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                className="h-10 w-full rounded-full border-none bg-white/10 pl-10 text-white placeholder:text-white/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
            </div>
          </form>
          <div className="flex flex-col gap-2">
            {!session && (
              <Link
                href="/become-seller"
                className="rounded-lg px-4 py-2 text-white hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Become a Seller
              </Link>
            )}
            <Link
              href="/cart"
              className="rounded-lg px-4 py-2 text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart
            </Link>
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-lg px-4 py-2 text-white hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-left rounded-lg px-4 py-2 text-white hover:bg-white/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-lg px-4 py-2 text-white hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
