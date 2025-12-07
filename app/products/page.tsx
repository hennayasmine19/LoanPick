"use client"

import { useState } from "react"
import Link from "next/link"
import { ProductFilters } from "@/components/product-filters"
import { ProductsList } from "@/components/products-list"
import { ShimmerButton } from "@/components/ui/shimmer-button"

export default function ProductsPage() {
  const [filters, setFilters] = useState({})

  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  All Loan Products
                </h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                  Browse our entire collection of loan products and find the best match
                </p>
              </div>
              <Link href="/dashboard" className="md:ml-4">
                <ShimmerButton
                  background="rgba(15, 23, 42, 1)"
                  shimmerColor="#ffffff"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm w-full md:w-auto justify-center md:justify-start"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </ShimmerButton>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">
            <aside className="lg:col-span-1 order-1">
              <ProductFilters onFilterChange={setFilters} />
            </aside>
            <div className="lg:col-span-3 order-2">
              <ProductsList filters={filters} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
