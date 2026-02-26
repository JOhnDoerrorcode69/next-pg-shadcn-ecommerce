import { APP_NAME } from '@/lib/constants'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="mt-auto w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="glass-morphic mx-auto max-w-[1400px] rounded-3xl p-8 text-white">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold italic">{APP_NAME}</h3>
            <p className="text-sm text-white/70">
              Empowering farmers with modern technology and quality supplies.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/all" className="hover:text-white">All Products</Link></li>
              <li><Link href="/become-seller" className="hover:text-white">Become a Seller</Link></li>
              <li><Link href="/cart" className="hover:text-white">My Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/all?category=Machinery" className="hover:text-white">Agri Machinery</Link></li>
              <li><Link href="/all?category=MRO" className="hover:text-white">MRO & Tools</Link></li>
              <li><Link href="/all?category=Seeds" className="hover:text-white">Seeds & Fertilizers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white/80 hover:-translate-y-1 transition-transform">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white/80 hover:-translate-y-1 transition-transform">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white/80 hover:-translate-y-1 transition-transform">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white/80 hover:-translate-y-1 transition-transform">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
