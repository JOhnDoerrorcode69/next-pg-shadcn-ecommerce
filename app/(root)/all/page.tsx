'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Search } from 'lucide-react'
import { demoProducts } from '@/lib/fallback-data'
import { Product } from '@/types'

// Fetch logic for products (mirrors Home page)
async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:8080/api/products', {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('Failed to fetch from Spring Boot')
    const data = await res.json()

    if (Array.isArray(data)) {
      return data
    }

    if (Array.isArray(data?.content)) {
      return data.content
    }

    throw new Error('Unexpected products response format')
  } catch (error) {
    console.warn('Backend unavailable, using demo data', error)
    return demoProducts
  }
}

const CATEGORIES = [
  'All',
  'Machinery',
  'MRO',
  'Seeds',
  'Fertilizers',
]

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const searchParams = useSearchParams()
  const searchQuery = searchParams ? searchParams.get('q') : null
  const categoryParam = searchParams ? searchParams.get('category') : null

  useEffect(() => {
    fetchProducts().then(setProducts)
    if (categoryParam) {
      setActiveCategory(categoryParam)
    }
  }, [categoryParam])

  // Filter Logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === 'All' ||
      product.category.toLowerCase() === activeCategory.toLowerCase()

    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            All Products
          </h1>
          <p className="text-white/60">
            Browse our premium collection of agricultural supplies.
          </p>
        </div>

        {/* Pill-shaped Category Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-white text-[#1b431e] shadow-lg scale-105'
                  : 'glass-morphic text-white hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 bg-white/10 backdrop-blur-md rounded-3xl text-white shadow-xl hover:-translate-y-2 transition-transform duration-300 glass-morphic"
            >
              {/* Image Area */}
              <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                {product.isFlashDeal && (
                  <Badge className="absolute left-3 top-3 z-10 bg-red-500/90 text-white backdrop-blur-sm border-0 shadow-lg">
                    Flash Deal
                  </Badge>
                )}
                {product.discount && (
                  <Badge className="absolute right-3 top-3 z-10 bg-[#f5a623] text-black font-bold backdrop-blur-sm border-0 shadow-lg">
                    {product.discount} OFF
                  </Badge>
                )}

                <Image
                  src={product.imageUrl || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Hover Overlay with Action Button */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white text-black hover:bg-gray-200 shadow-xl"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content Area */}
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full shrink-0">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{product.rating}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-white/60 uppercase tracking-wider font-medium">
                    {product.brand}
                  </p>
                  <p className="text-sm text-white/80 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 flex items-baseline gap-2 border-t border-white/10 mt-2">
                  <span className="text-2xl font-bold text-[#4ade80]">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  {product.mrp && (
                    <span className="text-sm text-white/40 line-through decoration-white/40">
                      ₹{Number(product.mrp).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center glass-morphic rounded-3xl mx-4">
          <div className="bg-white/10 p-6 rounded-full mb-4">
            <Search className="h-10 w-10 text-white/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No products found
          </h3>
          <p className="text-white/60 max-w-md mx-auto">
            We could not find any products matching your filters. Try adjusting your search or category.
          </p>
          <Button
            onClick={() => {
              setActiveCategory('All')
              // Ideally clear search params too, but simple reset for now
            }}
            variant="outline"
            className="mt-6 border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
