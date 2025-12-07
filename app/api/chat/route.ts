import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { OpenRouter } from "@openrouter/sdk"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, productId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      console.error("DEEPSEEK_API_KEY is not set")
      return NextResponse.json({ error: "DeepSeek API key is not configured" }, { status: 500 })
    }

    let productsData = ""
    let systemPrompt = ""

    // If productId is provided, fetch only that product for focused context
    if (productId) {
      const { data: product, error: productError } = await supabase
        .from("loan_products")
        .select("*")
        .eq("id", productId)
        .single()

      if (productError || !product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      // Format single product data
      productsData = `Bank: ${product.bank_name}, Product: ${product.product_name}, Loan Type: ${product.loan_type || "N/A"}, APR: ${product.apr}%${product.min_apr ? ` (Range: ${product.min_apr}% - ${product.max_apr}%)` : ""}, Loan Amount: $${product.loan_amount_min.toLocaleString()} - $${product.loan_amount_max.toLocaleString()}, Min Credit Score: ${product.min_credit_score}, Min Income: $${product.min_income?.toLocaleString() || "N/A"}, Tenure: ${product.tenure_min_months || "N/A"} - ${product.tenure_max_months || "N/A"} months, Features: ${product.features?.join(", ") || "None"}, Processing Time: ${product.processing_time || "N/A"}, Summary: ${product.summary || product.description || "N/A"}`

      systemPrompt = `You are a helpful financial advisor specializing in personal loans. 

IMPORTANT: You MUST ONLY use the loan product data provided below. This is the ONLY product you should discuss. Do not make up or reference any other products, banks, rates, or features that are not in the provided data. If asked about something not in the data, politely say you don't have that information.

Product Details:
${productsData}

Provide clear, concise advice about THIS SPECIFIC loan product. Answer questions about APR, eligibility, features, tenure, and any other aspects of this product. Always be professional and helpful.`
    } else {
      // Fetch all loan products from database
      const { data: products, error: productsError } = await supabase
        .from("loan_products")
        .select("*")
        .order("apr", { ascending: true })

      if (productsError) {
        console.error("Failed to fetch products:", productsError)
        return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 })
      }

      if (!products || products.length === 0) {
        return NextResponse.json({ error: "No loan products found in database" }, { status: 404 })
      }

      // Format products data for the prompt
      productsData = products
        .map(
          (p) =>
            `Bank: ${p.bank_name}, Product: ${p.product_name}, Loan Type: ${p.loan_type || "N/A"}, APR: ${p.apr}%${p.min_apr ? ` (Range: ${p.min_apr}% - ${p.max_apr}%)` : ""}, Loan Amount: $${p.loan_amount_min.toLocaleString()} - $${p.loan_amount_max.toLocaleString()}, Min Credit Score: ${p.min_credit_score}, Min Income: $${p.min_income?.toLocaleString() || "N/A"}, Tenure: ${p.tenure_min_months || "N/A"} - ${p.tenure_max_months || "N/A"} months, Features: ${p.features?.join(", ") || "None"}, Processing Time: ${p.processing_time || "N/A"}, Summary: ${p.summary || p.description || "N/A"}`
        )
        .join("\n")

      // Create system prompt that instructs to only use product data
      systemPrompt = `You are a helpful financial advisor specializing in personal loans. 

IMPORTANT: You MUST ONLY use the loan product data provided below. Do not make up or reference any products, banks, rates, or features that are not in the provided data. If asked about something not in the data, politely say you don't have that information in your database.

Available Loan Products:
${productsData}

Provide clear, concise advice about these loan products, APR rates, and help users find the best match based on their needs. Always be professional and helpful. When recommending products, reference specific banks and products from the data above.`
    }

    // Initialize OpenRouter client
    const openrouter = new OpenRouter({
      apiKey: process.env.DEEPSEEK_API_KEY,
    })

    // Try different DeepSeek models
    const modelsToTry = [
      "deepseek/deepseek-r1",
      "deepseek/deepseek-chat",
      "deepseek/deepseek-coder",
    ]

    let response = ""
    let lastError: any = null

    for (const model of modelsToTry) {
      try {
        const completion = await openrouter.chat.send({
          model: model,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message,
            },
          ],
          maxTokens: 500,
          temperature: 0.7,
        })

        const content = completion.choices[0]?.message?.content
        if (typeof content === 'string') {
          response = content
        } else if (Array.isArray(content)) {
          response = content
            .map(c => {
              if (typeof c === 'string') return c
              if (c && typeof c === 'object' && 'text' in c) return (c as any).text
              return ''
            })
            .join('')
        } else {
          response = String(content || '')
        }
        if (response) {
          console.log(`Success with model: ${model}`)
          break // Success, exit loop
        }
      } catch (error) {
        console.log(`Model ${model} failed:`, error)
        lastError = error
      }
    }

    if (!response) {
      console.error("All DeepSeek models failed:", lastError)
      return NextResponse.json(
        { 
          error: lastError?.message || "Failed to get response from DeepSeek. Please check your API key." 
        },
        { status: 500 }
      )
    }

    // Save chat history to Supabase
    const { error: saveError } = await supabase.from("chat_history").insert({
      user_id: user.id,
      message,
      response,
    })

    if (saveError) {
      console.error("Failed to save chat history:", saveError)
      // Don't fail the request if saving history fails
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to process chat message"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// Legacy function - kept for reference but not used
function generateResponse(message: string, products: any[]): string {
  const lowerMessage = message.toLowerCase()

  // Extract numbers from message
  const numbers = message.match(/\d+/g)?.map(Number) || []
  const creditScore = numbers.find(n => n >= 300 && n <= 850)
  const income = numbers.find(n => n >= 10000)
  const loanAmount = numbers.find(n => n >= 1000)

  // Filter products based on query
  let filteredProducts = [...products]

  // Filter by bank name
  const bankKeywords = ["chase", "capital one", "wells fargo", "bank of america", "citi", "us bank", "keybank", "first national"]
  const mentionedBank = bankKeywords.find(bank => lowerMessage.includes(bank.toLowerCase()))
  if (mentionedBank) {
    filteredProducts = filteredProducts.filter(p => 
      p.bank_name.toLowerCase().includes(mentionedBank.toLowerCase())
    )
  }

  // Filter by loan type keywords
  if (lowerMessage.includes("personal") || lowerMessage.includes("personal loan")) {
    filteredProducts = filteredProducts.filter(p => 
      p.product_name.toLowerCase().includes("personal") || 
      p.description?.toLowerCase().includes("personal")
    )
  }
  if (lowerMessage.includes("home") || lowerMessage.includes("home equity")) {
    filteredProducts = filteredProducts.filter(p => 
      p.product_name.toLowerCase().includes("home") || 
      p.description?.toLowerCase().includes("home")
    )
  }
  if (lowerMessage.includes("auto") || lowerMessage.includes("car")) {
    filteredProducts = filteredProducts.filter(p => 
      p.product_name.toLowerCase().includes("auto") || 
      p.description?.toLowerCase().includes("auto")
    )
  }
  if (lowerMessage.includes("student")) {
    filteredProducts = filteredProducts.filter(p => 
      p.product_name.toLowerCase().includes("student") || 
      p.description?.toLowerCase().includes("student")
    )
  }
  if (lowerMessage.includes("business")) {
    filteredProducts = filteredProducts.filter(p => 
      p.product_name.toLowerCase().includes("business") || 
      p.description?.toLowerCase().includes("business")
    )
  }

  // Filter by credit score
  if (creditScore) {
    filteredProducts = filteredProducts.filter(p => p.min_credit_score <= creditScore)
  }

  // Filter by income
  if (income) {
    filteredProducts = filteredProducts.filter(p => !p.min_income || p.min_income <= income)
  }

  // Filter by loan amount
  if (loanAmount) {
    filteredProducts = filteredProducts.filter(p => 
      p.loan_amount_min <= loanAmount && p.loan_amount_max >= loanAmount
    )
  }

  // Filter by APR queries
  if (lowerMessage.includes("lowest") || lowerMessage.includes("lowest apr") || lowerMessage.includes("best rate")) {
    filteredProducts = filteredProducts.sort((a, b) => a.apr - b.apr).slice(0, 3)
  }
  if (lowerMessage.includes("highest apr") || lowerMessage.includes("worst rate")) {
    filteredProducts = filteredProducts.sort((a, b) => b.apr - a.apr).slice(0, 3)
  }

  // Generate response based on query type
  if (lowerMessage.includes("what") && (lowerMessage.includes("product") || lowerMessage.includes("loan"))) {
    if (filteredProducts.length === 0) {
      return "I don't have any loan products matching your criteria in my database. Please try different search terms."
    }
    return `I found ${filteredProducts.length} loan product${filteredProducts.length > 1 ? 's' : ''}:\n\n${filteredProducts.map((p, i) => 
      `${i + 1}. **${p.bank_name} - ${p.product_name}**\n   - APR: ${p.apr}%${p.min_apr ? ` (Range: ${p.min_apr}% - ${p.max_apr}%)` : ''}\n   - Loan Amount: $${p.loan_amount_min.toLocaleString()} - $${p.loan_amount_max.toLocaleString()}\n   - Min Credit Score: ${p.min_credit_score}\n   - Min Income: $${p.min_income?.toLocaleString() || 'N/A'}\n   - Features: ${p.features?.join(', ') || 'None'}\n   - Processing Time: ${p.processing_time || 'N/A'}\n   - ${p.description || ''}`
    ).join('\n\n')}`
  }

  if (lowerMessage.includes("compare") || lowerMessage.includes("difference")) {
    if (filteredProducts.length === 0) {
      return "I don't have products to compare based on your query. Please try asking about specific banks or loan types."
    }
    const top3 = filteredProducts.slice(0, 3)
    return `Here's a comparison of ${top3.length} loan products:\n\n${top3.map((p, i) => 
      `**${i + 1}. ${p.bank_name} - ${p.product_name}**\n   APR: ${p.apr}% | Amount: $${p.loan_amount_min.toLocaleString()}-$${p.loan_amount_max.toLocaleString()} | Min Credit: ${p.min_credit_score}`
    ).join('\n\n')}`
  }

  if (lowerMessage.includes("recommend") || lowerMessage.includes("best") || lowerMessage.includes("suggest")) {
    if (filteredProducts.length === 0) {
      return "Based on your criteria, I couldn't find matching loan products. You might want to check products with lower requirements or different loan types."
    }
    const best = filteredProducts.sort((a, b) => a.apr - b.apr)[0]
    return `Based on your needs, I recommend **${best.bank_name} - ${best.product_name}**.\n\n**Details:**\n- APR: ${best.apr}%${best.min_apr ? ` (Range: ${best.min_apr}% - ${best.max_apr}%)` : ''}\n- Loan Amount: $${best.loan_amount_min.toLocaleString()} - $${best.loan_amount_max.toLocaleString()}\n- Minimum Credit Score: ${best.min_credit_score}\n- Minimum Income: $${best.min_income?.toLocaleString() || 'N/A'}\n- Features: ${best.features?.join(', ') || 'None'}\n- Processing Time: ${best.processing_time || 'N/A'}\n\n${best.description || ''}`
  }

  if (lowerMessage.includes("apr") || lowerMessage.includes("rate") || lowerMessage.includes("interest")) {
    if (filteredProducts.length === 0) {
      return "I don't have APR information for products matching your query. Please try asking about specific banks or loan types."
    }
    const sortedByApr = filteredProducts.sort((a, b) => a.apr - b.apr)
    return `Here are APRs for matching loan products:\n\n${sortedByApr.slice(0, 5).map((p, i) => 
      `${i + 1}. **${p.bank_name} - ${p.product_name}**: ${p.apr}%${p.min_apr ? ` (Range: ${p.min_apr}% - ${p.max_apr}%)` : ''}`
    ).join('\n')}`
  }

  // Default: show all products or filtered results
  if (filteredProducts.length === 0) {
    filteredProducts = products.slice(0, 5) // Show top 5 if no filters match
  }

  return `I found ${filteredProducts.length} loan product${filteredProducts.length > 1 ? 's' : ''} that might interest you:\n\n${filteredProducts.slice(0, 5).map((p, i) => 
    `${i + 1}. **${p.bank_name} - ${p.product_name}**\n   APR: ${p.apr}% | Amount: $${p.loan_amount_min.toLocaleString()}-$${p.loan_amount_max.toLocaleString()} | Min Credit: ${p.min_credit_score}\n   ${p.description || ''}`
  ).join('\n\n')}\n\nYou can ask me about specific banks, loan types, or ask me to recommend products based on your credit score or income.`
}
