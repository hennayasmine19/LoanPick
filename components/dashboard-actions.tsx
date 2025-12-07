"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export function DashboardActions() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/profile">
        <button className="inline-flex items-center gap-2 px-4 py-2 text-black dark:text-white backdrop-blur-sm border border-black dark:border-white rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/[0.2] dark:bg-white/[0.1] text-sm transition duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </button>
      </Link>
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 backdrop-blur-sm border border-red-600 dark:border-red-400 rounded-md hover:shadow-[0px_0px_4px_4px_rgba(239,68,68,0.2)] dark:hover:shadow-[0px_0px_4px_4px_rgba(248,113,113,0.2)] bg-white/[0.2] dark:bg-white/[0.1] text-sm transition duration-200 hover:text-red-700 dark:hover:text-red-300"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  )
}

