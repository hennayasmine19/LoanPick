import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Fetch distinct bank names
    const { data, error } = await supabase
      .from("loan_products")
      .select("bank_name")
      .order("bank_name", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Extract unique bank names
    const uniqueBanks = Array.from(new Set(data.map((item) => item.bank_name))).filter(Boolean)

    return NextResponse.json(uniqueBanks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 })
  }
}

