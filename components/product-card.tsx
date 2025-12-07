"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatefulButton } from "@/components/ui/stateful-button"
import { ChatDialog } from "@/components/chat-dialog"

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

export function ProductCard({ product }: { product: LoanProduct }) {
  const [chatOpen, setChatOpen] = useState(false)

  // Get emoji/icon for loan product based on name or type
  const getLoanIcon = () => {
    const name = product.product_name.toLowerCase()
    const type = product.loan_type?.toLowerCase() || ""
    
    // Check product name first
    if (name.includes("home") || name.includes("mortgage") || name.includes("house")) {
      return "🏠"
    }
    if (name.includes("auto") || name.includes("car") || name.includes("vehicle")) {
      return "🚗"
    }
    if (name.includes("personal")) {
      return "💼"
    }
    if (name.includes("student") || name.includes("education")) {
      return "🎓"
    }
    if (name.includes("business") || name.includes("commercial")) {
      return "🏢"
    }
    if (name.includes("medical") || name.includes("health")) {
      return "⚕️"
    }
    if (name.includes("debt") || name.includes("consolidation")) {
      return "💳"
    }
    
    // Check loan type if name doesn't match
    if (type.includes("home")) return "🏠"
    if (type.includes("auto")) return "🚗"
    if (type.includes("personal")) return "💼"
    if (type.includes("student")) return "🎓"
    if (type.includes("business")) return "🏢"
    
    // Default icon
    return "💰"
  }

  // Color palette for feature badges
  const getFeatureColor = (index: number) => {
    const colors = [
      { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
      { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
      { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
      { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
      { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-300", border: "border-pink-200 dark:border-pink-800" },
      { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300", border: "border-cyan-200 dark:border-cyan-800" },
      { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800" },
      { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
    ]
    return colors[index % colors.length]
  }

  return (
    <>
    <Card className="hover:shadow-md transition-all duration-200 border border-slate-200 dark:border-slate-800">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="text-2xl">{getLoanIcon()}</span>
              {product.product_name}
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">{product.bank_name}</CardDescription>
          </div>
          <Badge className="bg-slate-900 dark:bg-slate-800 text-white ml-2 px-3 py-1 font-semibold">
            {product.apr.toFixed(2)}% APR
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {product.description && (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{product.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Loan Amount</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              ${(product.loan_amount_min / 1000).toFixed(0)}k - ${(product.loan_amount_max / 1000).toFixed(0)}k
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Processing Time</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{product.processing_time || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Min Credit Score</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{product.min_credit_score}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Min Income</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">${(product.min_income / 1000).toFixed(0)}k</p>
          </div>
        </div>

        {product.features && product.features.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {product.features.map((feature, idx) => {
                const color = getFeatureColor(idx)
                return (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className={`text-xs font-medium ${color.bg} ${color.text} border ${color.border}`}
                  >
                    {feature}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        <div className="relative z-20">
          <StatefulButton
            onClick={() => setChatOpen(true)}
            className="w-full mt-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700"
          >
            Ask About Product
          </StatefulButton>
        </div>
      </CardContent>
    </Card>
    <ChatDialog
      open={chatOpen}
      onOpenChange={setChatOpen}
      product={product}
    />
    </>
  )
}
