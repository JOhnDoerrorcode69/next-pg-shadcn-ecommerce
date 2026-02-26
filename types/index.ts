import { carts, orderItems, orders, products, reviews } from '@/db/schema'
import {
  cartItemSchema,
  paymentResultSchema,
  shippingAddressSchema,
} from '@/lib/validator'
import { InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'

// PRODUCTS
// Updated to match Spring Boot backend contract
export interface Product {
  id: string
  name: string
  slug: string
  category: string
  images: string[]
  brand: string
  description: string
  stock: number
  price: string
  rating: string
  numReviews: number
  isFeatured: boolean
  banner: string | null
  createdAt: Date
  // New fields from Spring Boot contract
  mrp?: string
  discount?: string
  isFlashDeal?: boolean
  imageUrl?: string // Spring Boot often sends a single imageUrl, we'll map it to images[0] if needed
}

export type Review = InferSelectModel<typeof reviews> & {
  user?: { name: string }
}

// CART
export type Cart = InferSelectModel<typeof carts>
export type CartItem = z.infer<typeof cartItemSchema>

export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type PaymentResult = z.infer<typeof paymentResultSchema>

// ORDERS

export type Order = InferSelectModel<typeof orders> & {
  orderItems: OrderItem[]
  user: { name: string | null; email: string }
}
export type OrderItem = InferSelectModel<typeof orderItems>
