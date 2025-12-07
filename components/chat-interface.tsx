"use client"

import type React from "react"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"
import { Skeleton } from "@/components/ui/skeleton"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChatInterfaceRef {
  setInput: (value: string) => void
}

// Same suggestions as in ChatSuggestions component
const placeholders = [
  "What's the difference between fixed and variable APR?",
  "How do I improve my credit score?",
  "What should I look for in a loan product?",
  "How long does loan approval usually take?",
  "Can I refinance an existing loan?",
  "What fees should I watch out for?",
]

export const ChatInterface = forwardRef<ChatInterfaceRef>((props, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your loan advisor. Ask me anything about loan products, rates, or financial planning.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    setInput: (value: string) => {
      setInput(value)
    },
  }))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
        body: JSON.stringify({ message: input }),
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
    <Card className="flex flex-col h-[600px] border border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          Loan Advisor Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-slate-900 dark:bg-slate-800 text-white rounded-br-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-700"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className={`text-xs mt-2 block ${message.role === "user" ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-lg rounded-bl-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            value={input}
            setValue={setInput}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
})

ChatInterface.displayName = "ChatInterface"
