"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { StatefulButton } from "@/components/ui/stateful-button"
import { useState } from "react"
import { ChatDialog } from "./chat-dialog"

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

interface EnhancedProductCardProps {
  product: LoanProduct
  isBestMatch?: boolean
}

export function EnhancedProductCard({ product, isBestMatch = false }: EnhancedProductCardProps) {
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

  // Color palette for badges
  const getBadgeColor = (badgeText: string, index: number) => {
    const text = badgeText.toLowerCase()
    
    // Color based on badge content
    if (text.includes("apr") || text.includes("low apr") || text.includes("competitive apr")) {
      return { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" }
    }
    if (text.includes("salary") || text.includes("income") || text.includes("eligible")) {
      return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" }
    }
    if (text.includes("credit") || text.includes("score")) {
      return { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" }
    }
    if (text.includes("tenure") || text.includes("flexible")) {
      return { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" }
    }
    if (text.includes("prepayment") || text.includes("no prepayment")) {
      return { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-300", border: "border-pink-200 dark:border-pink-800" }
    }
    if (text.includes("doc") || text.includes("document")) {
      return { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300", border: "border-cyan-200 dark:border-cyan-800" }
    }
    if (text.includes("disbursal") || text.includes("fast")) {
      return { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800" }
    }
    if (text.includes("limited") || text.includes("offer")) {
      return { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" }
    }
    if (text.includes("best match")) {
      return { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-200 dark:border-yellow-800" }
    }
    
    // Default color based on index
    const colors = [
      { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
      { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
      { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
      { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
      { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-300", border: "border-pink-200 dark:border-pink-800" },
      { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300", border: "border-cyan-200 dark:border-cyan-800" },
    ]
    return colors[index % colors.length]
  }

  // Generate dynamic badges based on product attributes
  const getBadges = (): string[] => {
    const badges: string[] = []

    // APR-based badges
    if (product.apr < 6) {
      badges.push("Low APR")
    } else if (product.apr < 8) {
      badges.push("Competitive APR")
    }

    // Income-based badge
    if (product.min_income) {
      badges.push(`Salary > $${(product.min_income / 1000).toFixed(0)}k Eligible`)
    }

    // Credit score badge
    if (product.min_credit_score) {
      badges.push(`Credit Score ≥ ${product.min_credit_score}`)
    }

    // Processing time badge
    if (product.processing_time && product.processing_time.includes("1-2") || product.processing_time?.includes("Fast")) {
      badges.push("Fast Disbursal")
    }

    // Tenure badge
    if (product.tenure_min_months && product.tenure_max_months) {
      if (product.tenure_max_months >= 60) {
        badges.push("Flexible Tenure")
      }
    }

    // Features-based badges
    if (product.features) {
      if (product.features.some(f => f.toLowerCase().includes("prepayment") || f.toLowerCase().includes("early"))) {
        badges.push("No Prepayment")
      }
      if (product.features.some(f => f.toLowerCase().includes("doc") || f.toLowerCase().includes("document"))) {
        badges.push("Low Docs")
      }
    }

    // Limited time offer (random for demo, you can add a field for this)
    if (Math.random() > 0.7) {
      badges.push("Limited-Time Offer")
    }

    // Ensure at least 3 badges
    if (badges.length < 3) {
      if (!badges.includes("Low APR") && product.apr < 10) {
        badges.push("Low APR")
      }
      if (!badges.some(b => b.includes("Tenure"))) {
        badges.push("Flexible Tenure")
      }
      if (badges.length < 3) {
        badges.push("Best Match")
      }
    }

    return badges.slice(0, 6) // Max 6 badges
  }

  const badges = getBadges()

  // Color schemes for different products - using index-based selection
  const colorIndex = parseInt(product.id.slice(-1)) % 5
  
  // Get card classes - professional, subtle styling
  const getCardClasses = () => {
    if (isBestMatch) {
      return "group hover:shadow-lg transition-all duration-200 border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
    }
    return "group hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
  }

  // Get badge/button classes - professional styling
  const getBadgeClasses = () => {
    if (isBestMatch) {
      return "bg-slate-900 dark:bg-slate-800 text-white"
    }
    return "bg-slate-800 dark:bg-slate-700 text-white"
  }

  return (
    <>
      <Card className={getCardClasses()}>
        {isBestMatch && (
          <div className="bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 text-center text-sm font-semibold">
            ⭐ Best Match
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold mb-1 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="text-2xl">{getLoanIcon()}</span>
                {product.product_name}
              </CardTitle>
              <CardDescription className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span>{product.bank_name}</span>
                {product.loan_type && (
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {product.loan_type}
                  </span>
                )}
              </CardDescription>
            </div>
            <Badge className={`${getBadgeClasses()} ml-2 px-3 py-1 text-sm font-semibold`}>
              {product.apr.toFixed(2)}% APR
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {product.summary && (
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {product.summary}
            </p>
          )}

          {/* Dynamic Badges */}
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, idx) => {
              const color = getBadgeColor(badge, idx)
              return (
                <Badge
                  key={idx}
                  variant="secondary"
                  className={`text-xs font-medium px-2 py-0.5 ${color.bg} ${color.text} border ${color.border}`}
                >
                  {badge}
                </Badge>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Loan Amount</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                ${(product.loan_amount_min / 1000).toFixed(0)}k - ${(product.loan_amount_max / 1000).toFixed(0)}k
              </p>
            </div>
            {product.tenure_min_months && product.tenure_max_months && (
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Tenure</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {product.tenure_min_months} - {product.tenure_max_months} months
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Min Credit Score</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{product.min_credit_score}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Min Income</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">${(product.min_income / 1000).toFixed(0)}k</p>
            </div>
          </div>

          {product.processing_time && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Processing Time</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{product.processing_time}</p>
            </div>
          )}

          <div className="relative z-20">
            {isBestMatch ? (
              <StatefulButton
                onClick={() => setChatOpen(true)}
                className="w-full mt-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700"
              >
                Ask About Product
              </StatefulButton>
            ) : (
              <InteractiveHoverButton
                onClick={() => setChatOpen(true)}
                className="w-full mt-4 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Ask About Product
              </InteractiveHoverButton>
            )}
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

