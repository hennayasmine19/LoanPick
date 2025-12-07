# Loan Product Dashboard

A modern, interactive loan product comparison and recommendation platform built with Next.js, Supabase, and AI-powered chat assistance.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Badge Logic](#badge-logic)
- [AI Grounding Strategy](#ai-grounding-strategy)
- [Features](#features)
- [Tech Stack](#tech-stack)

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │  Dashboard   │  │   Products    │      │
│  │    Page      │  │    Page      │  │     Page      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │                │
│         └──────────────────┼──────────────────┘                │
│                            │                                    │
│                   ┌────────▼────────┐                          │
│                   │  UI Components  │                          │
│                   │  - Cards        │                          │
│                   │  - Dialogs      │                          │
│                   │  - Animations   │                          │
│                   └────────┬────────┘                          │
└───────────────────────────┼───────────────────────────────────┘
                             │
┌───────────────────────────▼───────────────────────────────────┐
│                      Next.js App Router                        │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              API Routes (Server Actions)              │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │  /api/products/top      → Fetch top products         │    │
│  │  /api/products          → Fetch all products         │    │
│  │  /api/chat              → AI chat endpoint           │    │
│  │  /api/profile            → User profile management    │    │
│  └──────────────────┬───────────────────────────────────┘    │
│                     │                                          │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │            Authentication Middleware                  │    │
│  │         (Supabase Auth Integration)                   │    │
│  └──────────────────┬───────────────────────────────────┘    │
└──────────────────────┼─────────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────────┐
│                    Data & AI Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────┐      │
│  │    Supabase DB       │      │   OpenRouter API     │      │
│  │                      │      │   (DeepSeek Models)  │      │
│  │  - profiles          │      │                      │      │
│  │  - loan_products     │      │  - deepseek-r1       │      │
│  │  - chat_history      │      │  - deepseek-chat     │      │
│  │  - auth.users        │      │  - deepseek-coder    │      │
│  └──────────────────────┘      └──────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
app/
├── page.tsx                    # Landing page with hero section
├── dashboard/
│   └── page.tsx                # Main dashboard with stats & products
├── products/
│   └── page.tsx                # Product listing with filters
├── chat/
│   └── page.tsx                # Full-page chat interface
├── profile/
│   └── page.tsx                # User profile management
└── api/
    ├── chat/
    │   └── route.ts            # AI chat API with grounding
    ├── products/
    │   ├── route.ts            # All products endpoint
    │   └── top/
    │       └── route.ts        # Top products endpoint
    └── profile/
        └── route.ts            # Profile CRUD operations

components/
├── enhanced-product-card.tsx   # Product card with badges & chat
├── dashboard-products.tsx      # Dashboard product display
├── chat-dialog.tsx             # Modal chat interface
├── product-card.tsx            # Products page card
└── ui/                        # Reusable UI components
    ├── meteors.tsx
    ├── particles.tsx
    ├── animated-modal.tsx
    └── ... (40+ components)
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account and project
- OpenRouter account with DeepSeek API key

### Step 1: Clone and Install

```bash
cd loan-product-dashboard
npm install
# or
pnpm install
```

### Step 2: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# DeepSeek API (via OpenRouter)
DEEPSEEK_API_KEY=your_openrouter_api_key
```

### Step 3: Database Setup

Run the SQL scripts in order from the `scripts/` directory:

1. **Create Tables** (`001_create_tables.sql`)
   - Creates `profiles`, `loan_products`, and `chat_history` tables
   - Sets up Row Level Security (RLS) policies

2. **Seed Data** (`002_seed_loan_products.sql`)
   - Populates `loan_products` table with sample loan data

3. **Profile Trigger** (`003_create_profile_trigger.sql`)
   - Auto-creates profile on user signup

4. **Additional Fields** (`004_add_loan_fields.sql`)
   - Adds `loan_type`, `tenure_min_months`, `tenure_max_months`, etc.

### Step 4: Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see the application.

### Step 5: Build for Production

```bash
npm run build
npm start
```

---

## 🏷️ Badge Logic

The badge system dynamically generates contextual badges for each loan product based on product attributes. Badges are color-coded for quick visual identification.

### Badge Generation Algorithm

Located in `components/enhanced-product-card.tsx`, the `getBadges()` function generates badges based on:

#### 1. **APR-Based Badges**
```typescript
if (product.apr < 6) {
  badges.push("Low APR")           // Green badge
} else if (product.apr < 8) {
  badges.push("Competitive APR")   // Green badge
}
```

#### 2. **Income-Based Badges**
```typescript
if (product.min_income) {
  badges.push(`Salary > $${(product.min_income / 1000).toFixed(0)}k Eligible`)
  // Blue badge
}
```

#### 3. **Credit Score Badges**
```typescript
if (product.min_credit_score) {
  badges.push(`Credit Score ≥ ${product.min_credit_score}`)
  // Purple badge
}
```

#### 4. **Processing Time Badges**
```typescript
if (product.processing_time?.includes("1-2") || 
    product.processing_time?.includes("Fast")) {
  badges.push("Fast Disbursal")    // Indigo badge
}
```

#### 5. **Tenure Badges**
```typescript
if (product.tenure_max_months >= 60) {
  badges.push("Flexible Tenure")   // Orange badge
}
```

#### 6. **Feature-Based Badges**
- **No Prepayment** (Pink) - If features include "prepayment" or "early"
- **Low Docs** (Cyan) - If features include "doc" or "document"

#### 7. **Special Badges**
- **Limited-Time Offer** (Amber) - Randomly assigned for demo purposes
- **Best Match** (Yellow) - Assigned to the top recommended product

### Badge Color Mapping

The `getBadgeColor()` function maps badge text to colors:

| Badge Type | Color | Light Mode | Dark Mode |
|------------|-------|------------|-----------|
| APR-related | Green | `bg-green-100` | `bg-green-900/30` |
| Salary/Income | Blue | `bg-blue-100` | `bg-blue-900/30` |
| Credit Score | Purple | `bg-purple-100` | `bg-purple-900/30` |
| Tenure/Flexible | Orange | `bg-orange-100` | `bg-orange-900/30` |
| Prepayment | Pink | `bg-pink-100` | `bg-pink-900/30` |
| Documents | Cyan | `bg-cyan-100` | `bg-cyan-900/30` |
| Fast Disbursal | Indigo | `bg-indigo-100` | `bg-indigo-900/30` |
| Limited Offer | Amber | `bg-amber-100` | `bg-amber-900/30` |
| Best Match | Yellow | `bg-yellow-100` | `bg-yellow-900/30` |

### Badge Priority

Badges are generated in order and limited to a maximum of 6 per product:
1. APR badge (if applicable)
2. Income badge (if applicable)
3. Credit score badge (if applicable)
4. Processing time badge (if applicable)
5. Tenure badge (if applicable)
6. Feature-based badges (if applicable)
7. Special badges (random/conditional)

---

## 🤖 AI Grounding Strategy

The AI chat system uses **strict data grounding** to ensure responses are based solely on actual product data from the database, preventing hallucinations.

### Implementation Location

The grounding logic is implemented in `app/api/chat/route.ts`.

### Grounding Approach

#### 1. **Context-Aware Data Fetching**

The system supports two modes:

**Single Product Mode** (when `productId` is provided):
```typescript
if (productId) {
  // Fetch only the specific product
  const { data: product } = await supabase
    .from("loan_products")
    .select("*")
    .eq("id", productId)
    .single()
  
  // Format single product for prompt
  productsData = `Bank: ${product.bank_name}, Product: ${product.product_name}, ...`
}
```

**All Products Mode** (general chat):
```typescript
else {
  // Fetch all products, ordered by APR
  const { data: products } = await supabase
    .from("loan_products")
    .select("*")
    .order("apr", { ascending: true })
  
  // Format all products for prompt
  productsData = products.map(p => `Bank: ${p.bank_name}, ...`).join("\n")
}
```

#### 2. **Strict System Prompt**

The system prompt explicitly instructs the AI to **only use provided data**:

```typescript
systemPrompt = `You are a helpful financial advisor specializing in personal loans. 

IMPORTANT: You MUST ONLY use the loan product data provided below. 
Do not make up or reference any products, banks, rates, or features 
that are not in the provided data. If asked about something not in 
the data, politely say you don't have that information.

Available Loan Products:
${productsData}

Provide clear, concise advice about these loan products, APR rates, 
and help users find the best match based on their needs. Always be 
professional and helpful. When recommending products, reference 
specific banks and products from the data above.`
```

#### 3. **Data Formatting**

Product data is formatted consistently for the AI:

```
Bank: {bank_name}, 
Product: {product_name}, 
Loan Type: {loan_type}, 
APR: {apr}% (Range: {min_apr}% - {max_apr}%), 
Loan Amount: ${loan_amount_min} - ${loan_amount_max}, 
Min Credit Score: {min_credit_score}, 
Min Income: ${min_income}, 
Tenure: {tenure_min_months} - {tenure_max_months} months, 
Features: {features.join(", ")}, 
Processing Time: {processing_time}, 
Summary: {summary || description}
```

#### 4. **Model Fallback Strategy**

The system tries multiple DeepSeek models in order:

```typescript
const modelsToTry = [
  "deepseek/deepseek-r1",      // Reasoning model (preferred)
  "deepseek/deepseek-chat",     // General chat model
  "deepseek/deepseek-coder",    // Code-focused model (fallback)
]

for (const model of modelsToTry) {
  try {
    const completion = await openrouter.chat.send({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      maxTokens: 500,
      temperature: 0.7,
    })
    if (response) break // Success, exit loop
  } catch (error) {
    // Try next model
  }
}
```

#### 5. **Response Validation**

- **Max Tokens**: Limited to 500 tokens to keep responses concise
- **Temperature**: Set to 0.7 for balanced creativity and accuracy
- **Error Handling**: Falls back to next model if one fails
- **Chat History**: All conversations are saved to `chat_history` table for audit

### Grounding Benefits

✅ **Prevents Hallucinations**: AI cannot invent products, rates, or features  
✅ **Data-Driven Responses**: All recommendations are based on actual database records  
✅ **Consistent Information**: Users receive accurate, up-to-date product information  
✅ **Audit Trail**: All chat interactions are logged for review  

### Example Grounded Response

**User Query**: "What's the lowest APR loan available?"

**AI Response** (grounded in actual data):
> "Based on the products in my database, the lowest APR loan is the **Chase Personal Loan** at 5.99% APR. This loan offers amounts from $5,000 to $100,000 with a minimum credit score of 680. Would you like more details about this product?"

---

## ✨ Features

### User Interface
- 🎨 Modern, animated UI with Framer Motion
- 📱 Fully responsive design
- ✨ Interactive effects (ripples, particles, meteors, shooting stars)
- 🎯 Focus cards with hover effects
- 💫 Spotlight effects for best match products

### Product Management
- 🔍 Advanced filtering (APR, amount, credit score, income)
- 🏷️ Dynamic badge system with color coding
- 📊 Personalized product recommendations
- ⭐ Best match highlighting
- 📈 Top 5 products display

### AI Chat Assistant
- 💬 Context-aware chat (single product or general)
- 🎯 Grounded responses (no hallucinations)
- 🔄 Model fallback strategy
- ⚡ Fast response times

### Authentication & Profile
- 🔐 Supabase authentication
- 👤 User profile management
- 💰 Income and credit score tracking
- 🔒 Row Level Security (RLS)

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
- **Next.js API Routes** - Server-side endpoints

### AI & External Services
- **OpenRouter** - AI model gateway
- **DeepSeek** - LLM models (r1, chat, coder)

### UI Components
- **shadcn/ui** - Component library
- **Three.js** - 3D graphics (for spotlight effects)
- **React Three Fiber** - React renderer for Three.js

---

## 📝 License

This project is private and proprietary.

---


