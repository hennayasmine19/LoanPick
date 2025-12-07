"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
  "What's the difference between fixed and variable APR?",
  "How do I improve my credit score?",
  "What should I look for in a loan product?",
  "How long does loan approval usually take?",
  "Can I refinance an existing loan?",
  "What fees should I watch out for?",
]

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm sticky top-4">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Suggested Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-2">
        {suggestions.map((suggestion, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="w-full text-left justify-start h-auto py-3 px-4 text-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <span className="text-slate-700 dark:text-slate-300">{suggestion}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
