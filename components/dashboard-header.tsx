"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

export function DashboardHeader() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Loan Picks</h1>
          <p className="text-sm text-muted-foreground">Find your perfect loan</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="outline">Browse All</Button>
          </Link>
          <Link href="/chat">
            <Button variant="outline">Chat Support</Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost">{user?.email}</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
