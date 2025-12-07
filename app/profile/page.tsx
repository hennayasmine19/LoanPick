"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StarsBackground } from "@/components/ui/stars-background"
import { ShootingStars } from "@/components/ui/shooting-stars"

const ProfilePage = () => {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [annualIncome, setAnnualIncome] = useState("")
  const [creditScore, setCreditScore] = useState("")
  const [loanType, setLoanType] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      setEmail(user.email || "")

      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const profile = await response.json()
          setAnnualIncome(profile.annual_income || "")
          setCreditScore(profile.credit_score || "")
          setLoanType(profile.loan_type || "")
        }
      } catch (err) {
        console.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [supabase, router])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          annual_income: annualIncome ? Number.parseFloat(annualIncome) : null,
          credit_score: creditScore ? Number.parseInt(creditScore) : null,
          loan_type: loanType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to update profile" }))
        throw new Error(errorData.error || "Failed to update profile")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </main>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <StarsBackground starDensity={0.00015} />
        <ShootingStars />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Header Section */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Profile Settings
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                Update your information to get personalized loan recommendations
              </p>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
              {/* Main Form Card */}
              <div className="md:col-span-2">
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Your data helps us find the best loan products for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Email Address
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          </div>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            disabled
                            className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-black dark:text-slate-400"
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Email cannot be changed</p>
                      </div>

                      {/* Annual Income Field */}
                      <div className="space-y-2">
                        <Label htmlFor="income" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Annual Income ($)
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <Input
                            id="income"
                            type="number"
                            placeholder="50000"
                            min="0"
                            step="1000"
                            value={annualIncome}
                            onChange={(e) => setAnnualIncome(e.target.value)}
                            className="pl-10 border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500"
                          />
                        </div>
                      </div>

                      {/* Credit Score Field */}
                      <div className="space-y-2">
                        <Label htmlFor="credit" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Credit Score
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <Input
                            id="credit"
                            type="number"
                            placeholder="700"
                            min="300"
                            max="850"
                            value={creditScore}
                            onChange={(e) => setCreditScore(e.target.value)}
                            className="pl-10 border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500"
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Range: 300 - 850</p>
                      </div>

                      {/* Loan Type Field */}
                      <div className="space-y-2">
                        <Label htmlFor="loanType" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Preferred Loan Type
                        </Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <select
                            id="loanType"
                            value={loanType}
                            onChange={(e) => setLoanType(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent"
                          >
                            <option value="">Select a loan type</option>
                            <option value="personal">Personal Loan</option>
                            <option value="auto">Auto Loan</option>
                            <option value="home">Home Loan</option>
                            <option value="student">Student Loan</option>
                            <option value="business">Business Loan</option>
                          </select>
                        </div>
                      </div>

                      {/* Success/Error Messages */}
                      {error && (
                        <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                      )}
                      {success && (
                        <div className="p-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                          <p className="text-sm text-green-700 dark:text-green-400">Profile updated successfully!</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center justify-center gap-2 flex-1 px-4 py-2 text-black dark:text-white backdrop-blur-sm border border-black dark:border-white rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/[0.2] dark:bg-white/[0.1] text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? (
                            <>
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push("/dashboard")}
                          className="inline-flex items-center justify-center gap-2 flex-1 px-4 py-2 text-black dark:text-white backdrop-blur-sm border border-black dark:border-white rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/[0.2] dark:bg-white/[0.1] text-sm transition duration-200"
                        >
                          Back to Dashboard
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info Card */}
              <div className="md:col-span-1">
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Account Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        Account Status
                      </p>
                      <p className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-600"></span>
                        Active
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        Member Since
                      </p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-red-600 dark:text-red-400 backdrop-blur-sm border border-red-600 dark:border-red-400 rounded-md hover:shadow-[0px_0px_4px_4px_rgba(239,68,68,0.2)] dark:hover:shadow-[0px_0px_4px_4px_rgba(248,113,113,0.2)] bg-white/[0.2] dark:bg-white/[0.1] text-sm transition duration-200 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ProfilePage
