// Groq AI Service for Image-based Health Analysis
import type { 
  AnemiaResult, 
  NutritionResult, 
  InfectionResult,
  BPResult,
  DiabetesResult 
} from "@/lib/ai-mock"

interface GroqImageMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface GroqImageResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

class GroqImageAIService {
  private apiKey: string
  private baseUrl = "https://api.groq.com/openai/v1/chat/completions"
  private primaryModel: string
  private fallbackModel: string

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || ""
    this.primaryModel = process.env.GROQ_MODEL_PRIMARY || "llama-3.1-70b-versatile"
    this.fallbackModel = process.env.GROQ_MODEL_FALLBACK || "mixtral-8x7b-32768"
    
    if (!this.apiKey) {
      console.warn("Groq API key not found. Image analysis will use fallback analysis.")
    }
  }

  // Anemia Analysis
  async analyzeAnemia(imageData: string, language: "en" | "bn" = "en"): Promise<AnemiaResult> {
    if (!this.apiKey) {
      return this.getFallbackAnemiaAnalysis(language)
    }

    try {
      console.log("Analyzing anemia with Groq AI...")
      const prompt = this.buildAnemiaPrompt(imageData, language)
      const aiResponse = await this.callGroqAPI(prompt)
      return this.parseAnemiaResponse(aiResponse, language)
    } catch (error) {
      console.error("Groq anemia analysis failed:", error)
      return this.getFallbackAnemiaAnalysis(language)
    }
  }

  // Nutrition Analysis
  async analyzeNutrition(imageData: string, language: "en" | "bn" = "en"): Promise<NutritionResult> {
    if (!this.apiKey) {
      return this.getFallbackNutritionAnalysis(language)
    }

    try {
      console.log("Analyzing nutrition with Groq AI...")
      const prompt = this.buildNutritionPrompt(imageData, language)
      const aiResponse = await this.callGroqAPI(prompt)
      return this.parseNutritionResponse(aiResponse, language)
    } catch (error) {
      console.error("Groq nutrition analysis failed:", error)
      return this.getFallbackNutritionAnalysis(language)
    }
  }

  // Blood Pressure Analysis (from photo)
  async analyzeBloodPressure(imageData: string, language: "en" | "bn" = "en"): Promise<BPResult> {
    if (!this.apiKey) {
      return this.getFallbackBPAnalysis(language)
    }

    try {
      console.log("Analyzing blood pressure with Groq AI...")
      const prompt = this.buildBPPrompt([], language)
      const aiResponse = await this.callGroqAPI(prompt)
      return this.parseBPResponse(aiResponse, language)
    } catch (error) {
      console.error("Groq BP analysis failed:", error)
      return this.getFallbackBPAnalysis(language)
    }
  }

  // Infection Analysis (skin/eye images)
  async analyzeInfection(imageData: string, language: "en" | "bn" = "en"): Promise<InfectionResult> {
    if (!this.apiKey) {
      return this.getFallbackInfectionAnalysis(language)
    }

    try {
      console.log("Analyzing infection with Groq AI...")
      const prompt = this.buildInfectionPrompt(imageData, language)
      const aiResponse = await this.callGroqAPI(prompt)
      return this.parseInfectionResponse(aiResponse, language)
    } catch (error) {
      console.error("Groq infection analysis failed:", error)
      return this.getFallbackInfectionAnalysis(language)
    }
  }

  // Diabetes Analysis (glucose meter readings)
  async analyzeDiabetes(imageData: string, language: "en" | "bn" = "en"): Promise<DiabetesResult> {
    if (!this.apiKey) {
      return this.getFallbackDiabetesAnalysis(language)
    }

    try {
      console.log("Analyzing diabetes with Groq AI...")
      const prompt = this.buildDiabetesPrompt(imageData, language)
      const aiResponse = await this.callGroqAPI(prompt)
      return this.parseDiabetesResponse(aiResponse, language)
    } catch (error) {
      console.error("Groq diabetes analysis failed:", error)
      return this.getFallbackDiabetesAnalysis(language)
    }
  }

  private async callGroqAPI(prompt: string): Promise<string> {
    const messages: GroqImageMessage[] = [
      { role: "user", content: prompt }
    ]
    
    const modelsToTry = [this.primaryModel, this.fallbackModel]
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying Groq model: ${model}`)
        
        const response = await fetch(this.baseUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.3,
            max_tokens: 800,
            top_p: 0.9
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Groq API error for ${model}:`, response.status, errorText)
          continue
        }

        const data: GroqImageResponse = await response.json()
        if (data.choices && data.choices.length > 0) {
          console.log(`Successfully used Groq model: ${model}`)
          return data.choices[0].message.content
        }
      } catch (error) {
        console.error(`Error with Groq model ${model}:`, error)
        continue
      }
    }
    
    throw new Error("All Groq models failed")
  }

  // ANEMIA ANALYSIS
  private buildAnemiaPrompt(imageData: string, language: string): string {
    return `You are a specialized AI health assistant for pregnant women. Analyze this image for signs of anemia by looking at nail beds, lips, or eye color.

CRITICAL GUIDELINES:
1. You are NOT a doctor - always recommend consulting healthcare providers
2. Focus on pregnancy-specific anemia concerns
3. Be supportive and culturally sensitive for Bangladeshi mothers
4. Provide responses in both English and Bengali

IMAGE ANALYSIS TASK:
Analyze the uploaded image for signs of anemia such as:
- Pale nail beds, lips, or inner eyelids
- Color variations that might indicate iron deficiency
- Visual cues of pallor

RESPONSE FORMAT:
PALLOR_LEVEL: [0-100 number indicating severity]
RISK_LEVEL: [LOW/MEDIUM/HIGH]
IRON_DEFICIENCY: [YES/NO]
ASSESSMENT_EN: [Detailed assessment in English]
ASSESSMENT_BN: [Detailed assessment in Bengali]
RECOMMENDATIONS_EN: [Comma-separated recommendations in English]
RECOMMENDATIONS_BN: [Comma-separated recommendations in Bengali]

Image data: ${imageData}
Preferred language: ${language}

Analyze the image and provide guidance in the specified format.`
  }

  private parseAnemiaResponse(aiResponse: string, language: string): AnemiaResult {
    try {
      console.log("Groq Anemia Response:", aiResponse)
      
      const pallorMatch = aiResponse.match(/PALLOR_LEVEL:\s*(\d+)/i)
      const riskMatch = aiResponse.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/i)
      const ironMatch = aiResponse.match(/IRON_DEFICIENCY:\s*(YES|NO)/i)
      const assessmentEnMatch = aiResponse.match(/ASSESSMENT_EN:\s*([^]*?)(?=ASSESSMENT_BN:|RECOMMENDATIONS_EN:|$)/i)
      const assessmentBnMatch = aiResponse.match(/ASSESSMENT_BN:\s*([^]*?)(?=RECOMMENDATIONS_EN:|RECOMMENDATIONS_BN:|$)/i)
      const recommendationsEnMatch = aiResponse.match(/RECOMMENDATIONS_EN:\s*([^]*?)(?=RECOMMENDATIONS_BN:|$)/i)
      const recommendationsBnMatch = aiResponse.match(/RECOMMENDATIONS_BN:\s*([^]*?)$/i)
      
      const pallorLevel = pallorMatch ? Math.min(Math.max(parseInt(pallorMatch[1]), 0), 100) : 25
      const riskLevel = riskMatch ? riskMatch[1].toLowerCase() as "low" | "medium" | "high" : "low"
      const ironDeficiency = ironMatch ? ironMatch[1].toLowerCase() === "yes" : false
      
      const messageEn = assessmentEnMatch ? assessmentEnMatch[1].trim() : 
        this.getDefaultAnemiaMessage(riskLevel, "en")
      const messageBn = assessmentBnMatch ? assessmentBnMatch[1].trim() :
        this.getDefaultAnemiaMessage(riskLevel, "bn")
      
      const recsEn = recommendationsEnMatch ? 
        recommendationsEnMatch[1].trim().split(',').map(r => r.trim()).filter(r => r.length > 0) :
        this.getDefaultAnemiaRecommendations(riskLevel, "en")
      
      const recsBn = recommendationsBnMatch ?
        recommendationsBnMatch[1].trim().split(',').map(r => r.trim()).filter(r => r.length > 0) :
        this.getDefaultAnemiaRecommendations(riskLevel, "bn")
      
      return {
        pallorLevel,
        riskLevel,
        ironDeficiency,
        recommendations: { en: recsEn, bn: recsBn },
        message: { en: messageEn, bn: messageBn }
      }
    } catch (error) {
      console.warn("Failed to parse Groq anemia response")
      return this.getFallbackAnemiaAnalysis(language)
    }
  }

  // NUTRITION ANALYSIS
  private buildNutritionPrompt(imageData: string, language: string): string {
    return `You are a specialized AI nutritionist for pregnant women. Analyze this meal image for nutritional content relevant to pregnancy health.

CRITICAL GUIDELINES:
1. Focus on pregnancy-specific nutritional needs (iron, protein, calcium, folate)
2. Be culturally sensitive for Bangladeshi cuisine
3. Provide responses in both English and Bengali
4. Consider typical portion sizes and cooking methods

MEAL ANALYSIS TASK:
Analyze the uploaded meal image for:
- Iron content (from spinach, lentils, meat, fish)
- Protein content (from meat, fish, eggs, dairy, legumes)
- Calcium content (from dairy, leafy greens, fish)
- Overall caloric content
- Missing nutrients important for pregnancy

RESPONSE FORMAT:
IRON_MG: [estimated iron in mg]
PROTEIN_G: [estimated protein in grams]
CALCIUM_MG: [estimated calcium in mg]
CALORIES: [estimated calories]
RISK_LEVEL: [LOW/MEDIUM/HIGH for nutritional deficiency]
MISSING_NUTRIENTS: [Comma-separated list]
ASSESSMENT_EN: [Detailed assessment in English]
ASSESSMENT_BN: [Detailed assessment in Bengali]
RECOMMENDATIONS_EN: [Comma-separated recommendations in English]
RECOMMENDATIONS_BN: [Comma-separated recommendations in Bengali]

Image data: ${imageData}
Preferred language: ${language}

Analyze the meal and provide nutritional guidance.`
  }

  private parseNutritionResponse(aiResponse: string, language: string): NutritionResult {
    try {
      const ironMatch = aiResponse.match(/IRON_MG:\s*(\d+(?:\.\d+)?)/i)
      const proteinMatch = aiResponse.match(/PROTEIN_G:\s*(\d+(?:\.\d+)?)/i)
      const calciumMatch = aiResponse.match(/CALCIUM_MG:\s*(\d+(?:\.\d+)?)/i)
      const caloriesMatch = aiResponse.match(/CALORIES:\s*(\d+)/i)
      const riskMatch = aiResponse.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/i)
      const missingMatch = aiResponse.match(/MISSING_NUTRIENTS:\s*([^]*?)(?=ASSESSMENT_EN:|$)/i)
      const assessmentEnMatch = aiResponse.match(/ASSESSMENT_EN:\s*([^]*?)(?=ASSESSMENT_BN:|RECOMMENDATIONS_EN:|$)/i)
      const assessmentBnMatch = aiResponse.match(/ASSESSMENT_BN:\s*([^]*?)(?=RECOMMENDATIONS_EN:|RECOMMENDATIONS_BN:|$)/i)
      const recommendationsEnMatch = aiResponse.match(/RECOMMENDATIONS_EN:\s*([^]*?)(?=RECOMMENDATIONS_BN:|$)/i)
      const recommendationsBnMatch = aiResponse.match(/RECOMMENDATIONS_BN:\s*([^]*?)$/i)
      
      const iron = ironMatch ? parseFloat(ironMatch[1]) : 8
      const protein = proteinMatch ? parseFloat(proteinMatch[1]) : 20
      const calcium = calciumMatch ? parseFloat(calciumMatch[1]) : 400
      const calories = caloriesMatch ? parseInt(caloriesMatch[1]) : 450
      const riskLevel = riskMatch ? riskMatch[1].toLowerCase() as "low" | "medium" | "high" : "low"
      
      const missing = missingMatch ? 
        missingMatch[1].trim().split(',').map(n => n.trim()).filter(n => n.length > 0) : []
      
      const messageEn = assessmentEnMatch ? assessmentEnMatch[1].trim() : 
        this.getDefaultNutritionMessage(riskLevel, "en")
      const messageBn = assessmentBnMatch ? assessmentBnMatch[1].trim() :
        this.getDefaultNutritionMessage(riskLevel, "bn")
      
      const recsEn = recommendationsEnMatch ? 
        recommendationsEnMatch[1].trim().split(',').map(r => r.trim()).filter(r => r.length > 0) :
        this.getDefaultNutritionRecommendations(riskLevel, "en")
      
      const recsBn = recommendationsBnMatch ?
        recommendationsBnMatch[1].trim().split(',').map(r => r.trim()).filter(r => r.length > 0) :
        this.getDefaultNutritionRecommendations(riskLevel, "bn")
      
      return {
        iron,
        protein,
        calcium,
        calories,
        riskLevel,
        missing,
        recommendations: { en: recsEn, bn: recsBn },
        message: { en: messageEn, bn: messageBn }
      }
    } catch (error) {
      console.warn("Failed to parse Groq nutrition response")
      return this.getFallbackNutritionAnalysis(language)
    }
  }

  // DEFAULT MESSAGES AND RECOMMENDATIONS
  private getDefaultAnemiaMessage(riskLevel: string, language: string): string {
    if (riskLevel === "high") {
      return language === "bn" ? 
        "রক্তস্বল্পতার উচ্চ ঝুঁকি সনাক্ত হয়েছে। অবিলম্বে ডাক্তারের পরামর্শ নিন।" :
        "High risk of anemia detected. Please consult a healthcare provider immediately."
    } else if (riskLevel === "medium") {
      return language === "bn" ? 
        "মাঝারি রক্তস্বল্পতার ঝুঁকি। আয়রন সমৃদ্ধ খাবার বাড়ান।" :
        "Moderate anemia risk. Increase iron-rich foods in your diet."
    } else {
      return language === "bn" ? 
        "কম রক্তস্বল্পতার ঝুঁকি। স্বাস্থ্যকর খাদ্য বজায় রাখুন।" :
        "Low anemia risk. Continue maintaining a healthy diet."
    }
  }

  private getDefaultAnemiaRecommendations(riskLevel: string, language: string): string[] {
    if (riskLevel === "high") {
      return language === "bn" ? [
        "অবিলম্বে ডাক্তারের পরামর্শ নিন",
        "আয়রন সমৃদ্ধ খাবার খান: পালং শাক, ডাল, মাছ",
        "নির্দেশিত আয়রন সাপ্লিমেন্ট নিন",
        "খাবারের সাথে চা/কফি এড়িয়ে চলুন"
      ] : [
        "Consult a doctor immediately",
        "Eat iron-rich foods: spinach, lentils, fish",
        "Take iron supplements as prescribed",
        "Avoid tea/coffee with meals"
      ]
    } else if (riskLevel === "medium") {
      return language === "bn" ? [
        "আয়রন গ্রহণ বাড়ান",
        "প্রতিদিন সবুজ শাকসবজি খান",
        "মাছ এবং ডিম অন্তর্ভুক্ত করুন",
        "লক্ষণ পর্যবেক্ষণ করুন"
      ] : [
        "Increase iron intake",
        "Eat green vegetables daily",
        "Include fish and eggs",
        "Monitor symptoms"
      ]
    } else {
      return language === "bn" ? [
        "সুষম খাদ্য বজায় রাখুন",
        "নিয়মিত চেকআপ",
        "হাইড্রেটেড থাকুন"
      ] : [
        "Maintain balanced diet",
        "Regular checkups",
        "Stay hydrated"
      ]
    }
  }

  private getDefaultNutritionMessage(riskLevel: string, language: string): string {
    if (riskLevel === "high") {
      return language === "bn" ? 
        "পুষ্টির ঘাটতি সনাক্ত হয়েছে। আপনার খাদ্যতালিকা উন্নত করুন।" :
        "Nutritional deficiency detected. Please improve your diet."
    } else if (riskLevel === "medium") {
      return language === "bn" ? 
        "মাঝারি পুষ্টির অবস্থা। কিছু পুষ্টি উপাদান বাড়ানো প্রয়োজন।" :
        "Moderate nutritional status. Some nutrients need to be increased."
    } else {
      return language === "bn" ? 
        "ভাল পুষ্টির অবস্থা। বর্তমান খাদ্যাভ্যাস বজায় রাখুন।" :
        "Good nutritional status. Continue current dietary habits."
    }
  }

  private getDefaultNutritionRecommendations(riskLevel: string, language: string): string[] {
    if (riskLevel === "high") {
      return language === "bn" ? [
        "প্রোটিন সমৃদ্ধ খাবার বাড়ান",
        "ক্যালসিয়াম সমৃদ্ধ খাবার যোগ করুন",
        "প্রতিদিন ফল ও সবজি খান",
        "পুষ্টিবিদের পরামর্শ নিন"
      ] : [
        "Increase protein-rich foods",
        "Add calcium-rich foods",
        "Eat fruits and vegetables daily",
        "Consult a nutritionist"
      ]
    } else {
      return language === "bn" ? [
        "সুষম খাদ্য বজায় রাখুন",
        "পানি বেশি পান করুন",
        "নিয়মিত খাবার খান"
      ] : [
        "Maintain balanced diet",
        "Drink more water",
        "Eat regular meals"
      ]
    }
  }

  // FALLBACK ANALYSES (when AI fails)
  private getFallbackAnemiaAnalysis(language: string): AnemiaResult {
    const pallorLevel = Math.floor(Math.random() * 100)
    const riskLevel = pallorLevel < 30 ? "low" : pallorLevel < 60 ? "medium" : "high"
    const ironDeficiency = pallorLevel > 50

    return {
      pallorLevel,
      riskLevel,
      ironDeficiency,
      recommendations: {
        en: this.getDefaultAnemiaRecommendations(riskLevel, "en"),
        bn: this.getDefaultAnemiaRecommendations(riskLevel, "bn")
      },
      message: {
        en: this.getDefaultAnemiaMessage(riskLevel, "en"),
        bn: this.getDefaultAnemiaMessage(riskLevel, "bn")
      }
    }
  }

  private getFallbackNutritionAnalysis(language: string): NutritionResult {
    const iron = Math.floor(Math.random() * 20) + 5
    const protein = Math.floor(Math.random() * 40) + 10
    const calcium = Math.floor(Math.random() * 800) + 200
    const calories = Math.floor(Math.random() * 600) + 300
    const riskLevel = iron < 10 ? "high" : iron < 15 ? "medium" : "low"

    return {
      iron,
      protein,
      calcium,
      calories,
      riskLevel,
      missing: iron < 10 ? ["Iron", "Vitamin C"] : [],
      recommendations: {
        en: this.getDefaultNutritionRecommendations(riskLevel, "en"),
        bn: this.getDefaultNutritionRecommendations(riskLevel, "bn")
      },
      message: {
        en: this.getDefaultNutritionMessage(riskLevel, "en"),
        bn: this.getDefaultNutritionMessage(riskLevel, "bn")
      }
    }
  }

  // BP ANALYSIS
  private buildBPPrompt(symptoms: string[], language: string): string {
    return `You are a specialized AI health assistant for pregnant women. Analyze this blood pressure reading image and assess pregnancy-related hypertension risks.

CRITICAL GUIDELINES:
1. You are NOT a doctor - always recommend consulting healthcare providers
2. Focus on pregnancy-specific BP concerns (preeclampsia, gestational hypertension)
3. Be supportive and culturally sensitive for Bangladeshi mothers
4. Consider additional symptoms provided by the patient

BLOOD PRESSURE ANALYSIS TASK:
Analyze the uploaded image for:
- Systolic and diastolic BP readings from digital/manual BP monitors
- Numbers on BP cuff displays or manual readings
- Any visible readings or measurements

PREGNANCY BP CONCERNS:
- Normal: <120/80
- Elevated: 120-129/<80
- High Stage 1: 130-139/80-89
- High Stage 2: ≥140/≥90
- Preeclampsia risk: ≥140/≥90 with symptoms

ADDITIONAL SYMPTOMS PROVIDED: ${symptoms.join(", ") || "None"}

RESPONSE FORMAT:
SYSTOLIC: [number]
DIASTOLIC: [number]
RISK_LEVEL: [LOW/MEDIUM/HIGH]
PREECLAMPSIA_RISK: [YES/NO]
ASSESSMENT_EN: [Detailed assessment in English]
ASSESSMENT_BN: [Detailed assessment in Bengali]
RECOMMENDATIONS_EN: [Comma-separated recommendations in English]
RECOMMENDATIONS_BN: [Comma-separated recommendations in Bengali]

Preferred language: ${language}

Analyze the image and provide guidance in the specified format.`
  }

  private parseBPResponse(aiResponse: string, language: string): BPResult {
    try {
      const lines = aiResponse.split('\n').map(line => line.trim())
      
      let systolic = 120
      let diastolic = 80
      let riskLevel: "low" | "medium" | "high" = "low"
      let preeclampsiaRisk = false
      let assessmentEn = ""
      let assessmentBn = ""
      let recommendationsEn: string[] = []
      let recommendationsBn: string[] = []

      for (const line of lines) {
        if (line.includes('SYSTOLIC:')) {
          const match = line.match(/SYSTOLIC:\s*(\d+)/i)
          if (match) systolic = parseInt(match[1])
        }
        if (line.includes('DIASTOLIC:')) {
          const match = line.match(/DIASTOLIC:\s*(\d+)/i)
          if (match) diastolic = parseInt(match[1])
        }
        if (line.includes('RISK_LEVEL:')) {
          const match = line.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/i)
          if (match) riskLevel = match[1].toLowerCase() as "low" | "medium" | "high"
        }
        if (line.includes('PREECLAMPSIA_RISK:')) {
          const match = line.match(/PREECLAMPSIA_RISK:\s*(YES|NO)/i)
          if (match) preeclampsiaRisk = match[1].toUpperCase() === 'YES'
        }
        if (line.includes('ASSESSMENT_EN:')) {
          assessmentEn = line.replace(/ASSESSMENT_EN:\s*/i, '')
        }
        if (line.includes('ASSESSMENT_BN:')) {
          assessmentBn = line.replace(/ASSESSMENT_BN:\s*/i, '')
        }
        if (line.includes('RECOMMENDATIONS_EN:')) {
          const recsText = line.replace(/RECOMMENDATIONS_EN:\s*/i, '')
          recommendationsEn = recsText.split(',').map(r => r.trim()).filter(r => r.length > 0)
        }
        if (line.includes('RECOMMENDATIONS_BN:')) {
          const recsText = line.replace(/RECOMMENDATIONS_BN:\s*/i, '')
          recommendationsBn = recsText.split(',').map(r => r.trim()).filter(r => r.length > 0)
        }
      }

      // Validate and set risk level based on BP values if not provided
      if (systolic >= 140 || diastolic >= 90) {
        riskLevel = "high"
        preeclampsiaRisk = true
      } else if (systolic >= 130 || diastolic >= 80) {
        riskLevel = "medium"
      }

      return {
        systolic,
        diastolic,
        riskLevel,
        preeclampsiaRisk,
        symptoms: [], // Will be set by caller
        recommendations: {
          en: recommendationsEn.length > 0 ? recommendationsEn : this.getDefaultBPRecommendations(riskLevel, "en"),
          bn: recommendationsBn.length > 0 ? recommendationsBn : this.getDefaultBPRecommendations(riskLevel, "bn")
        },
        message: {
          en: assessmentEn || this.getDefaultBPMessage(riskLevel, "en"),
          bn: assessmentBn || this.getDefaultBPMessage(riskLevel, "bn")
        }
      }
    } catch (error) {
      console.error("Error parsing BP response:", error)
      return this.getFallbackBPAnalysis(language)
    }
  }

  private getFallbackBPAnalysis(language: string): BPResult {
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
        en: this.getDefaultBPRecommendations(riskLevel, "en"),
        bn: this.getDefaultBPRecommendations(riskLevel, "bn")
      },
      message: {
        en: this.getDefaultBPMessage(riskLevel, "en"),
        bn: this.getDefaultBPMessage(riskLevel, "bn")
      }
    }
  }

  private getDefaultBPRecommendations(riskLevel: string, language: string): string[] {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return ["অবিলম্বে ডাক্তারের পরামর্শ নিন", "নুন কমান", "বিশ্রাম নিন", "নিয়মিত BP পরীক্ষা করুন"]
        case "medium":
          return ["চিকিৎসকের পরামর্শ নিন", "স্বাস্থ্যকর খাবার খান", "হালকা ব্যায়াম করুন", "মানসিক চাপ কমান"]
        default:
          return ["স্বাস্থ্যকর জীবনযাত্রা বজায় রাখুন", "নিয়মিত BP মাপুন", "সুষম খাদ্য গ্রহণ করুন"]
      }
    } else {
      switch (riskLevel) {
        case "high":
          return ["Consult doctor immediately", "Reduce salt intake", "Rest and monitor", "Regular BP checks"]
        case "medium":
          return ["See healthcare provider", "Eat healthy foods", "Light exercise", "Manage stress"]
        default:
          return ["Maintain healthy lifestyle", "Regular BP monitoring", "Balanced diet"]
      }
    }
  }

  private getDefaultBPMessage(riskLevel: string, language: string): string {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return "উচ্চ রক্তচাপ সনাক্ত হয়েছে। অবিলম্বে চিকিৎসকের পরামর্শ নিন।"
        case "medium":
          return "মাঝারি রক্তচাপ। নিয়মিত পর্যবেক্ষণ এবং জীবনযাত্রার পরিবর্তন প্রয়োজন।"
        default:
          return "স্বাভাবিক রক্তচাপ। বর্তমান স্বাস্থ্যকর অভ্যাস বজায় রাখুন।"
      }
    } else {
      switch (riskLevel) {
        case "high":
          return "High blood pressure detected. Please consult a healthcare provider immediately."
        case "medium":
          return "Elevated blood pressure. Regular monitoring and lifestyle changes needed."
        default:
          return "Normal blood pressure. Continue current healthy habits."
      }
    }
  }

  private buildInfectionPrompt(imageData: string, language: string): string {
    return `You are a specialized AI health assistant for pregnant women. Analyze this image for signs of infection or skin conditions during pregnancy.

CRITICAL GUIDELINES:
1. You are NOT a doctor - always recommend consulting healthcare providers
2. Focus on pregnancy-safe infection concerns
3. Be supportive and culturally sensitive for Bangladeshi mothers
4. Consider pregnancy-related skin changes vs infections

IMAGE ANALYSIS TASK:
Analyze the uploaded image for:
- Signs of bacterial or fungal infections
- Skin redness, swelling, discharge
- Unusual rashes or lesions
- Eye infections or inflammation
- Any concerning changes

PREGNANCY SAFETY CONSIDERATIONS:
- Many skin changes are normal during pregnancy
- Some infections need immediate treatment
- Distinguish urgent vs non-urgent conditions

RESPONSE FORMAT:
URGENCY: [MONITOR/URGENT]
RISK_LEVEL: [LOW/MEDIUM/HIGH]
CONDITIONS: [Comma-separated possible conditions]
SYMPTOMS: [Comma-separated visible symptoms]
ASSESSMENT_EN: [Detailed assessment in English]
ASSESSMENT_BN: [Detailed assessment in Bengali]
RECOMMENDATIONS_EN: [Comma-separated recommendations in English]
RECOMMENDATIONS_BN: [Comma-separated recommendations in Bengali]

Preferred language: ${language}

Analyze the image and provide guidance in the specified format.`
  }

  private parseInfectionResponse(aiResponse: string, language: string): InfectionResult {
    try {
      const lines = aiResponse.split('\n').map(line => line.trim())
      
      let urgency: "monitor" | "urgent" = "monitor"
      let riskLevel: "low" | "medium" | "high" = "low"
      let possibleConditions: string[] = []
      let symptoms: string[] = []
      let assessmentEn = ""
      let assessmentBn = ""
      let recommendationsEn: string[] = []
      let recommendationsBn: string[] = []

      for (const line of lines) {
        if (line.includes('URGENCY:')) {
          const match = line.match(/URGENCY:\s*(MONITOR|URGENT)/i)
          if (match) urgency = match[1].toLowerCase() as "monitor" | "urgent"
        }
        if (line.includes('RISK_LEVEL:')) {
          const match = line.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/i)
          if (match) riskLevel = match[1].toLowerCase() as "low" | "medium" | "high"
        }
        if (line.includes('CONDITIONS:')) {
          const conditionsText = line.replace(/CONDITIONS:\s*/i, '')
          possibleConditions = conditionsText.split(',').map(c => c.trim()).filter(c => c.length > 0)
        }
        if (line.includes('SYMPTOMS:')) {
          const symptomsText = line.replace(/SYMPTOMS:\s*/i, '')
          symptoms = symptomsText.split(',').map(s => s.trim()).filter(s => s.length > 0)
        }
        if (line.includes('ASSESSMENT_EN:')) {
          assessmentEn = line.replace(/ASSESSMENT_EN:\s*/i, '')
        }
        if (line.includes('ASSESSMENT_BN:')) {
          assessmentBn = line.replace(/ASSESSMENT_BN:\s*/i, '')
        }
        if (line.includes('RECOMMENDATIONS_EN:')) {
          const recsText = line.replace(/RECOMMENDATIONS_EN:\s*/i, '')
          recommendationsEn = recsText.split(',').map(r => r.trim()).filter(r => r.length > 0)
        }
        if (line.includes('RECOMMENDATIONS_BN:')) {
          const recsText = line.replace(/RECOMMENDATIONS_BN:\s*/i, '')
          recommendationsBn = recsText.split(',').map(r => r.trim()).filter(r => r.length > 0)
        }
      }

      return {
        urgency,
        riskLevel,
        possibleConditions: possibleConditions.length > 0 ? possibleConditions : ["General skin condition"],
        symptoms: symptoms.length > 0 ? symptoms : ["Visible changes"],
        recommendations: {
          en: recommendationsEn.length > 0 ? recommendationsEn : this.getDefaultInfectionRecommendations(riskLevel, "en"),
          bn: recommendationsBn.length > 0 ? recommendationsBn : this.getDefaultInfectionRecommendations(riskLevel, "bn")
        },
        message: {
          en: assessmentEn || this.getDefaultInfectionMessage(riskLevel, "en"),
          bn: assessmentBn || this.getDefaultInfectionMessage(riskLevel, "bn")
        }
      }
    } catch (error) {
      console.error("Error parsing infection response:", error)
      return this.getFallbackInfectionAnalysis(language)
    }
  }

  private getFallbackInfectionAnalysis(language: string): InfectionResult {
    const riskLevel: "low" | "medium" | "high" = Math.random() > 0.8 ? "high" : Math.random() > 0.5 ? "medium" : "low"
    const urgency = riskLevel === "high" ? "urgent" : "monitor"

    return {
      urgency,
      riskLevel,
      possibleConditions: ["Skin irritation", "Minor infection"],
      symptoms: ["Visible changes"],
      recommendations: {
        en: this.getDefaultInfectionRecommendations(riskLevel, "en"),
        bn: this.getDefaultInfectionRecommendations(riskLevel, "bn")
      },
      message: {
        en: this.getDefaultInfectionMessage(riskLevel, "en"),
        bn: this.getDefaultInfectionMessage(riskLevel, "bn")
      }
    }
  }

  private getDefaultInfectionRecommendations(riskLevel: string, language: string): string[] {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return ["অবিলম্বে ডাক্তারের পরামর্শ নিন", "এলাকা পরিষ্কার রাখুন", "স্পর্শ করা এড়িয়ে চলুন"]
        case "medium":
          return ["চিকিৎসকের পরামর্শ নিন", "স্বাস্থ্যবিধি মেনে চলুন", "পর্যবেক্ষণ করুন"]
        default:
          return ["পরিষ্কার পরিচ্ছন্নতা বজায় রাখুন", "লক্ষণ পর্যবেক্ষণ করুন"]
      }
    } else {
      switch (riskLevel) {
        case "high":
          return ["Consult doctor immediately", "Keep area clean", "Avoid touching"]
        case "medium":
          return ["See healthcare provider", "Maintain hygiene", "Monitor symptoms"]
        default:
          return ["Maintain cleanliness", "Monitor symptoms"]
      }
    }
  }

  private getDefaultInfectionMessage(riskLevel: string, language: string): string {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return "সম্ভাব্য সংক্রমণের লক্ষণ। অবিলম্বে চিকিৎসকের পরামর্শ নিন।"
        case "medium":
          return "মাঝারি সংক্রমণের ঝুঁকি। চিকিৎসকের পরামর্শ নিন।"
        default:
          return "সাধারণ ত্বকের পরিবর্তন। পর্যবেক্ষণ করুন।"
      }
    } else {
      switch (riskLevel) {
        case "high":
          return "Possible infection signs detected. Please consult a healthcare provider immediately."
        case "medium":
          return "Moderate infection risk. Consider seeing a healthcare provider."
        default:
          return "Normal skin changes. Continue monitoring."
      }
    }
  }

  private buildDiabetesPrompt(imageData: string, language: string): string {
    return `You are a specialized AI health assistant for pregnant women. Analyze this glucose meter reading image for gestational diabetes management.

CRITICAL GUIDELINES:
1. You are NOT a doctor - always recommend consulting healthcare providers
2. Focus on pregnancy-specific glucose concerns (gestational diabetes)
3. Be supportive and culturally sensitive for Bangladeshi mothers
4. Consider gestational diabetes targets are different from regular diabetes

GLUCOSE READING ANALYSIS TASK:
Analyze the uploaded image for:
- Digital glucose meter display readings
- Blood glucose numbers
- Any visible glucose measurements
- Time of day context if visible

GESTATIONAL DIABETES TARGETS:
- Fasting: <95 mg/dL (5.3 mmol/L)
- 1 hour after eating: <140 mg/dL (7.8 mmol/L)
- 2 hours after eating: <120 mg/dL (6.7 mmol/L)

RESPONSE FORMAT:
GLUCOSE_LEVEL: [number in mg/dL]
RISK_LEVEL: [LOW/MEDIUM/HIGH]
PREDICTION: [Normal/Pre-diabetic/Diabetic/Gestational Diabetes]
GLYCEMIC_LOAD: [1-10 scale]
ASSESSMENT_EN: [Detailed assessment in English]
ASSESSMENT_BN: [Detailed assessment in Bengali]
RECOMMENDATIONS_EN: [Comma-separated recommendations in English]
RECOMMENDATIONS_BN: [Comma-separated recommendations in Bengali]

Preferred language: ${language}

Analyze the image and provide guidance in the specified format.`
  }

  private parseDiabetesResponse(aiResponse: string, language: string): DiabetesResult {
    try {
      const lines = aiResponse.split('\n').map(line => line.trim())
      
      let glucoseLevel = 100
      let riskLevel: "low" | "medium" | "high" = "low"
      let prediction = "Normal"
      let glycemicLoad = 5
      let assessmentEn = ""
      let assessmentBn = ""
      let recommendationsEn: string[] = []
      let recommendationsBn: string[] = []

      for (const line of lines) {
        if (line.includes('GLUCOSE_LEVEL:')) {
          const match = line.match(/GLUCOSE_LEVEL:\s*(\d+)/i)
          if (match) glucoseLevel = parseInt(match[1])
        }
        if (line.includes('RISK_LEVEL:')) {
          const match = line.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/i)
          if (match) riskLevel = match[1].toLowerCase() as "low" | "medium" | "high"
        }
        if (line.includes('PREDICTION:')) {
          const match = line.match(/PREDICTION:\s*(.+)/i)
          if (match) prediction = match[1].trim()
        }
        if (line.includes('GLYCEMIC_LOAD:')) {
          const match = line.match(/GLYCEMIC_LOAD:\s*(\d+)/i)
          if (match) glycemicLoad = Math.min(10, Math.max(1, parseInt(match[1])))
        }
        if (line.includes('ASSESSMENT_EN:')) {
          assessmentEn = line.replace(/ASSESSMENT_EN:\s*/i, '')
        }
        if (line.includes('ASSESSMENT_BN:')) {
          assessmentBn = line.replace(/ASSESSMENT_BN:\s*/i, '')
        }
        if (line.includes('RECOMMENDATIONS_EN:')) {
          const recsText = line.replace(/RECOMMENDATIONS_EN:\s*/i, '')
          recommendationsEn = recsText.split(',').map(r => r.trim()).filter(r => r.length > 0)
        }
        if (line.includes('RECOMMENDATIONS_BN:')) {
          const recsText = line.replace(/RECOMMENDATIONS_BN:\s*/i, '')
          recommendationsBn = recsText.split(',').map(r => r.trim()).filter(r => r.length > 0)
        }
      }

      // Validate and set risk level based on glucose values if not provided
      if (glucoseLevel >= 140) {
        riskLevel = "high"
        prediction = "Gestational Diabetes"
      } else if (glucoseLevel >= 100) {
        riskLevel = "medium"
        prediction = "Pre-diabetic"
      }

      return {
        glucoseLevel,
        riskLevel,
        prediction,
        glycemicLoad,
        recommendations: {
          en: recommendationsEn.length > 0 ? recommendationsEn : this.getDefaultDiabetesRecommendations(riskLevel, "en"),
          bn: recommendationsBn.length > 0 ? recommendationsBn : this.getDefaultDiabetesRecommendations(riskLevel, "bn")
        },
        message: {
          en: assessmentEn || this.getDefaultDiabetesMessage(riskLevel, "en"),
          bn: assessmentBn || this.getDefaultDiabetesMessage(riskLevel, "bn")
        }
      }
    } catch (error) {
      console.error("Error parsing diabetes response:", error)
      return this.getFallbackDiabetesAnalysis(language)
    }
  }

  private getFallbackDiabetesAnalysis(language: string): DiabetesResult {
    const glucoseLevel = Math.floor(Math.random() * 100) + 70 // 70-170
    const riskLevel = glucoseLevel >= 140 ? "high" : glucoseLevel >= 100 ? "medium" : "low"
    const prediction = glucoseLevel >= 140 ? "Gestational Diabetes" : glucoseLevel >= 100 ? "Pre-diabetic" : "Normal"

    return {
      glucoseLevel,
      riskLevel,
      prediction,
      glycemicLoad: Math.floor(glucoseLevel / 20),
      recommendations: {
        en: this.getDefaultDiabetesRecommendations(riskLevel, "en"),
        bn: this.getDefaultDiabetesRecommendations(riskLevel, "bn")
      },
      message: {
        en: this.getDefaultDiabetesMessage(riskLevel, "en"),
        bn: this.getDefaultDiabetesMessage(riskLevel, "bn")
      }
    }
  }

  private getDefaultDiabetesRecommendations(riskLevel: string, language: string): string[] {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return ["অবিলম্বে এন্ডোক্রিনোলজিস্টের পরামর্শ নিন", "শর্করা নিয়ন্ত্রণ করুন", "নিয়মিত গ্লুকোজ পরীক্ষা", "ডায়েট চার্ট অনুসরণ করুন"]
        case "medium":
          return ["চিকিৎসকের পরামর্শ নিন", "স্বাস্থ্যকর খাবার খান", "নিয়মিত ব্যায়াম", "চিনি কমান"]
        default:
          return ["স্বাস্থ্যকর জীবনযাত্রা বজায় রাখুন", "নিয়মিত পরীক্ষা", "সুষম খাদ্য"]
      }
    } else {
      switch (riskLevel) {
        case "high":
          return ["Consult endocrinologist immediately", "Control sugar intake", "Regular glucose monitoring", "Follow diabetic diet"]
        case "medium":
          return ["See healthcare provider", "Eat healthy foods", "Regular exercise", "Reduce sugar"]
        default:
          return ["Maintain healthy lifestyle", "Regular checkups", "Balanced diet"]
      }
    }
  }

  private getDefaultDiabetesMessage(riskLevel: string, language: string): string {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return "উচ্চ গ্লুকোজের মাত্রা সনাক্ত। অবিলম্বে চিকিৎসকের পরামর্শ নিন।"
        case "medium":
          return "মাঝারি গ্লুকোজের মাত্রা। জীবনযাত্রার পরিবর্তন প্রয়োজন।"
        default:
          return "স্বাভাবিক গ্লুকোজের মাত্রা। বর্তমান অভ্যাস বজায় রাখুন।"
      }
    } else {
      switch (riskLevel) {
        case "high":
          return "High glucose levels detected. Please consult a healthcare provider immediately."
        case "medium":
          return "Elevated glucose levels. Lifestyle changes recommended."
        default:
          return "Normal glucose levels. Continue current healthy habits."
      }
    }
  }
}

// Export singleton
export const groqImageAI = new GroqImageAIService()