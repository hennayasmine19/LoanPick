"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { ChatInterface } from "@/components/chat-interface"
import { ChatSuggestions } from "@/components/chat-suggestions"
import { createClient } from "@/lib/supabase/client"
import { ShimmerButton } from "@/components/ui/shimmer-button"

export default function ChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const chatInputRef = useRef<{ setInput: (value: string) => void }>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setIsAuthenticated(true)
      }
    }
    checkAuth()
  }, [supabase, router])

  const handleSuggestionClick = (suggestion: string) => {
    if (chatInputRef.current) {
      chatInputRef.current.setInput(suggestion)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Loan Advisor Chat
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Get instant answers about loan products and financial planning
                </p>
              </div>
              <Link href="/dashboard">
                <ShimmerButton
                  background="rgba(15, 23, 42, 1)"
                  shimmerColor="#ffffff"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </ShimmerButton>
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChatInterface ref={chatInputRef} />
            </div>
            <aside className="lg:col-span-1">
              <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
