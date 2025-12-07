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
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const chatInputRef = useRef<{ setInput: (value: string) => void }>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
        } else {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Error initializing Supabase:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleSuggestionClick = (suggestion: string) => {
    if (chatInputRef.current) {
      chatInputRef.current.setInput(suggestion)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Loan Advisor Chat
                </h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                  Get instant answers about loan products and financial planning
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

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 order-1 w-full">
              <ChatInterface ref={chatInputRef} />
            </div>
            <aside className="lg:col-span-1 order-2 w-full">
              <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
