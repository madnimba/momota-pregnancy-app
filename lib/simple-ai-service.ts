// Simplified AI Service for health analysis using basic text generation
import type { AISymptomAnalysisResult } from "./health-ai-service"

class SimpleAIService {
  private apiToken: string
  private baseUrl = "https://api-inference.huggingface.co/models"
  private model = "gpt2" // Most reliable free model

  constructor() {
    this.apiToken = process.env.HUGGINGFACE_API_TOKEN || ""
  }

  async analyzeSymptoms(
    selectedSymptoms: string[],
    description: string,
    language: "en" | "bn" = "en"
  ): Promise<AISymptomAnalysisResult> {
    // If no token, use enhanced fallback immediately
    if (!this.apiToken) {
      console.log("No API token found, using enhanced fallback")
      return this.getEnhancedFallback(selectedSymptoms, description, language)
    }

    try {
      // Create a simple prompt for text generation
      const prompt = this.createSimplePrompt(selectedSymptoms, description)
      const aiText = await this.generateText(prompt)
      
      // Parse the AI response and enhance with rule-based logic
      return this.parseAndEnhance(aiText, selectedSymptoms, description, language)
      
    } catch (error) {
      console.error("Simple AI analysis failed:", error)
      return this.getEnhancedFallback(selectedSymptoms, description, language)
    }
  }

  private createSimplePrompt(symptoms: string[], description: string): string {
    const symptomsText = symptoms.length > 0 ? symptoms.join(", ") : "no specific symptoms"
    const prompt = `Health assessment for pregnant woman:
Symptoms: ${symptomsText}
Description: ${description}

Assessment: This appears to be`
    return prompt
  }

