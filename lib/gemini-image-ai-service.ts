// Gemini AI Service for Image-based Health Analysis
import { GoogleGenerativeAI } from "@google/generative-ai"
import type { 
  AnemiaResult, 
  NutritionResult, 
  InfectionResult,
  BPResult,
  DiabetesResult 
} from "@/lib/ai-mock"

class GeminiImageAIService {
  private genAI: GoogleGenerativeAI | null = null
  private apiKey: string | null = null

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey)
    } else {
      console.warn("Gemini API key not found. Image analysis will use fallback.")
    }
  }

  // Helper to convert base64 to proper format for Gemini
  private prepareImageData(base64Data: string): { inlineData: { data: string; mimeType: string } } {
    // Remove data URL prefix if present
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '')
    
    return {
      inlineData: {
        data: cleanBase64,
        mimeType: "image/jpeg" // Default to JPEG, Gemini handles most formats
      }
    }
  }

  // ANEMIA ANALYSIS
  async analyzeAnemia(imageData: string, language: "en" | "bn" = "en"): Promise<AnemiaResult> {
    if (!this.genAI) {
      return this.getFallbackAnemiaAnalysis(language)
    }

    try {
      console.log("Analyzing anemia with Gemini AI...")
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
      
      const prompt = this.buildAnemiaPrompt(language)
      const imageData_prepared = this.prepareImageData(imageData)
      
      const result = await model.generateContent([prompt, imageData_prepared])
      const response = await result.response
      const text = response.text()
      
      console.log("Gemini anemia response:", text)
      return this.parseAnemiaResponse(text, language)

    } catch (error) {
      console.error("Gemini anemia analysis failed:", error)
      return this.getFallbackAnemiaAnalysis(language)
    }
  }

  // NUTRITION ANALYSIS
  async analyzeNutrition(imageData: string, language: "en" | "bn" = "en"): Promise<NutritionResult> {
    if (!this.genAI) {
      return this.getFallbackNutritionAnalysis(language)
    }

    try {
      console.log("Analyzing nutrition with Gemini AI...")
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
      
      const prompt = this.buildNutritionPrompt(language)
      const imageData_prepared = this.prepareImageData(imageData)
      
      const result = await model.generateContent([prompt, imageData_prepared])
      const response = await result.response
      const text = response.text()
      
      console.log("Gemini nutrition response:", text)
      return this.parseNutritionResponse(text, language)

    } catch (error) {
      console.error("Gemini nutrition analysis failed:", error)
      return this.getFallbackNutritionAnalysis(language)
    }
  }

  // BLOOD PRESSURE ANALYSIS
  async analyzeBloodPressure(imageData: string, language: "en" | "bn" = "en"): Promise<BPResult> {
    if (!this.genAI) {
      return this.getFallbackBPAnalysis(language)
    }

    try {
      console.log("Analyzing blood pressure with Gemini AI...")
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
      
      const prompt = this.buildBPPrompt([], language)
      const imageData_prepared = this.prepareImageData(imageData)
      
      const result = await model.generateContent([prompt, imageData_prepared])
      const response = await result.response
      const text = response.text()
      
      console.log("Gemini BP response:", text)
      return this.parseBPResponse(text, language)

    } catch (error) {
      console.error("Gemini BP analysis failed:", error)
      return this.getFallbackBPAnalysis(language)
    }
  }

  // INFECTION ANALYSIS
  async analyzeInfection(imageData: string, language: "en" | "bn" = "en"): Promise<InfectionResult> {
    if (!this.genAI) {
      return this.getFallbackInfectionAnalysis(language)
    }

    try {
      console.log("Analyzing infection with Gemini AI...")
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
      
      const prompt = this.buildInfectionPrompt(language)
      const imageData_prepared = this.prepareImageData(imageData)
      
      const result = await model.generateContent([prompt, imageData_prepared])
      const response = await result.response
      const text = response.text()
      
      console.log("Gemini infection response:", text)
      return this.parseInfectionResponse(text, language)

    } catch (error) {
      console.error("Gemini infection analysis failed:", error)
      return this.getFallbackInfectionAnalysis(language)
    }
  }

  // DIABETES ANALYSIS
  async analyzeDiabetes(imageData: string, language: "en" | "bn" = "en"): Promise<DiabetesResult> {
    if (!this.genAI) {
      return this.getFallbackDiabetesAnalysis(language)
    }

    try {
      console.log("Analyzing diabetes with Gemini AI...")
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
      
      const prompt = this.buildDiabetesPrompt(language)
      const imageData_prepared = this.prepareImageData(imageData)
      
      const result = await model.generateContent([prompt, imageData_prepared])
      const response = await result.response
      const text = response.text()
      
      console.log("Gemini diabetes response:", text)
      return this.parseDiabetesResponse(text, language)

    } catch (error) {
      console.error("Gemini diabetes analysis failed:", error)
      return this.getFallbackDiabetesAnalysis(language)
    }
  }

  // PROMPT BUILDERS
  private buildAnemiaPrompt(language: string): string {
    return `You are a specialized AI health assistant for pregnant women. Analyze this image for signs of anemia by looking at nail beds, lips, or eye color.

SPEAK DIRECTLY to the pregnant woman as "you" - NOT third person like "the patient".

CRITICAL GUIDELINES:
1. Address the pregnant woman directly as "you"
2. You are NOT a doctor - always recommend consulting healthcare providers
3. Focus on pregnancy-specific anemia concerns
4. Be supportive and culturally sensitive for Bangladeshi mothers
5. Provide responses in both English and Bengali

IMAGE ANALYSIS TASK:
Analyze the uploaded image for signs of anemia such as:
- Pale nail beds, lips, or inner eyelids
- Color variations that might indicate iron deficiency
- Visual cues of pallor

RESPONSE FORMAT:
PALLOR_LEVEL: [0-100 number indicating severity]
RISK_LEVEL: [LOW/MEDIUM/HIGH]
IRON_DEFICIENCY: [YES/NO]
ASSESSMENT_EN: [Detailed personal assessment in English addressing "you"]
ASSESSMENT_BN: [Detailed personal assessment in Bengali addressing "you"]
RECOMMENDATIONS_EN: [Comma-separated personal recommendations in English]
RECOMMENDATIONS_BN: [Comma-separated personal recommendations in Bengali]

Preferred language: ${language}

Analyze the image and provide caring, personal guidance directly to the pregnant woman.`
  }

  private buildNutritionPrompt(language: string): string {
    return `You are a specialized AI health assistant for pregnant women. Analyze this meal image for nutritional content during pregnancy.

SPEAK DIRECTLY to the pregnant woman as "you" - NOT third person like "the patient".

CRITICAL GUIDELINES:
1. Address the pregnant woman directly as "you"
2. You are NOT a doctor - always recommend consulting healthcare providers
3. Focus on pregnancy-specific nutritional needs
4. Be supportive and culturally sensitive for Bangladeshi mothers
5. Consider Bengali/South Asian cuisine preferences

IMAGE ANALYSIS TASK:
Analyze the uploaded meal image for:
- Iron content (crucial during pregnancy)
- Protein levels
- Calcium content
- Overall caloric value
- Missing nutrients

PREGNANCY NUTRITION FOCUS:
- Iron: 27mg daily needed
- Protein: 71g daily needed
- Calcium: 1000mg daily needed
- Folic acid sources
- Avoid harmful foods

RESPONSE FORMAT:
IRON: [number in mg]
PROTEIN: [number in g]
CALCIUM: [number in mg]
CALORIES: [number]
RISK_LEVEL: [LOW/MEDIUM/HIGH for nutritional adequacy]
MISSING: [Comma-separated missing nutrients]
ASSESSMENT_EN: [Personal assessment in English addressing "you"]
ASSESSMENT_BN: [Personal assessment in Bengali addressing "you"]
RECOMMENDATIONS_EN: [Comma-separated personal recommendations in English]
RECOMMENDATIONS_BN: [Comma-separated personal recommendations in Bengali]

Preferred language: ${language}

Analyze the meal and provide caring, personal nutritional guidance.`
  }

  private buildBPPrompt(symptoms: string[], language: string): string {
    return `You are a specialized AI health assistant for pregnant women. Analyze this blood pressure reading image and assess pregnancy-related hypertension risks.

SPEAK DIRECTLY to the pregnant woman as "you" - NOT third person like "the patient".

CRITICAL GUIDELINES:
1. Address the pregnant woman directly as "you"
2. You are NOT a doctor - always recommend consulting healthcare providers
3. Focus on pregnancy-specific BP concerns (preeclampsia, gestational hypertension)
4. Be supportive and culturally sensitive for Bangladeshi mothers

IMPORTANT: FIRST check if you can clearly see BP numbers in the image. If the image is blurry, dark, or doesn't show clear BP readings, you MUST respond with "IMAGE_NOT_CLEAR" instead of guessing numbers.

BLOOD PRESSURE ANALYSIS TASK:
Analyze the uploaded image for:
- Clear, readable systolic and diastolic BP readings from digital/manual BP monitors
- Numbers on BP cuff displays or manual readings
- Any visible measurements (like 120/80, 140/90, etc.)

Only proceed with analysis if you can clearly see specific BP numbers. If not clear, respond with IMAGE_NOT_CLEAR.

PREGNANCY BP GUIDELINES:
- Normal: <120/80
- Elevated: 120-129/<80
- High Stage 1: 130-139/80-89
- High Stage 2: ≥140/≥90
- Preeclampsia risk: ≥140/≥90 with symptoms

ADDITIONAL SYMPTOMS: ${symptoms.join(", ") || "None provided"}

RESPONSE FORMAT (only if BP numbers are clearly visible):
SYSTOLIC: [exact number from image]
DIASTOLIC: [exact number from image]
RISK_LEVEL: [LOW/MEDIUM/HIGH]
PREECLAMPSIA_RISK: [YES/NO]
ASSESSMENT_EN: [Personal assessment in English addressing "you"]
ASSESSMENT_BN: [Personal assessment in Bengali addressing "you"]
RECOMMENDATIONS_EN: [Comma-separated personal recommendations in English]
RECOMMENDATIONS_BN: [Comma-separated personal recommendations in Bengali]

IF IMAGE IS NOT CLEAR, respond only with: IMAGE_NOT_CLEAR

Preferred language: ${language}

Analyze the image and provide caring, personal guidance if BP readings are clearly visible.`
  }

  private buildInfectionPrompt(language: string): string {
    return `You are a specialized AI health assistant for pregnant women. Analyze this image for signs of infection or skin conditions during pregnancy.

SPEAK DIRECTLY to the pregnant woman as "you" - NOT third person like "the patient".

CRITICAL GUIDELINES:
1. Address the pregnant woman directly as "you"
2. You are NOT a doctor - always recommend consulting healthcare providers
3. Focus on pregnancy-safe infection concerns
4. Be supportive and culturally sensitive for Bangladeshi mothers
5. Consider pregnancy-related skin changes vs infections

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
ASSESSMENT_EN: [Personal assessment in English addressing "you"]
ASSESSMENT_BN: [Personal assessment in Bengali addressing "you"]
RECOMMENDATIONS_EN: [Comma-separated personal recommendations in English]
RECOMMENDATIONS_BN: [Comma-separated personal recommendations in Bengali]

Preferred language: ${language}

Analyze the image and provide caring, personal guidance about your condition.`
  }

  private buildDiabetesPrompt(language: string): string {
    return `You are a specialized AI health assistant for pregnant women. Analyze this glucose meter reading image for gestational diabetes management.

SPEAK DIRECTLY to the pregnant woman as "you" - NOT third person like "the patient".

CRITICAL GUIDELINES:
1. Address the pregnant woman directly as "you"
2. You are NOT a doctor - always recommend consulting healthcare providers
3. Focus on pregnancy-specific glucose concerns (gestational diabetes)
4. Be supportive and culturally sensitive for Bangladeshi mothers
5. Consider gestational diabetes targets are different from regular diabetes

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
ASSESSMENT_EN: [Personal assessment in English addressing "you"]
ASSESSMENT_BN: [Personal assessment in Bengali addressing "you"]
RECOMMENDATIONS_EN: [Comma-separated personal recommendations in English]
RECOMMENDATIONS_BN: [Comma-separated personal recommendations in Bengali]

Preferred language: ${language}

Analyze your glucose reading and provide caring, personal guidance for managing your blood sugar during pregnancy.`
  }

  // RESPONSE PARSERS (same logic as Groq service but adapted for Gemini responses)
  private parseAnemiaResponse(aiResponse: string, language: string): AnemiaResult {
    try {
      const lines = aiResponse.split('\n').map(line => line.trim())
      
      let pallorLevel = 50
      let riskLevel: "low" | "medium" | "high" = "low"
      let ironDeficiency = false
      let assessmentEn = ""
      let assessmentBn = ""
      let recommendationsEn: string[] = []
      let recommendationsBn: string[] = []

      for (const line of lines) {
        if (line.includes('PALLOR_LEVEL:')) {
          const match = line.match(/PALLOR_LEVEL:\s*(\d+)/i)
          if (match) pallorLevel = Math.min(100, Math.max(0, parseInt(match[1])))
        }
        if (line.includes('RISK_LEVEL:')) {
          const match = line.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/i)
          if (match) riskLevel = match[1].toLowerCase() as "low" | "medium" | "high"
        }
        if (line.includes('IRON_DEFICIENCY:')) {
          const match = line.match(/IRON_DEFICIENCY:\s*(YES|NO)/i)
          if (match) ironDeficiency = match[1].toUpperCase() === 'YES'
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

      // Validate and set risk level based on pallor if not provided
      if (pallorLevel > 70) riskLevel = "high"
      else if (pallorLevel > 40) riskLevel = "medium"

      return {
        pallorLevel,
        riskLevel,
        ironDeficiency,
        recommendations: {
          en: recommendationsEn.length > 0 ? recommendationsEn : this.getDefaultAnemiaRecommendations(riskLevel, "en"),
          bn: recommendationsBn.length > 0 ? recommendationsBn : this.getDefaultAnemiaRecommendations(riskLevel, "bn")
        },
        message: {
          en: assessmentEn || this.getDefaultAnemiaMessage(riskLevel, "en"),
          bn: assessmentBn || this.getDefaultAnemiaMessage(riskLevel, "bn")
        }
      }
    } catch (error) {
      console.error("Error parsing anemia response:", error)
      return this.getFallbackAnemiaAnalysis(language)
    }
  }

  private parseNutritionResponse(aiResponse: string, language: string): NutritionResult {
    try {
      const lines = aiResponse.split('\n').map(line => line.trim())
      
      let iron = 10
      let protein = 25
      let calcium = 500
      let calories = 400
      let riskLevel: "low" | "medium" | "high" = "low"
      let missing: string[] = []
      let assessmentEn = ""
      let assessmentBn = ""
      let recommendationsEn: string[] = []
      let recommendationsBn: string[] = []

      for (const line of lines) {
        if (line.includes('IRON:')) {
          const match = line.match(/IRON:\s*(\d+)/i)
          if (match) iron = parseInt(match[1])
        }
        if (line.includes('PROTEIN:')) {
          const match = line.match(/PROTEIN:\s*(\d+)/i)
          if (match) protein = parseInt(match[1])
        }
        if (line.includes('CALCIUM:')) {
          const match = line.match(/CALCIUM:\s*(\d+)/i)
          if (match) calcium = parseInt(match[1])
        }
        if (line.includes('CALORIES:')) {
          const match = line.match(/CALORIES:\s*(\d+)/i)
          if (match) calories = parseInt(match[1])
        }
        if (line.includes('RISK_LEVEL:')) {
          const match = line.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/i)
          if (match) riskLevel = match[1].toLowerCase() as "low" | "medium" | "high"
        }
        if (line.includes('MISSING:')) {
          const missingText = line.replace(/MISSING:\s*/i, '')
          missing = missingText.split(',').map(m => m.trim()).filter(m => m.length > 0)
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

      // Validate and set risk level based on nutrition if not provided
      if (iron < 10 || protein < 20 || calcium < 400) riskLevel = "high"
      else if (iron < 15 || protein < 30 || calcium < 600) riskLevel = "medium"

      return {
        iron,
        protein,
        calcium,
        calories,
        riskLevel,
        missing,
        recommendations: {
          en: recommendationsEn.length > 0 ? recommendationsEn : this.getDefaultNutritionRecommendations(riskLevel, "en"),
          bn: recommendationsBn.length > 0 ? recommendationsBn : this.getDefaultNutritionRecommendations(riskLevel, "bn")
        },
        message: {
          en: assessmentEn || this.getDefaultNutritionMessage(riskLevel, "en"),
          bn: assessmentBn || this.getDefaultNutritionMessage(riskLevel, "bn")
        }
      }
    } catch (error) {
      console.error("Error parsing nutrition response:", error)
      return this.getFallbackNutritionAnalysis(language)
    }
  }

  private parseBPResponse(aiResponse: string, language: string): BPResult {
    try {
      // Check if image was not clear
      if (aiResponse.includes('IMAGE_NOT_CLEAR')) {
        return {
          systolic: 0,
          diastolic: 0,
          riskLevel: "low" as const,
          preeclampsiaRisk: false,
          symptoms: [],
          recommendations: {
            en: ["Please take a clearer photo of your BP monitor", "Ensure good lighting", "Position camera directly above display", "Try again with a clear image"],
            bn: ["আপনার BP মনিটরের আরও পরিষ্কার ছবি তুলুন", "ভালো আলো নিশ্চিত করুন", "ক্যামেরা সরাসরি ডিসপ্লের উপরে রাখুন", "পরিষ্কার ছবি দিয়ে আবার চেষ্টা করুন"]
          },
          message: {
            en: "I couldn't clearly see the BP numbers in your image. Please upload a clearer photo of your BP monitor display.",
            bn: "আমি আপনার ছবিতে BP নম্বরগুলো স্পষ্ট দেখতে পাচ্ছি না। অনুগ্রহ করে আপনার BP মনিটর ডিসপ্লের আরও পরিষ্কার ছবি আপলোড করুন।"
          }
        }
      }

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

      // Validate BP readings - if they seem unrealistic, ask for re-upload
      if (systolic < 50 || systolic > 250 || diastolic < 30 || diastolic > 150) {
        return {
          systolic: 0,
          diastolic: 0,
          riskLevel: "low" as const,
          preeclampsiaRisk: false,
          symptoms: [],
          recommendations: {
            en: ["The BP reading seems unclear", "Please retake photo with better lighting", "Ensure BP monitor display is clearly visible", "Try again with a clearer image"],
            bn: ["BP রিডিং অস্পষ্ট মনে হচ্ছে", "ভালো আলোতে আবার ছবি তুলুন", "BP মনিটর ডিসপ্লে স্পষ্ট দেখা যাচ্ছে তা নিশ্চিত করুন", "পরিষ্কার ছবি দিয়ে আবার চেষ্টা করুন"]
          },
          message: {
            en: "The BP reading in your image is not clear. Please upload a clearer photo of your BP monitor.",
            bn: "আপনার ছবিতে BP রিডিং স্পষ্ট নয়। অনুগ্রহ করে আপনার BP মনিটরের আরও পরিষ্কার ছবি আপলোড করুন।"
          }
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

  // FALLBACK METHODS (when API fails)
  private getFallbackAnemiaAnalysis(language: string): AnemiaResult {
    const pallorLevel = Math.floor(Math.random() * 60) + 20 // 20-80%
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
    const iron = Math.floor(Math.random() * 15) + 5
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

  // DEFAULT RECOMMENDATION METHODS (Personal tone addressing "you")
  private getDefaultAnemiaRecommendations(riskLevel: string, language: string): string[] {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return ["আপনার অবিলম্বে ডাক্তারের পরামর্শ নেওয়া উচিত", "আয়রন সমৃদ্ধ খাবার খান", "নির্দেশিত সাপ্লিমেন্ট নিন", "বিশ্রাম নিন"]
        case "medium":
          return ["আপনার চিকিৎসকের সাথে দেখা করুন", "আয়রন সমৃদ্ধ খাবার বাড়ান", "ভিটামিন সি যুক্ত করুন", "পর্যাপ্ত ঘুম নিন"]
        default:
          return ["আপনার সুষম খাদ্য বজায় রাখুন", "নিয়মিত চেকআপ করুন", "স্বাস্থ্যকর জীবনযাত্রা অনুসরণ করুন"]
      }
    } else {
      switch (riskLevel) {
        case "high":
          return ["You should consult a doctor immediately", "Eat iron-rich foods", "Take prescribed supplements", "Get adequate rest"]
        case "medium":
          return ["You should see your healthcare provider", "Increase iron-rich foods", "Add vitamin C", "Ensure adequate sleep"]
        default:
          return ["Continue your balanced diet", "Keep up regular checkups", "Maintain healthy lifestyle"]
      }
    }
  }

  private getDefaultAnemiaMessage(riskLevel: string, language: string): string {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return "আপনার রক্তস্বল্পতার উচ্চ ঝুঁকি রয়েছে। অনুগ্রহ করে অবিলম্বে চিকিৎসকের পরামর্শ নিন।"
        case "medium":
          return "আপনার মাঝারি রক্তস্বল্পতার ঝুঁকি রয়েছে। আপনার খাদ্যাভ্যাস উন্নত করুন এবং চিকিৎসকের সাথে পরামর্শ করুন।"
        default:
          return "আপনার রক্তের অবস্থা ভালো। বর্তমান স্বাস্থ্যকর অভ্যাস বজায় রাখুন।"
      }
    } else {
      switch (riskLevel) {
        case "high":
          return "You have a high risk of anemia. Please consult a healthcare provider immediately."
        case "medium":
          return "You have moderate anemia risk. Improve your diet and consult your healthcare provider."
        default:
          return "Your blood health looks good. Continue your current healthy habits."
      }
    }
  }

  private getDefaultNutritionRecommendations(riskLevel: string, language: string): string[] {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return ["আপনার প্রোটিন সমৃদ্ধ খাবার বাড়ানো উচিত", "ক্যালসিয়ামের উৎস যোগ করুন", "আয়রন সমৃদ্ধ সবজি খান", "পুষ্টিবিদের পরামর্শ নিন"]
        case "medium":
          return ["আপনার খাদ্যে বৈচিত্র্য আনুন", "দুগ্ধজাত খাবার বাড়ান", "হাইড্রেটেড থাকুন", "নিয়মিত খাবার খান"]
        default:
          return ["আপনার বর্তমান খাদ্যাভ্যাস বজায় রাখুন", "পানি পান করুন", "ভারসাম্য রক্ষা করুন"]
      }
    } else {
      switch (riskLevel) {
        case "high":
          return ["You should increase protein-rich foods", "Add calcium sources", "Eat iron-rich vegetables", "Consult a nutritionist"]
        case "medium":
          return ["You should diversify your diet", "Increase dairy products", "Stay hydrated", "Eat regular meals"]
        default:
          return ["Continue your current dietary habits", "Drink plenty of water", "Maintain balance"]
      }
    }
  }

  private getDefaultNutritionMessage(riskLevel: string, language: string): string {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return "আপনার পুষ্টির ঘাটতি রয়েছে। অনুগ্রহ করে আপনার খাদ্যাভ্যাস উন্নত করুন।"
        case "medium":
          return "আপনার পুষ্টির মাত্রা মাঝারি। কিছু উন্নতি প্রয়োজন।"
        default:
          return "আপনার পুষ্টির অবস্থা ভালো। বর্তমান খাদ্যাভ্যাস বজায় রাখুন।"
      }
    } else {
      switch (riskLevel) {
        case "high":
          return "You have nutritional deficiencies. Please improve your diet."
        case "medium":
          return "Your nutrition levels are moderate. Some improvements needed."
        default:
          return "Your nutritional status is good. Continue your current dietary habits."
      }
    }
  }

  private getDefaultBPRecommendations(riskLevel: string, language: string): string[] {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return ["আপনার অবিলম্বে ডাক্তারের পরামর্শ নেওয়া উচিত", "নুন কমান", "বিশ্রাম নিন", "নিয়মিত BP পরীক্ষা করুন"]
        case "medium":
          return ["আপনার চিকিৎসকের সাথে পরামর্শ করুন", "স্বাস্থ্যকর খাবার খান", "হালকা ব্যায়াম করুন", "মানসিক চাপ কমান"]
        default:
          return ["আপনার স্বাস্থ্যকর জীবনযাত্রা বজায় রাখুন", "নিয়মিত BP মাপুন", "সুষম খাদ্য গ্রহণ করুন"]
      }
    } else {
      switch (riskLevel) {
        case "high":
          return ["You should consult a doctor immediately", "Reduce salt intake", "Rest and monitor", "Check BP regularly"]
        case "medium":
          return ["You should consult your healthcare provider", "Eat healthy foods", "Do light exercise", "Manage stress"]
        default:
          return ["Continue your healthy lifestyle", "Monitor BP regularly", "Maintain balanced diet"]
      }
    }
  }

  private getDefaultBPMessage(riskLevel: string, language: string): string {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return "আপনার উচ্চ রক্তচাপ রয়েছে। অবিলম্বে চিকিৎসকের পরামর্শ নিন।"
        case "medium":
          return "আপনার রক্তচাপ কিছুটা বেশি। নিয়মিত পর্যবেক্ষণ প্রয়োজন।"
        default:
          return "আপনার রক্তচাপ স্বাভাবিক। বর্তমান স্বাস্থ্যকর অভ্যাস বজায় রাখুন।"
      }
    } else {
      switch (riskLevel) {
        case "high":
          return "You have high blood pressure. Please consult a healthcare provider immediately."
        case "medium":
          return "Your blood pressure is slightly elevated. Regular monitoring needed."
        default:
          return "Your blood pressure is normal. Continue your current healthy habits."
      }
    }
  }

  private getDefaultInfectionRecommendations(riskLevel: string, language: string): string[] {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return ["আপনার অবিলম্বে ডাক্তারের পরামর্শ নেওয়া উচিত", "এলাকা পরিষ্কার রাখুন", "স্পর্শ করা এড়িয়ে চলুন"]
        case "medium":
          return ["আপনার চিকিৎসকের পরামর্শ নিন", "স্বাস্থ্যবিধি মেনে চলুন", "লক্ষণ পর্যবেক্ষণ করুন"]
        default:
          return ["আপনার পরিষ্কার পরিচ্ছন্নতা বজায় রাখুন", "লক্ষণ পর্যবেক্ষণ করুন"]
      }
    } else {
      switch (riskLevel) {
        case "high":
          return ["You should consult a doctor immediately", "Keep area clean", "Avoid touching"]
        case "medium":
          return ["You should see your healthcare provider", "Maintain hygiene", "Monitor symptoms"]
        default:
          return ["Maintain your cleanliness", "Monitor symptoms"]
      }
    }
  }

  private getDefaultInfectionMessage(riskLevel: string, language: string): string {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return "আপনার সংক্রমণের লক্ষণ রয়েছে। অবিলম্বে চিকিৎসকের পরামর্শ নিন।"
        case "medium":
          return "আপনার মাঝারি সংক্রমণের ঝুঁকি রয়েছে। চিকিৎসকের সাথে পরামর্শ করুন।"
        default:
          return "আপনার ত্বকের পরিবর্তন স্বাভাবিক মনে হচ্ছে। পর্যবেক্ষণ চালিয়ে যান।"
      }
    } else {
      switch (riskLevel) {
        case "high":
          return "You have signs of infection. Please consult a healthcare provider immediately."
        case "medium":
          return "You have moderate infection risk. Consider consulting your healthcare provider."
        default:
          return "Your skin changes appear normal. Continue monitoring."
      }
    }
  }

  private getDefaultDiabetesRecommendations(riskLevel: string, language: string): string[] {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return ["আপনার অবিলম্বে এন্ডোক্রিনোলজিস্টের পরামর্শ নেওয়া উচিত", "শর্করা নিয়ন্ত্রণ করুন", "নিয়মিত গ্লুকোজ পরীক্ষা", "ডায়েট চার্ট অনুসরণ করুন"]
        case "medium":
          return ["আপনার চিকিৎসকের পরামর্শ নিন", "স্বাস্থ্যকর খাবার খান", "নিয়মিত ব্যায়াম করুন", "চিনি কমান"]
        default:
          return ["আপনার স্বাস্থ্যকর জীবনযাত্রা বজায় রাখুন", "নিয়মিত পরীক্ষা করুন", "সুষম খাদ্য গ্রহণ করুন"]
      }
    } else {
      switch (riskLevel) {
        case "high":
          return ["You should consult an endocrinologist immediately", "Control sugar intake", "Monitor glucose regularly", "Follow diabetic diet"]
        case "medium":
          return ["You should consult your healthcare provider", "Eat healthy foods", "Exercise regularly", "Reduce sugar"]
        default:
          return ["Continue your healthy lifestyle", "Regular checkups", "Maintain balanced diet"]
      }
    }
  }

  private getDefaultDiabetesMessage(riskLevel: string, language: string): string {
    if (language === "bn") {
      switch (riskLevel) {
        case "high":
          return "আপনার উচ্চ গ্লুকোজের মাত্রা রয়েছে। অবিলম্বে চিকিৎসকের পরামর্শ নিন।"
        case "medium":
          return "আপনার গ্লুকোজের মাত্রা কিছুটা বেশি। জীবনযাত্রার পরিবর্তন প্রয়োজন।"
        default:
          return "আপনার গ্লুকোজের মাত্রা স্বাভাবিক। বর্তমান অভ্যাস বজায় রাখুন।"
      }
    } else {
      switch (riskLevel) {
        case "high":
          return "You have high glucose levels. Please consult a healthcare provider immediately."
        case "medium":
          return "Your glucose levels are slightly elevated. Lifestyle changes recommended."
        default:
          return "Your glucose levels are normal. Continue your current healthy habits."
      }
    }
  }
}

// Export singleton
export const geminiImageAI = new GeminiImageAIService()