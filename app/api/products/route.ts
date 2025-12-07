import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const bank = searchParams.get("bank")
    const minAPR = searchParams.get("minAPR")
    const maxAPR = searchParams.get("maxAPR")
    const minIncome = searchParams.get("minIncome")
    const minCreditScore = searchParams.get("minCreditScore")

    let query = supabase.from("loan_products").select("*")

    if (bank) {
      query = query.ilike("bank_name", `%${bank}%`)
    }

    if (minAPR) {
      query = query.gte("apr", Number.parseFloat(minAPR))
    }

    if (maxAPR) {
      query = query.lte("apr", Number.parseFloat(maxAPR))
    }

    if (minIncome) {
      query = query.gte("min_income", Number.parseFloat(minIncome))
    }

    if (minCreditScore) {
      query = query.lte("min_credit_score", Number.parseInt(minCreditScore))
    }

    const { data, error } = await query.order("apr", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