  private async generateText(prompt: string): Promise<string> {
    console.log("Calling Hugging Face API with GPT-2...")
    
    const response = await fetch(`${this.baseUrl}/${this.model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", response.status, errorText)
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("API Response:", data)
    
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return data[0].generated_text
    }
    
    throw new Error("Invalid response format from API")
  }

  private parseAndEnhance(
    aiText: string,
    symptoms: string[],
    description: string,
    language: string
  ): AISymptomAnalysisResult {
    // Use AI context to enhance rule-based analysis
    const combinedText = (description + " " + aiText).toLowerCase()
    
    // Determine urgency based on symptoms and AI context
    const urgency = this.determineUrgency(symptoms, combinedText)
    const severity = this.determineSeverity(combinedText)
    const riskLevel = urgency === "urgent" ? "high" : severity === "severe" ? "medium" : "low"
    
    return {
      extractedSymptoms: this.extractSymptoms(combinedText, symptoms),
      severity,
      urgency,
      riskLevel,
      possibleConditions: this.getPossibleConditions(symptoms, urgency),
      recommendations: this.getRecommendations(urgency, severity, language),
      message: this.generateMessage(urgency, severity, language),
      confidence: 0.75, // AI-enhanced analysis
      aiGenerated: true
    }
  }

  private determineUrgency(symptoms: string[], text: string): "monitor" | "consult" | "urgent" {
    // Critical symptoms for pregnancy
    const urgentSymptoms = ["bleeding", "severe-pain", "high-fever", "difficulty-breathing"]
    const urgentKeywords = /emergency|urgent|severe|heavy bleeding|can't breathe|intense pain|very bad/i
    
    if (symptoms.some(s => urgentSymptoms.includes(s)) || urgentKeywords.test(text)) {
      return "urgent"
    }
    
    if (symptoms.length >= 3 || /moderate|concerning|worried|multiple/i.test(text)) {
      return "consult"
    }
    
    return "monitor"
  }

  private determineSeverity(text: string): "mild" | "moderate" | "severe" {
    if (/severe|intense|extreme|unbearable|terrible|very bad/i.test(text)) {
      return "severe"
    }
    if (/moderate|noticeable|bothering|uncomfortable/i.test(text)) {
      return "moderate"
    }
    return "mild"
  }

  private extractSymptoms(text: string, selectedSymptoms: string[]): string[] {
    const symptoms = [...selectedSymptoms]
    
    // Extract additional symptoms from text
    const symptomPatterns = {
      fever: /fever|hot|temperature/i,
      headache: /headache|head pain|migraine/i,
      nausea: /nausea|vomit|sick|queasy/i,
      bleeding: /bleeding|blood|spotting/i,
      pain: /pain|ache|hurt|cramp/i,
      dizziness: /dizzy|faint|lightheaded/i,
      breathing: /breathing|breath|shortness/i,
      swelling: /swelling|swollen|puffy/i
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
    } else if (symptoms.includes("fever") && symptoms.includes("burning")) {
      conditions.push("Possible urinary tract infection")
    } else if (symptoms.includes("headache") && symptoms.includes("dizziness")) {
      conditions.push("May require blood pressure check")
    }
    
    return conditions
  }

  private getRecommendations(
    urgency: "monitor" | "consult" | "urgent",
    severity: "mild" | "moderate" | "severe",
    language: string
  ): { en: string[], bn: string[] } {
    if (urgency === "urgent") {
      return {
        en: [
          "Seek immediate medical attention",
          "Go to emergency room or call emergency services",
          "Do not delay medical care"
        ],
        bn: [
          "অবিলম্বে চিকিৎসা সেবা নিন",
          "জরুরি বিভাগে যান বা জরুরি সেবায় ফোন করুন",
          "চিকিৎসা সেবায় বিলম্ব করবেন না"
        ]
      }
    } else if (urgency === "consult") {
      return {
        en: [
          "Contact your healthcare provider soon",
          "Monitor symptoms closely",
          "Keep track of any changes"
        ],
        bn: [
          "শীঘ্রই আপনার স্বাস্থ্যসেবা প্রদানকারীর সাথে যোগাযোগ করুন",
          "লক্ষণগুলি নিবিড়ভাবে পর্যবেক্ষণ করুন",
          "কোনো পরিবর্তনের ট্র্যাক রাখুন"
        ]
      }
    } else {
      return {
        en: [
          "Monitor symptoms and note changes",
          "Rest and stay hydrated",
          "Contact healthcare provider if symptoms worsen"
        ],
        bn: [
          "লক্ষণগুলি পর্যবেক্ষণ করুন এবং পরিবর্তন লক্ষ্য করুন",
          "বিশ্রাম নিন এবং হাইড্রেটেড থাকুন",
          "লক্ষণগুলি খারাপ হলে স্বাস্থ্যসেবা প্রদানকারীর সাথে যোগাযোগ করুন"
        ]
      }
    }
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
        en: "Your symptoms suggest you should consult with a healthcare provider. While not immediately urgent, professional evaluation is recommended.",
        bn: "আপনার লক্ষণগুলি পরামর্শ দেয় যে আপনার একজন স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করা উচিত। যদিও অবিলম্বে জরুরি নয়, পেশাদার মূল্যায়ন সুপারিশ করা হয়।"
      }
    } else {
      return {
        en: "Your symptoms appear manageable with self-care. Continue monitoring and contact your healthcare provider if symptoms worsen.",
        bn: "আপনার লক্ষণগুলি স্ব-যত্নের মাধ্যমে পরিচালনাযোগ্য বলে মনে হচ্ছে। পর্যবেক্ষণ চালিয়ে যান এবং লক্ষণগুলি খারাপ হলে আপনার স্বাস্থ্যসেবা প্রদানকারীর সাথে যোগাযোগ করুন।"
      }
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
      recommendations: this.getRecommendations(urgency, severity, language),
      message: this.generateMessage(urgency, severity, language),
      confidence: 0.6, // Lower confidence for fallback
      aiGenerated: false
    }
  }
}

// Export singleton
export const simpleAI = new SimpleAIService()