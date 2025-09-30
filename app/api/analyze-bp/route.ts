// API route for blood pressure image analysis using Gemini AI
import { NextRequest, NextResponse } from "next/server"
import { geminiImageAI } from "@/lib/gemini-image-ai-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageData, symptoms = [], language = "en" } = body

    if (!imageData) {
      return NextResponse.json({
        success: false,
        error: "Image data is required"
      }, { status: 400 })
    }

    console.log("Starting BP analysis with Gemini AI...")
    
    // Analyze BP using Gemini AI
    const result = await geminiImageAI.analyzeBloodPressure(imageData, language)
    
    // Add symptoms to result if provided
    if (symptoms && symptoms.length > 0) {
      result.symptoms = symptoms
    }

    return NextResponse.json({
      success: true,
      data: result,
      aiGenerated: true,
      source: "gemini"
    })

  } catch (error) {
    console.error("BP analysis API error:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "BP analysis failed"
    }, { status: 500 })
  }
}