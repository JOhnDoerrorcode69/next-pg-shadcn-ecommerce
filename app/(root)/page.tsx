'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { demoProducts, demoHeroImages } from '@/lib/fallback-data'
import { Product } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart, ArrowRight } from 'lucide-react'

// Fetch logic for products
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  // Fix type assertion for Autoplay plugin
  const [plugin] = useState(() => Autoplay({ delay: 4000, stopOnInteraction: true }))

  useEffect(() => {
    fetchProducts().then(setProducts)
  }, [])

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section: 5-Image Carousel */}
      <section className="relative w-full max-w-[1400px] mx-auto overflow-hidden rounded-3xl shadow-2xl glass-morphic">
        <Carousel
          plugins={[plugin]}
          className="w-full"
          onMouseEnter={plugin.stop}
          onMouseLeave={plugin.reset}
        >
          <CarouselContent>
            {demoHeroImages.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-10 left-10 max-w-xl text-white">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
                      {item.title}
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-white/90 drop-shadow-md mb-6">
                      Premium agricultural solutions for modern farming.
                    </p>
                    <Button
                      size="lg"
                      className="rounded-full bg-[#f5a623] hover:bg-[#d48c1a] text-black font-semibold px-8"
                    >
                      Explore Now
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/20 border-none hover:bg-white/40 text-white" />
          <CarouselNext className="right-4 bg-white/20 border-none hover:bg-white/40 text-white" />
        </Carousel>
      </section>

      {/* 2. Three Pillars Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
        {[
          {
            title: 'Agri Machinery',
            desc: 'High-performance tractors & equipment',
            img: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=2000&auto=format&fit=crop', // Replaced faulty URL
            link: '/all?category=Machinery',
          },
          {
            title: 'MRO & Tools',
            desc: 'Essential maintenance & repair kits',
            img: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1780&auto=format&fit=crop',
            link: '/all?category=MRO',
          },
          {
            title: 'Seeds & Fertilizers',
            desc: 'Premium inputs for maximum yield',
            img: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=1896&auto=format&fit=crop',
            link: '/all?category=Seeds',
          },
        ].map((pillar, idx) => (
          <Link
            href={pillar.link}
            key={idx}
            className="group relative h-[300px] overflow-hidden rounded-3xl glass-morphic shadow-lg hover:-translate-y-2 transition-transform duration-300"
          >
            <Image
              src={pillar.img}
              alt={pillar.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{pillar.title}</h3>
              <p className="text-white/80 flex items-center gap-2 group-hover:gap-4 transition-all">
                {pillar.desc} <ArrowRight className="h-4 w-4" />
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* 3. Featured Products */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Featured Products
          </h2>
          <Link
            href="/all"
            className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {products.slice(0, 4).map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 bg-white/10 backdrop-blur-md rounded-3xl text-white shadow-xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white/5">
                {product.isFlashDeal && (
                  <Badge className="absolute left-3 top-3 z-10 bg-red-500/90 text-white backdrop-blur-sm border-0">
                    Flash Deal
                  </Badge>
                )}
                <Image
                  src={product.imageUrl || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    size="icon"
                    className="rounded-full bg-white text-black hover:bg-gray-200 shadow-lg"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between text-sm text-white/60">
                  <span>{product.category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold leading-tight truncate">
                  {product.name}
                </h3>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-[#4ade80]">
                    ₹{product.price}
                  </span>
                  {product.mrp && (
                    <span className="text-sm text-white/50 line-through mb-1">
                      ₹{product.mrp}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-medium text-red-400 mb-1">
                      {product.discount} OFF
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
