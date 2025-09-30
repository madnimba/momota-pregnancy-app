// Groq AI Service for health analysis - Fast and Free!
import type { AISymptomAnalysisResult } from "./health-ai-service"

interface GroqMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

class GroqAIService {
  private apiKey: string
  private baseUrl = "https://api.groq.com/openai/v1/chat/completions"
  private primaryModel: string
  private fallbackModel: string

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || ""
    this.primaryModel = process.env.GROQ_MODEL_PRIMARY || "llama-3.1-70b-versatile"
    this.fallbackModel = process.env.GROQ_MODEL_FALLBACK || "mixtral-8x7b-32768"
    
    if (!this.apiKey) {
      console.warn("Groq API key not found. AI features will use fallback analysis.")
    }
  }

  async analyzeSymptoms(
    selectedSymptoms: string[],
    description: string,
    language: "en" | "bn" = "en"
  ): Promise<AISymptomAnalysisResult> {
    // If no API key, use enhanced fallback immediately
    if (!this.apiKey) {
      console.log("No Groq API key found, using enhanced fallback")
      return this.getEnhancedFallback(selectedSymptoms, description, language)
    }

    try {
      console.log("Analyzing symptoms with Groq AI...")
      const aiResponse = await this.callGroqAPI(selectedSymptoms, description, language)
      return this.parseGroqResponse(aiResponse, selectedSymptoms, description, language)
    } catch (error) {
      console.error("Groq AI analysis failed:", error)
      return this.getEnhancedFallback(selectedSymptoms, description, language)
    }
  }

  private async callGroqAPI(
    symptoms: string[],
    description: string,
    language: string
  ): Promise<string> {
    const messages = this.buildMessages(symptoms, description, language)
    
    // Try primary model first, then fallback
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
            temperature: 0.3, // Lower for more consistent medical advice
            max_tokens: 500,
            top_p: 0.9
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Groq API error for ${model}:`, response.status, errorText)
          continue // Try next model
        }

        const data: GroqResponse = await response.json()
        if (data.choices && data.choices.length > 0) {
          console.log(`Successfully used Groq model: ${model}`)
          return data.choices[0].message.content
        }
      } catch (error) {
        console.error(`Error with Groq model ${model}:`, error)
        continue // Try next model
      }
    }
    
    throw new Error("All Groq models failed")
  }

  private buildMessages(
    symptoms: string[],
    description: string,
    language: string
  ): GroqMessage[] {
    const systemPrompt = `You are a specialized AI health assistant for pregnant women. You provide culturally sensitive health guidance for Bangladeshi mothers. 

CRITICAL GUIDELINES:
1. SPEAK DIRECTLY to the pregnant woman as "you" - NOT third person like "the patient"
2. You are NOT a doctor - always recommend consulting healthcare providers
3. Focus on pregnancy-specific health concerns
4. Be supportive and informative, not alarmist
5. Use caring, empathetic language that addresses her personally
6. IMPORTANT: Provide responses SEPARATELY in English and Bengali - DO NOT mix languages in one response
7. Always err on the side of caution for serious symptoms

URGENT SYMPTOMS (always recommend immediate medical care):
- Heavy bleeding during pregnancy
- Severe abdominal pain
- Severe headache with vision changes
- Difficulty breathing
- High fever (>101°F/38.3°C)
- Severe persistent vomiting
- Signs of preeclampsia

RESPONSE FORMAT (CRITICAL - follow exactly):
URGENCY: [URGENT/CONSULT/MONITOR]
SEVERITY: [MILD/MODERATE/SEVERE]
ASSESSMENT_EN: [Complete assessment in English ONLY - address "you" directly]
ASSESSMENT_BN: [Complete assessment in Bengali ONLY - address "আপনি" directly]
RECOMMENDATIONS_EN: [Detailed, actionable recommendations in English ONLY - include specific steps, timelines, and self-care measures]
RECOMMENDATIONS_BN: [Detailed, actionable recommendations in Bengali ONLY - include specific steps, timelines, and self-care measures]

LANGUAGE SEPARATION RULES:
- ASSESSMENT_EN must be ONLY in English 
- ASSESSMENT_BN must be ONLY in Bengali
- DO NOT mix languages in a single line
- Each section should be complete and standalone

RECOMMENDATIONS MUST BE DETAILED AND ACTIONABLE:
- Include specific timelines (e.g., "within 24 hours", "every 2 hours")
- Provide practical self-care steps
- Mention when to seek immediate help
- Include pregnancy-specific guidance
- Be culturally appropriate for Bengali mothers
- Give clear next steps the patient can take

Be comprehensive and provide useful guidance that helps the pregnant woman take appropriate action.`

    const symptomsText = symptoms.length > 0 
      ? `Selected symptoms: ${symptoms.join(", ")}`
      : "No specific symptoms selected"
    
    const userPrompt = `${symptomsText}

I am describing my symptoms: "${description}"

Preferred language: ${language}

Please analyze my pregnancy-related symptoms and provide guidance directly to me in the specified format. Address me as "you" and provide caring, personal advice.

IMPORTANT: Keep English and Bengali responses completely separate - do not mix languages within the same assessment or recommendation line.`

    return [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  }

  private parseGroqResponse(
    aiResponse: string,
    selectedSymptoms: string[],
    description: string,
    language: string
  ): AISymptomAnalysisResult {
    try {
      console.log("Groq AI Response:", aiResponse)
      
      // Parse the structured response - handle multiple formats
      const urgencyMatch = aiResponse.match(/(?:URGENCY|URGENT):\s*(URGENT|CONSULT|MONITOR)/i)
      const severityMatch = aiResponse.match(/SEVERITY:\s*(MILD|MODERATE|SEVERE)/i)
      const assessmentEnMatch = aiResponse.match(/ASSESSMENT_EN:\s*([^]*?)(?=ASSESSMENT_BN:|RECOMMENDATIONS_EN:|$)/i)
      const assessmentBnMatch = aiResponse.match(/ASSESSMENT_BN:\s*([^]*?)(?=RECOMMENDATIONS_EN:|RECOMMENDATIONS_BN:|$)/i)
      const recommendationsEnMatch = aiResponse.match(/RECOMMENDATIONS_EN:\s*([^]*?)(?=RECOMMENDATIONS_BN:|$)/i)
      const recommendationsBnMatch = aiResponse.match(/RECOMMENDATIONS_BN:\s*([^]*?)$/i)
      
      console.log("Parsed values:", { 
        urgencyMatch: urgencyMatch?.[1], 
        severityMatch: severityMatch?.[1],
        hasAssessmentEn: !!assessmentEnMatch,
        hasAssessmentBn: !!assessmentBnMatch
      })
      
      // Extract and validate values
      let urgency: "monitor" | "consult" | "urgent" = "monitor"
      if (urgencyMatch) {
        const level = urgencyMatch[1].toLowerCase()
        if (level === "urgent") urgency = "urgent"
        else if (level === "consult") urgency = "consult"
      }
      
      // Safety check - if AI response contains urgent keywords, force urgent
      if (/urgent|emergency|immediate|severe.*bleeding|severe.*pain/i.test(aiResponse)) {
        urgency = "urgent"
        console.log("Forced urgency to URGENT based on keywords in AI response")
      }
      
      let severity: "mild" | "moderate" | "severe" = "mild"
      if (severityMatch) {
        const level = severityMatch[1].toLowerCase()
        if (level === "severe") severity = "severe"
        else if (level === "moderate") severity = "moderate"
      }
      
      const riskLevel = urgency === "urgent" ? "high" : severity === "severe" ? "medium" : "low"
      
      console.log("Final parsed values:", { urgency, severity, riskLevel })
      
      // Extract messages
      const messageEn = assessmentEnMatch ? assessmentEnMatch[1].trim() : 
        "Please consult with a healthcare provider for proper evaluation."
      
      // If no Bengali assessment but we have urgency, generate appropriate Bengali message
      let messageBn = assessmentBnMatch ? assessmentBnMatch[1].trim() : ""
      if (!messageBn) {
        if (urgency === "urgent") {
          messageBn = "আপনার লক্ষণগুলির ভিত্তিতে, আপনার অবিলম্বে চিকিৎসা সেবা প্রয়োজন। দেরি না করে জরুরি বিভাগে যান।"
        } else if (urgency === "consult") {
          messageBn = "আপনার লক্ষণগুলি পরামর্শ দেয় যে আপনার শীঘ্রই একজন ডাক্তারের সাথে পরামর্শ করা উচিত।"
        } else {
          messageBn = "আপনার লক্ষণগুলি পর্যবেক্ষণ করুন এবং প্রয়োজনে ডাক্তারের সাথে যোগাযোগ করুন।"
        }
      }
      
      // Extract recommendations
      const recsEn = recommendationsEnMatch ? 
        recommendationsEnMatch[1].trim().split(',').map(r => r.trim()).filter(r => r.length > 0) :
        this.getDefaultRecommendations(urgency, "en")
      
      const recsBn = recommendationsBnMatch ?
        recommendationsBnMatch[1].trim().split(',').map(r => r.trim()).filter(r => r.length > 0) :
        this.getDefaultRecommendations(urgency, "bn")
      
      return {
        extractedSymptoms: this.extractSymptoms(description, selectedSymptoms),
        severity,
        urgency,
        riskLevel,
        possibleConditions: this.getPossibleConditions(selectedSymptoms, urgency),
        recommendations: {
          en: recsEn,
          bn: recsBn
        },
        message: {
          en: messageEn,
          bn: messageBn
        },
        confidence: 0.9, // High confidence for Groq AI
        aiGenerated: true
      }
    } catch (error) {
      console.warn("Failed to parse Groq response, using enhanced analysis")
      return this.getEnhancedAnalysis(selectedSymptoms, description, aiResponse, language)
    }
  }

  private extractSymptoms(text: string, selectedSymptoms: string[]): string[] {
    const symptoms = [...selectedSymptoms]
    
    // Extract additional symptoms from text
    const symptomPatterns = {
      fever: /fever|জ্বর|hot|temperature|গরম/i,
      headache: /headache|মাথাব্যথা|head pain|migraine/i,
      nausea: /nausea|বমি|vomit|sick|queasy|morning sickness/i,
      bleeding: /bleeding|রক্তপাত|blood|রক্ত|spotting/i,
      pain: /pain|ব্যথা|ache|hurt|cramp|যন্ত্রণা/i,
      dizziness: /dizzy|মাথা ঘোরা|faint|lightheaded|চক্কর/i,
      breathing: /breathing|শ্বাস|breath|shortness|দম/i,
      swelling: /swelling|ফোলা|swollen|puffy|edema/i,
      discharge: /discharge|স্রাব|fluid|leak/i,
      fatigue: /tired|ক্লান্ত|fatigue|exhausted/i
    }
    
    for (const [symptom, pattern] of Object.entries(symptomPatterns)) {
      if (pattern.test(text) && !symptoms.includes(symptom)) {
        symptoms.push(symptom)
      }
    }
    
    return symptoms
  }

  private getPossibleConditions(symptoms: string[], urgency: string): string[] {
    const conditions: string[] = []
    
    if (urgency === "urgent") {
      conditions.push("Requires immediate medical evaluation")
    } else {
      if (symptoms.includes("fever") && symptoms.includes("burning")) {
        conditions.push("Possible urinary tract infection")
      }
      if (symptoms.includes("headache") && symptoms.includes("dizziness")) {
        conditions.push("May require blood pressure monitoring")
      }
      if (symptoms.includes("nausea") && symptoms.includes("fatigue")) {
        conditions.push("Common pregnancy symptoms")
      }
    }
    
    return conditions
  }

  private getDefaultRecommendations(urgency: string, language: string): string[] {
    if (urgency === "urgent") {
      return language === "bn" ? [
        "অবিলম্বে নিকটস্থ হাসপাতালের জরুরি বিভাগে যান",
        "আপনার সাথে কেউ থাকলে তাদের সাহায্য নিন",
        "যাওয়ার পথে শুয়ে থাকুন বা আরামদায়ক অবস্থানে বসুন",
        "সম্ভব হলে হাসপাতালে যাওয়ার আগে ফোন করুন",
        "আপনার গর্ভাবস্থার কাগজপত্র ও ওষুধের তালিকা নিয়ে যান",
        "পানি পান করুন কিন্তু খাবার এড়িয়ে চলুন",
        "নিয়মিত নাড়াচাড়া পর্যবেক্ষণ করুন"
      ] : [
        "Go to the nearest hospital emergency department immediately",
        "Have someone accompany you if possible",
        "Rest in a comfortable position during transport",
        "Call the hospital ahead if possible to inform them",
        "Bring your pregnancy documents and medication list",
        "Stay hydrated but avoid eating",
        "Monitor baby movements regularly"
      ]
    } else if (urgency === "consult") {
      return language === "bn" ? [
        "আগামী ২৪-৪৮ ঘন্টার মধ্যে আপনার গাইনোকোলজিস্টের সাথে দেখা করুন",
        "লক্ষণগুলির একটি তালিকা করুন এবং কখন শুরু হয়েছে তা লিখুন",
        "দিনে ৮-১০ গ্লাস পানি পান করুন",
        "প্রতি ২ ঘন্টায় ১৫-২০ মিনিট বিশ্রাম নিন",
        "গর্ভের সন্তানের নড়াচড়া গণনা করুন (দিনে ১০ বার অনুভব করা উচিত)",
        "মানসিক চাপ কমাতে গভীর শ্বাস নিন",
        "ভিটামিন ও আয়রন ট্যাবলেট নিয়মিত খান",
        "লক্ষণ বেড়ে গেলে অবিলম্বে হাসপাতালে যান"
      ] : [
        "Schedule an appointment with your gynecologist within 24-48 hours",
        "Keep a symptom diary noting when they started and their severity",
        "Drink 8-10 glasses of water daily",
        "Rest for 15-20 minutes every 2 hours",
        "Count baby movements (should feel 10 movements per day)",
        "Practice deep breathing to reduce stress",
        "Continue taking prenatal vitamins and iron supplements",
        "Seek immediate care if symptoms worsen"
      ]
    } else {
      return language === "bn" ? [
        "প্রতিদিন ৭-৮ ঘন্টা ঘুমান এবং দিনে ১-২ ঘন্টা বিশ্রাম নিন",
        "সুষম খাবার খান - প্রোটিন, আয়রন, ক্যালসিয়াম সমৃদ্ধ খাদ্য অন্তর্ভুক্ত করুন",
        "হালকা ব্যায়াম করুন যেমন হাঁটা, গর্ভকালীন যোগব্যায়াম",
        "প্রতিদিন ৩-৪ লিটার পানি পান করুন",
        "চাপ ও উদ্বেগ কমাতে মেডিটেশন বা শ্বাসের ব্যায়াম করুন",
        "নিয়মিত প্রিনেটাল চেকআপে যান",
        "ধূমপান, অ্যালকোহল ও ক্যাফিন এড়িয়ে চলুন",
        "লক্ষণ বেড়ে গেলে বা নতুন লক্ষণ দেখা দিলে ডাক্তারের সাথে যোগাযোগ করুন"
      ] : [
        "Get 7-8 hours of sleep daily and take 1-2 hour daytime rest",
        "Eat balanced meals rich in protein, iron, calcium, and folate",
        "Do light exercises like walking, prenatal yoga, or swimming",
        "Drink 3-4 liters of water throughout the day",
        "Practice meditation or breathing exercises to reduce stress",
        "Attend all scheduled prenatal appointments",
        "Avoid smoking, alcohol, and limit caffeine intake",
        "Contact your doctor if symptoms persist or new ones develop"
      ]
    }
  }

  private getEnhancedAnalysis(
    selectedSymptoms: string[],
    description: string,
    aiContext: string,
    language: string
  ): AISymptomAnalysisResult {
    // Enhanced rule-based analysis using AI context
    const combinedText = (description + " " + aiContext).toLowerCase()
    
    const urgency = this.determineUrgency(selectedSymptoms, combinedText)
    const severity = this.determineSeverity(combinedText)
    const riskLevel = urgency === "urgent" ? "high" : severity === "severe" ? "medium" : "low"
    
    return {
      extractedSymptoms: this.extractSymptoms(combinedText, selectedSymptoms),
      severity,
      urgency,
      riskLevel,
      possibleConditions: this.getPossibleConditions(selectedSymptoms, urgency),
      recommendations: {
        en: this.getDefaultRecommendations(urgency, "en"),
        bn: this.getDefaultRecommendations(urgency, "bn")
      },
      message: this.generateMessage(urgency, severity, language),
      confidence: 0.7, // AI-enhanced analysis
      aiGenerated: true
    }
  }

  private getEnhancedFallback(
    symptoms: string[],
    description: string,
    language: string
  ): AISymptomAnalysisResult {
    console.log("Using enhanced fallback analysis")
    
    const text = description.toLowerCase()
    const urgency = this.determineUrgency(symptoms, text)
    const severity = this.determineSeverity(text)
    const riskLevel = urgency === "urgent" ? "high" : severity === "severe" ? "medium" : "low"
    
    return {
      extractedSymptoms: this.extractSymptoms(text, symptoms),
      severity,
      urgency,
      riskLevel,
      possibleConditions: this.getPossibleConditions(symptoms, urgency),
      recommendations: {
        en: this.getDefaultRecommendations(urgency, "en"),
        bn: this.getDefaultRecommendations(urgency, "bn")
      },
      message: this.generateMessage(urgency, severity, language),
      confidence: 0.6, // Lower confidence for fallback
      aiGenerated: false
    }
  }

  private determineUrgency(symptoms: string[], text: string): "monitor" | "consult" | "urgent" {
    // Critical symptoms for pregnancy
    const urgentSymptoms = ["bleeding", "severe-pain", "high-fever", "difficulty-breathing"]
    const urgentKeywords = /emergency|urgent|severe|heavy bleeding|can't breathe|intense pain|very bad|অজ্ঞান|তীব্র|জরুরি/i
    
    if (symptoms.some(s => urgentSymptoms.includes(s)) || urgentKeywords.test(text)) {
      return "urgent"
    }
    
    if (symptoms.length >= 3 || /moderate|concerning|worried|multiple|অস্বস্তি|চিন্তিত/i.test(text)) {
      return "consult"
    }
    
    return "monitor"
  }

  private determineSeverity(text: string): "mild" | "moderate" | "severe" {
    if (/severe|intense|extreme|unbearable|terrible|very bad|তীব্র|অসহ্য|ভীষণ|প্রচণ্ড/i.test(text)) {
      return "severe"
    }
    if (/moderate|noticeable|bothering|uncomfortable|মাঝারি|অস্বস্তিকর|বিরক্তিকর/i.test(text)) {
      return "moderate"
    }
    return "mild"
  }

  private generateMessage(
    urgency: "monitor" | "consult" | "urgent",
    severity: "mild" | "moderate" | "severe",
    language: string
  ): { en: string, bn: string } {
    if (urgency === "urgent") {
      return {
        en: "Based on your symptoms, you need immediate medical attention. Please seek emergency care right away.",
        bn: "আপনার লক্ষণগুলির ভিত্তিতে, আপনার অবিলম্বে চিকিৎসা সেবা প্রয়োজন। অনুগ্রহ করে তুরন্ত জরুরি সেবা নিন।"
      }
    } else if (urgency === "consult") {
      return {
        en: "Your symptoms suggest you should consult with a healthcare provider soon. Professional evaluation is recommended.",
        bn: "আপনার লক্ষণগুলি পরামর্শ দেয় যে আপনার শীঘ্রই একজন স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করা উচিত। পেশাদার মূল্যায়ন সুপারিশ করা হয়।"
      }
    } else {
      return {
        en: "Your symptoms appear manageable with self-care. Continue monitoring and contact your healthcare provider if symptoms worsen.",
        bn: "আপনার লক্ষণগুলি স্ব-যত্নের মাধ্যমে পরিচালনাযোগ্য বলে মনে হচ্ছে। পর্যবেক্ষণ চালিয়ে যান এবং লক্ষণগুলি খারাপ হলে আপনার স্বাস্থ্যসেবা প্রদানকারীর সাথে যোগাযোগ করুন।"
      }
    }
  }
}

// Export singleton
export const groqAI = new GroqAIService()