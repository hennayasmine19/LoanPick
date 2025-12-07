"use client"
import useSWR from "swr"
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function PersonalizedProducts() {
  const { data: products, isLoading, error } = useSWR<LoanProduct[]>("/api/products/personalized", fetcher)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">Failed to load personalized products. Please try again.</div>
    )
  }

  return (
    <div className="space-y-4">
      {products && products.length > 0 ? (
        products.map((product) => <ProductCard key={product.id} product={product} />)
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No products match your profile. Update your information to see recommendations.
        </div>
      )}
    </div>
  )
}
