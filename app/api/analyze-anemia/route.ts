import { NextRequest, NextResponse } from "next/server"
import { geminiImageAI } from "@/lib/gemini-image-ai-service"
import type { AnemiaResult } from "@/lib/ai-mock"

export interface AnemiaAnalysisRequest {
  imageData: string
  language?: "en" | "bn"
}

export interface AnemiaAnalysisResponse {
  success: boolean
  data?: AnemiaResult
  error?: string
  aiGenerated?: boolean
}

export async function POST(request: NextRequest): Promise<NextResponse<AnemiaAnalysisResponse>> {
  try {
    const body: AnemiaAnalysisRequest = await request.json()
    
    if (!body.imageData) {
      return NextResponse.json({
        success: false,
        error: "No image data provided"
      }, { status: 400 })
    }

    const language = body.language === "bn" ? "bn" : "en"

    console.log("Gemini AI anemia analysis request:", {
      imageDataLength: body.imageData.length,
      language
    })

    const analysisResult = await geminiImageAI.analyzeAnemia(body.imageData, language)

    const response = NextResponse.json({
      success: true,
      data: analysisResult,
      aiGenerated: true
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type")

    return response

  } catch (error) {
    console.error("Anemia analysis API error:", error)
    
    return NextResponse.json({
      success: false,
      error: "Internal server error during anemia analysis",
      aiGenerated: false
    }, { status: 500 })
  }
}

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