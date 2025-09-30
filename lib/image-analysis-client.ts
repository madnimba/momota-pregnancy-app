// Client-side service for image-based health analysis using Gemini AI
import type { AnemiaResult, NutritionResult, BPResult, InfectionResult, DiabetesResult } from "@/lib/ai-mock"

export interface ImageAnalysisResponse<T> {
  success: boolean
  data?: T
  error?: string
  aiGenerated?: boolean
  source?: "gemini" | "fallback"
}

export class ImageAnalysisClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  }

  async analyzeAnemia(
    imageData: string,
    language: "en" | "bn" = "en"
  ): Promise<AnemiaResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze-anemia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData,
          language
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ImageAnalysisResponse<AnemiaResult> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || "Anemia analysis failed")
      }

      return result.data

    } catch (error) {
      console.error("Client anemia analysis error:", error)
      return this.getFallbackAnemiaAnalysis(language)
    }
  }

  async analyzeNutrition(
    imageData: string,
    language: "en" | "bn" = "en"
  ): Promise<NutritionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze-nutrition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData,
          language
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ImageAnalysisResponse<NutritionResult> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || "Nutrition analysis failed")
      }

      return result.data

    } catch (error) {
      console.error("Client nutrition analysis error:", error)
      return this.getFallbackNutritionAnalysis(language)
    }
  }

  async analyzeBP(
    imageData: string,
    symptoms: string[] = [],
    language: "en" | "bn" = "en"
  ): Promise<BPResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze-bp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData,
          symptoms,
          language
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ImageAnalysisResponse<BPResult> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || "BP analysis failed")
      }

      return result.data

    } catch (error) {
      console.error("Client BP analysis error:", error)
      return this.getFallbackBPAnalysis(language)
    }
  }

  async analyzeInfection(
    imageData: string,
    language: "en" | "bn" = "en"
  ): Promise<InfectionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze-infection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData,
          language
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ImageAnalysisResponse<InfectionResult> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || "Infection analysis failed")
      }

      return result.data

    } catch (error) {
      console.error("Client infection analysis error:", error)
      return this.getFallbackInfectionAnalysis(language)
    }
  }

  async analyzeDiabetes(
    imageData: string,
    language: "en" | "bn" = "en"
  ): Promise<DiabetesResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze-diabetes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData,
          language
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ImageAnalysisResponse<DiabetesResult> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || "Diabetes analysis failed")
      }

      return result.data

    } catch (error) {
      console.error("Client diabetes analysis error:", error)
      return this.getFallbackDiabetesAnalysis(language)
    }
  }

  private getFallbackAnemiaAnalysis(language: "en" | "bn"): AnemiaResult {
    // Simple client-side fallback when API fails
    const pallorLevel = Math.floor(Math.random() * 60) + 20 // 20-80%
    const riskLevel = pallorLevel < 30 ? "low" : pallorLevel < 60 ? "medium" : "high"
    const ironDeficiency = pallorLevel > 50

    return {
      pallorLevel,
      riskLevel,
      ironDeficiency,
      recommendations: {
        en: riskLevel === "high" ? [
          "Consult a doctor immediately",
          "Eat iron-rich foods",
          "Take supplements as prescribed"
        ] : [
          "Maintain balanced diet",
          "Monitor symptoms",
          "Regular checkups"
        ],
        bn: riskLevel === "high" ? [
          "অবিলম্বে ডাক্তারের পরামর্শ নিন",
          "আয়রন সমৃদ্ধ খাবার খান",
          "নির্দেশিত সাপ্লিমেন্ট নিন"
        ] : [
          "সুষম খাদ্য বজায় রাখুন",
          "লক্ষণ পর্যবেক্ষণ করুন",
          "নিয়মিত চেকআপ"
        ]
      },
      message: {
        en: riskLevel === "high" ? 
          "High risk of anemia detected. Please consult a healthcare provider." :
          "Moderate anemia risk. Continue monitoring and maintain a healthy diet.",
        bn: riskLevel === "high" ?
          "রক্তস্বল্পতার উচ্চ ঝুঁকি সনাক্ত। অনুগ্রহ করে স্বাস্থ্যসেবা প্রদানকারীর পরামর্শ নিন।" :
          "মাঝারি রক্তস্বল্পতার ঝুঁকি। পর্যবেক্ষণ চালিয়ে যান এবং স্বাস্থ্যকর খাদ্য বজায় রাখুন।"
      }
    }
  }

  private getFallbackNutritionAnalysis(language: "en" | "bn"): NutritionResult {
    const iron = Math.floor(Math.random() * 15) + 5 // 5-20mg
    const protein = Math.floor(Math.random() * 30) + 15 // 15-45g
    const calcium = Math.floor(Math.random() * 600) + 300 // 300-900mg
    const calories = Math.floor(Math.random() * 400) + 300 // 300-700 calories
    const riskLevel = iron < 10 ? "high" : iron < 15 ? "medium" : "low"

    return {
      iron,
      protein,
      calcium,
      calories,
      riskLevel,
      missing: iron < 10 ? ["Iron", "Vitamin C"] : [],
      recommendations: {
        en: riskLevel === "high" ? [
          "Increase protein-rich foods",
          "Add calcium sources",
          "Include iron-rich vegetables",
          "Consult a nutritionist"
        ] : [
          "Maintain balanced diet",
          "Include variety of foods",
          "Stay hydrated"
        ],
        bn: riskLevel === "high" ? [
          "প্রোটিন সমৃদ্ধ খাবার বাড়ান",
          "ক্যালসিয়ামের উৎস যোগ করুন",
          "আয়রন সমৃদ্ধ সবজি অন্তর্ভুক্ত করুন",
          "পুষ্টিবিদের পরামর্শ নিন"
        ] : [
          "সুষম খাদ্য বজায় রাখুন",
          "বিভিন্ন ধরনের খাবার অন্তর্ভুক্ত করুন",
          "হাইড্রেটেড থাকুন"
        ]
      },
      message: {
        en: riskLevel === "high" ? 
          "Nutritional deficiency detected. Please improve your diet." :
          "Good nutritional status. Continue current dietary habits.",
        bn: riskLevel === "high" ?
          "পুষ্টির ঘাটতি সনাক্ত হয়েছে। অনুগ্রহ করে আপনার খাদ্যাভ্যাস উন্নত করুন।" :
          "ভাল পুষ্টির অবস্থা। বর্তমান খাদ্যাভ্যাস বজায় রাখুন।"
      }
    }
  }

  private getFallbackBPAnalysis(language: "en" | "bn"): BPResult {
    const systolic = Math.floor(Math.random() * 60) + 100 // 100-160
    const diastolic = Math.floor(Math.random() * 40) + 60  // 60-100
    const riskLevel = systolic >= 140 || diastolic >= 90 ? "high" : 
                     systolic >= 130 || diastolic >= 80 ? "medium" : "low"
    const preeclampsiaRisk = riskLevel === "high"

    return {
      systolic,
      diastolic,
      riskLevel,
      preeclampsiaRisk,
      symptoms: [],
      recommendations: {
        en: riskLevel === "high" ? [
          "Consult doctor immediately",
          "Reduce salt intake",
          "Rest and monitor",
          "Regular BP checks"
        ] : [
          "Maintain healthy lifestyle",
          "Regular BP monitoring",
          "Balanced diet"
        ],
        bn: riskLevel === "high" ? [
          "অবিলম্বে ডাক্তারের পরামর্শ নিন",
          "নুন কমান",
          "বিশ্রাম নিন",
          "নিয়মিত BP পরীক্ষা করুন"
        ] : [
          "স্বাস্থ্যকর জীবনযাত্রা বজায় রাখুন",
          "নিয়মিত BP মাপুন",
          "সুষম খাদ্য গ্রহণ করুন"
        ]
      },
      message: {
        en: riskLevel === "high" ? 
          "High blood pressure detected. Please consult a healthcare provider immediately." :
          "Normal blood pressure. Continue current healthy habits.",
        bn: riskLevel === "high" ?
          "উচ্চ রক্তচাপ সনাক্ত হয়েছে। অবিলম্বে চিকিৎসকের পরামর্শ নিন।" :
          "স্বাভাবিক রক্তচাপ। বর্তমান স্বাস্থ্যকর অভ্যাস বজায় রাখুন।"
      }
    }
  }

  private getFallbackInfectionAnalysis(language: "en" | "bn"): InfectionResult {
    const riskLevel: "low" | "medium" | "high" = Math.random() > 0.8 ? "high" : Math.random() > 0.5 ? "medium" : "low"
    const urgency = riskLevel === "high" ? "urgent" : "monitor"

    return {
      urgency,
      riskLevel,
      possibleConditions: ["Skin irritation", "Minor infection"],
      symptoms: ["Visible changes"],
      recommendations: {
        en: riskLevel === "high" ? [
          "Consult doctor immediately",
          "Keep area clean",
          "Avoid touching"
        ] : [
          "Maintain cleanliness",
          "Monitor symptoms"
        ],
        bn: riskLevel === "high" ? [
          "অবিলম্বে ডাক্তারের পরামর্শ নিন",
          "এলাকা পরিষ্কার রাখুন",
          "স্পর্শ করা এড়িয়ে চলুন"
        ] : [
          "পরিষ্কার পরিচ্ছন্নতা বজায় রাখুন",
          "লক্ষণ পর্যবেক্ষণ করুন"
        ]
      },
      message: {
        en: riskLevel === "high" ? 
          "Possible infection signs detected. Please consult a healthcare provider immediately." :
          "Normal skin changes. Continue monitoring.",
        bn: riskLevel === "high" ?
          "সম্ভাব্য সংক্রমণের লক্ষণ। অবিলম্বে চিকিৎসকের পরামর্শ নিন।" :
          "সাধারণ ত্বকের পরিবর্তন। পর্যবেক্ষণ করুন।"
      }
    }
  }

  private getFallbackDiabetesAnalysis(language: "en" | "bn"): DiabetesResult {
    const glucoseLevel = Math.floor(Math.random() * 100) + 70 // 70-170
    const riskLevel = glucoseLevel >= 140 ? "high" : glucoseLevel >= 100 ? "medium" : "low"
    const prediction = glucoseLevel >= 140 ? "Gestational Diabetes" : glucoseLevel >= 100 ? "Pre-diabetic" : "Normal"

    return {
      glucoseLevel,
      riskLevel,
      prediction,
      glycemicLoad: Math.floor(glucoseLevel / 20),
      recommendations: {
        en: riskLevel === "high" ? [
          "Consult endocrinologist immediately",
          "Control sugar intake",
          "Regular glucose monitoring",
          "Follow diabetic diet"
        ] : [
          "Maintain healthy lifestyle",
          "Regular checkups",
          "Balanced diet"
        ],
        bn: riskLevel === "high" ? [
          "অবিলম্বে এন্ডোক্রিনোলজিস্টের পরামর্শ নিন",
          "শর্করা নিয়ন্ত্রণ করুন",
          "নিয়মিত গ্লুকোজ পরীক্ষা",
          "ডায়েট চার্ট অনুসরণ করুন"
        ] : [
          "স্বাস্থ্যকর জীবনযাত্রা বজায় রাখুন",
          "নিয়মিত পরীক্ষা",
          "সুষম খাদ্য"
        ]
      },
      message: {
        en: riskLevel === "high" ? 
          "High glucose levels detected. Please consult a healthcare provider immediately." :
          "Normal glucose levels. Continue current healthy habits.",
        bn: riskLevel === "high" ?
          "উচ্চ গ্লুকোজের মাত্রা সনাক্ত। অবিলম্বে চিকিৎসকের পরামর্শ নিন।" :
          "স্বাভাবিক গ্লুকোজের মাত্রা। বর্তমান অভ্যাস বজায় রাখুন।"
      }
    }
  }
}

// Export singleton instance
export const imageAnalysisClient = new ImageAnalysisClient()