"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Send, X } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

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

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: LoanProduct
}

export function ChatDialog({ open, onOpenChange, product }: ChatDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm here to help you with ${product.product_name} from ${product.bank_name}. Ask me anything about this loan product!`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (open) {
      // Reset messages when dialog opens
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `Hello! I'm here to help you with ${product.product_name} from ${product.bank_name}. Ask me anything about this loan product!`,
          timestamp: new Date(),
        },
      ])
    }
  }, [open, product])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          productId: product.id, // Send product ID for context
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[700px] flex flex-col p-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-2 border-slate-200 dark:border-slate-800 shadow-2xl" showCloseButton={false}>
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white rounded-t-lg border-b-2 border-slate-700 dark:border-slate-700 relative">
          <DialogClose className="absolute top-4 right-4 text-white hover:text-slate-200 transition-colors rounded-full p-1.5 hover:bg-white/10">
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-3 pr-8">
            <div className="w-10 h-10 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <div>Ask About {product.product_name}</div>
              <DialogDescription className="text-sm text-slate-200 dark:text-slate-300 mt-1">
                {product.bank_name} • {product.apr}% APR
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 px-6 pt-6 pb-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
                      : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <span className={`text-xs mt-2 block ${
                    message.role === "user" 
                      ? "text-blue-100" 
                      : "text-slate-500 dark:text-slate-400"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="mt-auto pt-4 pb-6 px-6 border-t border-slate-200 dark:border-slate-800 w-full">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3 w-full">
              <div className="flex-1 min-w-0 [&>div]:p-0 [&>div]:w-full [&>div]:rounded-full">
                <Input
                  placeholder="Ask a question about this product..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-full px-5 py-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="icon"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 w-11 h-11 shrink-0 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

