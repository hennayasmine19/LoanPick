import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardProducts } from "@/components/dashboard-products"
import { DashboardActions } from "@/components/dashboard-actions"
import { Card, CardContent } from "@/components/ui/card"
import { CardHoverWrapper } from "@/components/ui/card-hover-effect"
import { QuickActionButtons } from "@/components/quick-action-buttons"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile for stats
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get product count
  const { count } = await supabase
    .from("loan_products")
    .select("*", { count: "exact", head: true })

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section with Stats */}
          <div className="mb-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Welcome back, {user.email?.split("@")[0]}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Discover personalized loan products tailored for you
                </p>
              </div>
              <DashboardActions />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <CardHoverWrapper>
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Products</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{count || 0}</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardHoverWrapper>

              <CardHoverWrapper>
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Credit Score</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                          {profile?.credit_score || "—"}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardHoverWrapper>

              <CardHoverWrapper>
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Annual Income</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                          {profile?.annual_income ? `$${(profile.annual_income / 1000).toFixed(0)}k` : "—"}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardHoverWrapper>

              <CardHoverWrapper>
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Loan Type</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 capitalize">
                          {profile?.loan_type || "Not set"}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardHoverWrapper>
            </div>

            {/* Quick Actions */}
            <QuickActionButtons />
          </div>

          {/* Products Section - Full Width */}
          <DashboardProducts />
        </div>
      </main>
    </>
  )
}
