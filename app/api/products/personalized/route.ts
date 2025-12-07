import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }

    // Get personalized products based on profile
    let query = supabase.from("loan_products").select("*")

    if (profile?.min_income) {
      query = query.lte("min_income", profile.min_income)
    }

    if (profile?.credit_score) {
      query = query.lte("min_credit_score", profile.credit_score)
    }

    const { data: products, error: productsError } = await query.order("apr", { ascending: true }).limit(5)

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 })
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch personalized products" }, { status: 500 })
  }
}
