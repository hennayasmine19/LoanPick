import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WobbleCard } from "@/components/ui/wobble-card"
import { Meteors } from "@/components/ui/meteors"
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { Button as MovingBorderButton } from "@/components/ui/moving-border"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-white dark:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Loan Picks</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <button className="px-4 py-2 text-black dark:text-white backdrop-blur-sm border border-black dark:border-white rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/[0.2] dark:bg-white/[0.1] text-sm transition duration-200">
                Login
              </button>
            </Link>
            <Link href="/auth/sign-up">
              <button className="px-4 py-2 text-black dark:text-white backdrop-blur-sm border border-black dark:border-white rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] dark:hover:shadow-[0px_0px_4px_4px_rgba(255,255,255,0.1)] bg-white/[0.2] dark:bg-white/[0.1] text-sm transition duration-200">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 max-w-7xl relative overflow-hidden">
        <BackgroundRippleEffect rows={8} cols={27} cellSize={56} />
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Find Your Perfect
              <span className="block">
                <TypewriterEffect
                  words={[
                    { text: "Loan", className: "text-slate-600 dark:text-slate-400" },
                    { text: "Solution", className: "text-slate-600 dark:text-slate-400" },
                  ]}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold inline-block"
                  cursorClassName="bg-slate-600 dark:bg-slate-400"
                />
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Get personalized loan recommendations tailored to your financial profile. Compare rates, terms, and features from trusted lenders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/auth/sign-up">
                <MovingBorderButton
                  as="div"
                  borderRadius="0.5rem"
                  containerClassName="w-auto h-auto"
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-6 py-3 text-base border-0"
                  borderClassName="bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] dark:bg-[radial-gradient(#0ea5e9_40%,transparent_60%)]"
                >
                  Get Started
                </MovingBorderButton>
              </Link>
              <Link href="/auth/login">
                <MovingBorderButton
                  as="div"
                  borderRadius="0.5rem"
                  containerClassName="w-auto h-auto"
                  className="bg-transparent border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 text-base text-slate-900 dark:text-slate-100"
                  borderClassName="bg-[radial-gradient(#64748b_40%,transparent_60%)] dark:bg-[radial-gradient(#64748b_40%,transparent_60%)]"
                >
                  Sign In
                </MovingBorderButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8">
          <WobbleCard
            containerClassName="h-full"
            className="px-6 py-8 sm:px-8 sm:py-10"
          >
            <div className="text-center space-y-4 relative z-10">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Personalized</h3>
              <p className="text-white/90 leading-relaxed">
                Get loan recommendations based on your financial profile, credit score, and income level
              </p>
            </div>
          </WobbleCard>

          <WobbleCard
            containerClassName="h-full"
            className="px-6 py-8 sm:px-8 sm:py-10"
          >
            <div className="text-center space-y-4 relative z-10">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Compare</h3>
              <p className="text-white/90 leading-relaxed">
                Browse and compare thousands of loan products with detailed rates, terms, and features
              </p>
            </div>
          </WobbleCard>

          <WobbleCard
            containerClassName="h-full"
            className="px-6 py-8 sm:px-8 sm:py-10"
          >
            <div className="text-center space-y-4 relative z-10">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Expert Advice</h3>
              <p className="text-white/90 leading-relaxed">
                Chat with our AI assistant for personalized financial guidance and loan recommendations
              </p>
            </div>
          </WobbleCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
        <Card className="border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden min-h-[300px]">
          <Meteors number={30} />
          <CardContent className="p-12 md:p-16 text-center space-y-6 relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Ready to Find Your Perfect Loan?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Join thousands of users who have found their ideal loan solution with our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/sign-up">
                <MovingBorderButton
                  as="div"
                  borderRadius="0.75rem"
                  containerClassName="w-full sm:w-auto"
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-8 py-6 text-lg border-0"
                  borderClassName="bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] dark:bg-[radial-gradient(#0ea5e9_40%,transparent_60%)]"
                >
                  Get Started Free
                </MovingBorderButton>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
