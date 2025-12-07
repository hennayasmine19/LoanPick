"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import { Skeleton } from "@/components/ui/skeleton"

interface LoanProduct {
  id: string
  bank_name: string
  product_name: string
  description: string
  apr: number
  min_apr?: number
  max_apr?: number
  loan_amount_min: number
  loan_amount_max: number
  min_credit_score: number
  min_income: number
  features?: string[]
  processing_time?: string
}

interface FiltersProps {
  bank?: string
  minAPR?: string
  maxAPR?: string
  minIncome?: string
  minCreditScore?: string
}

interface ProductsListProps {
  filters: FiltersProps
}

export function ProductsList({ filters }: ProductsListProps) {
  const [products, setProducts] = useState<LoanProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    let isMounted = true
    
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const params = new URLSearchParams()
        if (filters.bank && filters.bank !== "all") params.append("bank", filters.bank)
        if (filters.minAPR) params.append("minAPR", filters.minAPR)
        if (filters.maxAPR) params.append("maxAPR", filters.maxAPR)
        if (filters.minIncome) params.append("minIncome", filters.minIncome)
        if (filters.minCreditScore) params.append("minCreditScore", filters.minCreditScore)
        
        const query = params.toString()
        const url = query ? `/api/products?${query}` : "/api/products"
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)
        
        const res = await fetch(url, { 
          signal: controller.signal,
          cache: 'no-store' // Ensure fresh data
        })
        clearTimeout(timeoutId)
        
        if (!isMounted) return
        
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/auth/login"
            return
          }
          throw new Error(`Failed to fetch: ${res.status}`)
        }
        
        const data = await res.json()
        if (isMounted) {
          setProducts(data || [])
        }
      } catch (err: any) {
        if (!isMounted) return
        
        if (err.name !== "AbortError") {
          console.error("Failed to fetch products:", err)
          setError(err)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // Fetch immediately but don't block page rendering
    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [filters])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/20 mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">Failed to load products</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">Please try again later</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products && products.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Found <span className="font-semibold text-slate-900 dark:text-slate-100">{products.length}</span> {products.length === 1 ? "product" : "products"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">No products found</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
