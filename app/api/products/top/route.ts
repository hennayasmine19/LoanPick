import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Map user loan_type to product loan_type
const mapUserLoanTypeToProductType = (userLoanType: string): string => {
  const mapping: Record<string, string> = {
    student: "Education",
    home: "Home",
    personal: "Personal",
    auto: "Vehicle",
    vehicle: "Vehicle",
    business: "Business",
    education: "Education",
  }
  return mapping[userLoanType.toLowerCase()] || userLoanType
}

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

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Map user's loan type to product loan type
    const productLoanType = profile?.loan_type ? mapUserLoanTypeToProductType(profile.loan_type) : null

    // Helper function to build filtered query
    const buildFilteredQuery = (includeLoanType = false) => {
      let query = supabase.from("loan_products").select("*")
      if (includeLoanType && productLoanType) {
        query = query.ilike("loan_type", `%${productLoanType}%`)
      }
      if (profile?.credit_score) {
        query = query.lte("min_credit_score", profile.credit_score)
      }
      if (profile?.annual_income) {
        query = query.lte("min_income", profile.annual_income)
      }
      return query
    }

    // First, get the BEST matching product by loan type (without credit/income filters to ensure we get a match)
    let bestMatchProduct: any = null
    if (productLoanType) {
      const { data: bestMatchData, error: bestMatchError } = await supabase
        .from("loan_products")
        .select("*")
        .ilike("loan_type", `%${productLoanType}%`)
        .order("apr", { ascending: true })
        .limit(1)

      if (!bestMatchError && bestMatchData && bestMatchData.length > 0) {
        bestMatchProduct = bestMatchData[0]
        console.log(`Found best match product for loan type ${productLoanType}:`, bestMatchProduct.product_name)
      } else {
        console.log(`No products found for loan type: ${productLoanType}`)
      }
    }

    // Get matching products that also meet credit/income criteria
    let matchingProducts: any[] = []
    if (productLoanType) {
      const matchQuery = buildFilteredQuery(true)
      const { data: matched, error: matchError } = await matchQuery
        .order("apr", { ascending: true })
        .limit(5)

      if (!matchError && matched) {
        matchingProducts = matched
      }
    }

    // If we have a best match product but it's not in matchingProducts (due to filters), still include it
    if (bestMatchProduct && !matchingProducts.find(p => p.id === bestMatchProduct.id)) {
      matchingProducts = [bestMatchProduct, ...matchingProducts].slice(0, 5)
    }

    // Get all products that meet criteria (excluding best match)
    const allFilteredQuery = buildFilteredQuery(false)
    const { data: allFilteredProducts, error: allFilteredError } = await allFilteredQuery
      .order("apr", { ascending: true })
      .limit(20)

    if (allFilteredError) {
      console.error("All filtered products error:", allFilteredError)
    }

    // Get top 5 products that meet criteria (excluding best match)
    const matchedIds = new Set(matchingProducts.map((p) => p.id))
    let top5Products = (allFilteredProducts || [])
      .filter((p: any) => !matchedIds.has(p.id))
      .slice(0, 5)

    // If we don't have 5 products, get more without strict filters
    if (top5Products.length < 5) {
      const { data: allProducts, error: allProductsError } = await supabase
        .from("loan_products")
        .select("*")
        .order("apr", { ascending: true })
        .limit(20)

      if (!allProductsError && allProducts) {
        const existingIds = new Set([...matchedIds, ...top5Products.map((p: any) => p.id)])
        const additionalProducts = allProducts
          .filter((p: any) => !existingIds.has(p.id))
          .slice(0, 5 - top5Products.length)
        
        top5Products = [...top5Products, ...additionalProducts]
      }
    }

    // Determine best match
    let bestMatch: any = null
    if (matchingProducts.length > 0) {
      // Sort matching products by APR and take the best one
      const sortedMatching = [...matchingProducts].sort((a, b) => a.apr - b.apr)
      bestMatch = sortedMatching[0]
    } else if (bestMatchProduct) {
      bestMatch = bestMatchProduct
    }

    // If no best match found, get the top product overall
    if (!bestMatch && allFilteredProducts && allFilteredProducts.length > 0) {
      bestMatch = allFilteredProducts[0]
      // Remove best match from top 5 if it's there
      const bestMatchIndex = top5Products.findIndex((p: any) => p.id === bestMatch.id)
      if (bestMatchIndex !== -1) {
        top5Products.splice(bestMatchIndex, 1)
      }
      // Add another product to maintain 5 products
      const additionalProducts = (allFilteredProducts || [])
        .filter((p: any) => p.id !== bestMatch.id && !top5Products.find((tp: any) => tp.id === p.id))
        .slice(0, 1)
      top5Products.push(...additionalProducts)
    }

    // Fallback: if no filtered products, get top 6 overall
    if (!bestMatch && top5Products.length === 0) {
      const { data: allProductsFallback, error: allError } = await supabase
        .from("loan_products")
        .select("*")
        .order("apr", { ascending: true })
        .limit(6)

      if (allError) {
        return NextResponse.json({ error: allError.message }, { status: 500 })
      }

      if (allProductsFallback && allProductsFallback.length > 0) {
        return NextResponse.json({
          bestMatch: allProductsFallback[0],
          top5: allProductsFallback.slice(1, 6),
        })
      }
    }

    // Ensure we have at least 5 products in top5
    const finalTop5 = top5Products.slice(0, 5)
    
    console.log(`Returning bestMatch: ${bestMatch?.product_name || 'null'}, top5 count: ${finalTop5.length}`)
    
    // Return best match + top 5 products
    return NextResponse.json({
      bestMatch: bestMatch,
      top5: finalTop5,
    })
  } catch (error) {
    console.error("Top products error:", error)
    return NextResponse.json({ error: "Failed to fetch top products" }, { status: 500 })
  }
}

