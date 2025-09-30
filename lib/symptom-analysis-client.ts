// Client-side service for symptom analysis
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

export class SymptomAnalysisClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  }

  async analyzeSymptoms(
    symptoms: string[],
    description: string,
    language: "en" | "bn" = "en"
  ): Promise<AISymptomAnalysisResult> {
    try {
      const request: SymptomAnalysisRequest = {
        symptoms,
        description,
        language
      }

      const response = await fetch(`${this.baseUrl}/api/analyze-symptoms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: SymptomAnalysisResponse = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || "Analysis failed")
      }

      return result.data

    } catch (error) {
      console.error("Client symptom analysis error:", error)
      
      // Return fallback analysis on error
      return this.getFallbackAnalysis(symptoms, description, language)
    }
  }

  private getFallbackAnalysis(
    symptoms: string[],
    description: string,
    language: "en" | "bn"
  ): AISymptomAnalysisResult {
    // Simple client-side fallback when API fails
    const hasUrgentSymptoms = symptoms.some(s => 
      ["bleeding", "severe-pain", "high-fever", "difficulty-breathing"].includes(s)
    )
    
    const hasUrgentKeywords = /emergency|urgent|severe|can't|unable|heavy|intense/i.test(description)
    
    const urgency = hasUrgentSymptoms || hasUrgentKeywords ? "urgent" : 
                   symptoms.length >= 3 ? "consult" : "monitor"
    
    const severity = hasUrgentKeywords ? "severe" : 
                    symptoms.length >= 2 ? "moderate" : "mild"
    
    const riskLevel = urgency === "urgent" ? "high" : 
                     severity === "severe" ? "medium" : "low"

    return {
      extractedSymptoms: symptoms,
      severity,
      urgency,
      riskLevel,
      possibleConditions: urgency === "urgent" ? ["Requires immediate medical attention"] : [],
      recommendations: {
        en: urgency === "urgent" 
          ? ["Seek immediate medical attention", "Go to emergency room"]
          : ["Monitor symptoms", "Contact healthcare provider if worsening"],
        bn: urgency === "urgent"
          ? ["অবিলম্বে চিকিৎসা সেবা নিন", "জরুরি বিভাগে যান"]
          : ["লক্ষণগুলি পর্যবেক্ষণ করুন", "খারাপ হলে স্বাস্থ্যসেবা প্রদানকারীর সাথে যোগাযোগ করুন"]
      },
      message: {
        en: urgency === "urgent" 
          ? "Based on your symptoms, you need immediate medical attention."
          : "Please monitor your symptoms and consult a healthcare provider if they worsen.",
        bn: urgency === "urgent"
          ? "আপনার লক্ষণগুলির ভিত্তিতে, আপনার অবিলম্বে চিকিৎসা সেবা প্রয়োজন।"
          : "অনুগ্রহ করে আপনার লক্ষণগুলি পর্যবেক্ষণ করুন এবং খারাপ হলে একজন স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করুন।"
      },
      confidence: 0.5,
      aiGenerated: false
    }
  }
}

// Export singleton instance
export const symptomAnalysisClient = new SymptomAnalysisClient()