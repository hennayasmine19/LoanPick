"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { EnhancedProductCard } from "./enhanced-product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { CardSpotlight } from "@/components/ui/card-spotlight"

interface LoanProduct {
  id: string
  bank_name: string
  product_name: string
  description?: string
  summary?: string
  apr: number
  min_apr?: number
  max_apr?: number
  loan_amount_min: number
  loan_amount_max: number
  min_credit_score: number
  min_income: number
  loan_type?: string
  tenure_min_months?: number
  tenure_max_months?: number
  features?: string[]
  processing_time?: string
}

interface ProductsResponse {
  bestMatch: LoanProduct | null
  top5: LoanProduct[]
}

export function DashboardProducts() {
  const [bestMatch, setBestMatch] = useState<LoanProduct | null>(null)
  const [top5Products, setTop5Products] = useState<LoanProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/top")
        if (response.ok) {
          const data: ProductsResponse = await response.json()
          setBestMatch(data.bestMatch)
          setTop5Products(data.top5 || [])
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-12">
        {/* Best Match Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <Skeleton className="h-10 w-64" />
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
        {/* Top 5 Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!bestMatch && top5Products.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No products available at the moment.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-12">
      {/* Best Match Card */}
      {bestMatch && (
        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-lg md:text-xl">⭐</span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Best Match for You
              </h2>
            </div>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <CardSpotlight className="bg-transparent border-0 p-0">
              <EnhancedProductCard product={bestMatch} isBestMatch={true} />
            </CardSpotlight>
          </div>
        </section>
      )}

      {/* Top 5 Products */}
      {top5Products.length > 0 && (
        <section className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                Top Loan Products
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                Explore our curated selection of top-rated loan products
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-black dark:text-white backdrop-blur-sm border border-black dark:border-white rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/[0.2] dark:bg-white/[0.1] transition duration-200"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {top5Products.map((product) => (
              <EnhancedProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center sm:hidden pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-black dark:text-white backdrop-blur-sm border border-black dark:border-white rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/[0.2] dark:bg-white/[0.1] transition duration-200"
            >
              View all products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

