// API route for infection image analysis using Gemini AI
import { NextRequest, NextResponse } from "next/server"
import { geminiImageAI } from "@/lib/gemini-image-ai-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageData, language = "en" } = body

    if (!imageData) {
      return NextResponse.json({
        success: false,
        error: "Image data is required"
      }, { status: 400 })
    }

    console.log("Starting infection analysis with Gemini AI...")
    
    // Analyze infection using Gemini AI
    const result = await geminiImageAI.analyzeInfection(imageData, language)

    return NextResponse.json({
      success: true,
      data: result,
      aiGenerated: true,
      source: "gemini"
    })

  } catch (error) {
    console.error("Infection analysis API error:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Infection analysis failed"
    }, { status: 500 })
  }
}