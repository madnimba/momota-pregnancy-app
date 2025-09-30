import { NextRequest, NextResponse } from "next/server"
import { groqAI } from "@/lib/groq-ai-service"
import type { AISymptomAnalysisResult } from "@/lib/health-ai-service"

export interface SymptomAnalysisRequest {
  symptoms: string[]
  description: string
  language?: "en" | "bn"
}

export interface SymptomAnalysisResponse {
  success: boolean
  data?: AISymptomAnalysisResult
  error?: string
  fallbackUsed?: boolean
}

export async function POST(request: NextRequest): Promise<NextResponse<SymptomAnalysisResponse>> {
  try {
    // Parse request body
    const body: SymptomAnalysisRequest = await request.json()
    
    // Validate input
    if (!body.symptoms && !body.description?.trim()) {
      return NextResponse.json({
        success: false,
        error: "No symptoms or description provided"
      }, { status: 400 })
    }

    // Validate symptoms array
    if (!Array.isArray(body.symptoms)) {
      return NextResponse.json({
        success: false,
        error: "Symptoms must be an array"
      }, { status: 400 })
    }

    // Sanitize and validate inputs
    const symptoms = body.symptoms.filter(s => typeof s === "string" && s.trim().length > 0)
    const description = typeof body.description === "string" ? body.description.trim() : ""
    const language = body.language === "bn" ? "bn" : "en"

    // Check if we have valid input after sanitization
    if (symptoms.length === 0 && description.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No valid symptoms or description after sanitization"
      }, { status: 400 })
    }

    // Log the analysis request (remove in production)
    console.log("Groq AI symptom analysis request:", {
      symptoms: symptoms.length,
      descriptionLength: description.length,
      language
    })

    // Call Groq AI service for analysis
    const analysisResult = await groqAI.analyzeSymptoms(symptoms, description, language)

    // Add rate limiting info to response headers
    const response = NextResponse.json({
      success: true,
      data: analysisResult,
      fallbackUsed: !analysisResult.aiGenerated
    })

    // Add CORS headers for local development
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type")

    return response

  } catch (error) {
    console.error("Symptom analysis API error:", error)
    
    // Return a safe error response
    return NextResponse.json({
      success: false,
      error: "Internal server error during symptom analysis",
      fallbackUsed: true
    }, { status: 500 })
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}