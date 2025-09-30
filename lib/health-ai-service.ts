// // Health AI Service using Hugging Face Inference API (Free)
// // This service analyzes pregnancy-related symptoms using AI models

// export interface AISymptomAnalysisResult {
//   extractedSymptoms: string[]
//   severity: "mild" | "moderate" | "severe"
//   urgency: "monitor" | "consult" | "urgent"
//   riskLevel: "low" | "medium" | "high"
//   possibleConditions: string[]
//   recommendations: {
//     en: string[]
//     bn: string[]
//   }
//   message: {
//     en: string
//     bn: string
//   }
//   confidence: number
//   aiGenerated: boolean
// }

// interface HuggingFaceResponse {
//   generated_text: string
// }

// // System prompt for health analysis (pregnancy-focused)
// const SYSTEM_PROMPT = `You are a helpful health assistant for pregnant women. Analyze the symptoms and provide a brief assessment.

// Guidelines:
// - Always recommend consulting healthcare providers for serious symptoms
// - Be supportive and informative
// - Focus on pregnancy-specific concerns
// - Provide clear urgency levels: URGENT, CONSULT, or MONITOR

// For urgent symptoms like heavy bleeding, severe pain, high fever, or breathing problems, always say URGENT.
// For multiple symptoms or moderate concerns, say CONSULT.
// For mild symptoms, say MONITOR.

// Respond in this format:
// URGENCY: [URGENT/CONSULT/MONITOR]
// ASSESSMENT: [Your detailed assessment]
// ADVICE: [Your recommendations]`

// class HealthAIService {
//   private apiToken: string
//   private baseUrl = "https://api-inference.huggingface.co/models"
//   private model = "microsoft/DialoGPT-medium" // Primary model
//   private fallbackModels = [
//     "gpt2",
//     "distilgpt2", 
//     "microsoft/DialoGPT-small"
//   ]

//   constructor() {
//     this.apiToken = process.env.HUGGINGFACE_API_TOKEN || ""
//     if (!this.apiToken) {
//       console.warn("Hugging Face API token not found. AI features will use fallback analysis.")
//     }
//   }

//   async analyzeSymptoms(
//     selectedSymptoms: string[],
//     description: string,
//     language: "en" | "bn" = "en"
//   ): Promise<AISymptomAnalysisResult> {
//     try {
//       if (!this.apiToken) {
//         return this.getFallbackAnalysis(selectedSymptoms, description, language)
//       }

//       const prompt = this.buildPrompt(selectedSymptoms, description, language)
//       const aiResponse = await this.callHuggingFaceAPI(prompt)
      
//       return this.parseAIResponse(aiResponse, selectedSymptoms, description, language)
//     } catch (error) {
//       console.error("AI analysis failed:", error)
//       return this.getFallbackAnalysis(selectedSymptoms, description, language)
//     }
//   }

//   private buildPrompt(selectedSymptoms: string[], description: string, language: string): string {
//     const symptomsText = selectedSymptoms.length > 0 
//       ? `Selected symptoms: ${selectedSymptoms.join(", ")}`
//       : "No specific symptoms selected"
    
//     const descriptionText = description.trim() 
//       ? `Patient description: "${description}"`
//       : "No additional description provided"
    
//     return `${SYSTEM_PROMPT}

// ${symptomsText}
// ${descriptionText}
// Preferred language: ${language}

// Please provide a JSON response with health analysis:`
//   }

//   private async callHuggingFaceAPI(prompt: string): Promise<string> {
//     const modelsToTry = [this.model, ...this.fallbackModels]
    
//     for (const modelName of modelsToTry) {
//       try {
//         console.log(`Trying model: ${modelName}`)
        
//         const response = await fetch(`${this.baseUrl}/${modelName}`, {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${this.apiToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             inputs: prompt,
//             parameters: {
//               max_length: 300,
//               temperature: 0.7,
//               do_sample: true,
//               return_full_text: false,
//               max_time: 30
//             }
//           })
//         })

//         if (response.ok) {
//           const data: HuggingFaceResponse[] = await response.json()
//           if (data && data.length > 0 && data[0]?.generated_text) {
//             console.log(`Successfully used model: ${modelName}`)
//             return data[0].generated_text
//           }
//         } else {
//           console.warn(`Model ${modelName} failed with status: ${response.status}`)
//           // Try next model
//           continue
//         }
//       } catch (error) {
//         console.warn(`Error with model ${modelName}:`, error)
//         // Try next model
//         continue
//       }
//     }
    
//     // If all models fail, throw error
//     throw new Error("All Hugging Face models failed. Using fallback analysis.")
//   }

//   private parseAIResponse(
//     aiResponse: string, 
//     selectedSymptoms: string[], 
//     description: string,
//     language: string
//   ): AISymptomAnalysisResult {
//     try {
//       // Parse the simpler AI response format
//       const urgencyMatch = aiResponse.match(/URGENCY:\s*(URGENT|CONSULT|MONITOR)/i)
//       const assessmentMatch = aiResponse.match(/ASSESSMENT:\s*([^]*?)(?=ADVICE:|$)/i)
//       const adviceMatch = aiResponse.match(/ADVICE:\s*([^]*?)$/i)
      
//       let urgency: "monitor" | "consult" | "urgent" = "monitor"
//       if (urgencyMatch) {
//         const level = urgencyMatch[1].toLowerCase()
//         if (level === "urgent") urgency = "urgent"
//         else if (level === "consult") urgency = "consult"
//       }
      
//       const severity = urgency === "urgent" ? "severe" : urgency === "consult" ? "moderate" : "mild"
//       const riskLevel = urgency === "urgent" ? "high" : severity === "moderate" ? "medium" : "low"
      
//       const assessment = assessmentMatch ? assessmentMatch[1].trim() : ""
//       const advice = adviceMatch ? adviceMatch[1].trim() : ""
      
//       return {
//         extractedSymptoms: this.extractSymptomsFromText(description, selectedSymptoms),
//         severity,
//         urgency,
//         riskLevel,
//         possibleConditions: urgency === "urgent" ? ["Requires immediate medical attention"] : [],
//         recommendations: this.getRecommendations(urgency, severity, language),
//         message: {
//           en: assessment || "Please consult with a healthcare provider for proper evaluation.",
//           bn: "সঠিক মূল্যায়নের জন্য দয়া করে একজন স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করুন।"
//         },
//         confidence: 0.8,
//         aiGenerated: true
//       }
//     } catch (error) {
//       console.warn("Failed to parse AI response, using enhanced analysis")
//       return this.getEnhancedAnalysis(selectedSymptoms, description, aiResponse, language)
//     }
//   }

//   private formatAIResult(parsed: any, selectedSymptoms: string[], aiGenerated: boolean): AISymptomAnalysisResult {
//     return {
//       extractedSymptoms: parsed.extractedSymptoms || selectedSymptoms,
//       severity: this.validateSeverity(parsed.severity),
//       urgency: this.validateUrgency(parsed.urgency),
//       riskLevel: this.validateRiskLevel(parsed.riskLevel),
//       possibleConditions: Array.isArray(parsed.possibleConditions) ? parsed.possibleConditions : [],
//       recommendations: {
//         en: Array.isArray(parsed.recommendations_en) ? parsed.recommendations_en : [],
//         bn: Array.isArray(parsed.recommendations_bn) ? parsed.recommendations_bn : []
//       },
//       message: {
//         en: parsed.message_en || "Please consult with a healthcare provider for proper evaluation.",
//         bn: parsed.message_bn || "সঠিক মূল্যায়নের জন্য দয়া করে একজন স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করুন।"
//       },
//       confidence: Math.min(Math.max(parsed.confidence || 0.7, 0), 1),
//       aiGenerated
//     }
//   }

//   private validateSeverity(severity: any): "mild" | "moderate" | "severe" {
//     return ["mild", "moderate", "severe"].includes(severity) ? severity : "mild"
//   }

//   private validateUrgency(urgency: any): "monitor" | "consult" | "urgent" {
//     return ["monitor", "consult", "urgent"].includes(urgency) ? urgency : "monitor"
//   }

//   private validateRiskLevel(riskLevel: any): "low" | "medium" | "high" {
//     return ["low", "medium", "high"].includes(riskLevel) ? riskLevel : "low"
//   }

//   private getEnhancedAnalysis(
//     selectedSymptoms: string[], 
//     description: string, 
//     aiContext: string,
//     language: string
//   ): AISymptomAnalysisResult {
//     // Enhanced rule-based analysis using AI context
//     const text = (description + " " + aiContext).toLowerCase()
    
//     // Extract symptoms from description and AI context
//     const extractedSymptoms = this.extractSymptomsFromText(text, selectedSymptoms)
    
//     // Determine severity with AI context
//     const severity = this.determineSeverityWithContext(text, aiContext)
    
//     // Determine urgency
//     const urgency = this.determineUrgencyWithContext(text, extractedSymptoms, severity)
    
//     // Risk level based on urgency and severity
//     const riskLevel = urgency === "urgent" ? "high" : severity === "severe" ? "medium" : "low"
    
//     return {
//       extractedSymptoms,
//       severity,
//       urgency,
//       riskLevel,
//       possibleConditions: this.getPossibleConditions(extractedSymptoms, severity),
//       recommendations: this.getRecommendations(urgency, severity, language),
//       message: this.generateMessage(urgency, severity, extractedSymptoms, language),
//       confidence: 0.75, // Enhanced analysis confidence
//       aiGenerated: true
//     }
//   }

//   private getFallbackAnalysis(
//     selectedSymptoms: string[], 
//     description: string,
//     language: string
//   ): AISymptomAnalysisResult {
//     // Enhanced rule-based analysis as fallback
//     const text = description.toLowerCase()
//     const extractedSymptoms = this.extractSymptomsFromText(text, selectedSymptoms)
//     const severity = this.determineSeverityFromText(text)
//     const urgency = this.determineUrgencyFromSymptoms(extractedSymptoms, severity, text)
//     const riskLevel = urgency === "urgent" ? "high" : severity === "severe" ? "medium" : "low"
    
//     return {
//       extractedSymptoms,
//       severity,
//       urgency,
//       riskLevel,
//       possibleConditions: this.getPossibleConditions(extractedSymptoms, severity),
//       recommendations: this.getRecommendations(urgency, severity, language),
//       message: this.generateMessage(urgency, severity, extractedSymptoms, language),
//       confidence: 0.6, // Lower confidence for rule-based
//       aiGenerated: false
//     }
//   }

//   private extractSymptomsFromText(text: string, selectedSymptoms: string[]): string[] {
//     const symptoms = [...selectedSymptoms]
    
//     // Common pregnancy symptoms to detect
//     const symptomPatterns = {
//       fever: /fever|temperature|hot|burning/i,
//       headache: /headache|head pain|migraine/i,
//       nausea: /nausea|vomit|sick|morning sickness/i,
//       bleeding: /bleeding|blood|spotting/i,
//       pain: /pain|ache|hurt|cramp/i,
//       dizziness: /dizzy|faint|lightheaded/i,
//       breathing: /breathing|breath|shortness/i,
//       swelling: /swelling|swollen|edema/i
//     }
    
//     for (const [symptom, pattern] of Object.entries(symptomPatterns)) {
//       if (pattern.test(text) && !symptoms.includes(symptom)) {
//         symptoms.push(symptom)
//       }
//     }
    
//     return symptoms
//   }

//   private determineSeverityFromText(text: string): "mild" | "moderate" | "severe" {
//     const severeKeywords = /severe|intense|extreme|unbearable|terrible|very bad|worst/i
//     const moderateKeywords = /moderate|medium|noticeable|bothering|uncomfortable/i
    
//     if (severeKeywords.test(text)) return "severe"
//     if (moderateKeywords.test(text)) return "moderate"
//     return "mild"
//   }

//   private determineSeverityWithContext(text: string, aiContext: string): "mild" | "moderate" | "severe" {
//     const combinedText = text + " " + aiContext
//     return this.determineSeverityFromText(combinedText)
//   }

//   private determineUrgencyFromSymptoms(
//     symptoms: string[], 
//     severity: "mild" | "moderate" | "severe",
//     text: string
//   ): "monitor" | "consult" | "urgent" {
//     // Urgent symptoms for pregnancy
//     const urgentSymptoms = ["bleeding", "severe-pain", "high-fever", "difficulty-breathing"]
//     const urgentKeywords = /emergency|urgent|immediate|sudden|heavy bleeding|can't breathe/i
    
//     if (urgentKeywords.test(text) || symptoms.some(s => urgentSymptoms.includes(s))) {
//       return "urgent"
//     }
    
//     if (severity === "severe" || symptoms.length >= 3) {
//       return "consult"
//     }
    
//     return "monitor"
//   }

//   private determineUrgencyWithContext(
//     text: string, 
//     symptoms: string[], 
//     severity: "mild" | "moderate" | "severe"
//   ): "monitor" | "consult" | "urgent" {
//     return this.determineUrgencyFromSymptoms(symptoms, severity, text)
//   }

//   private getPossibleConditions(symptoms: string[], severity: "mild" | "moderate" | "severe"): string[] {
//     const conditions: string[] = []
    
//     if (symptoms.includes("fever") && symptoms.includes("burning")) {
//       conditions.push("Urinary tract infection")
//     }
//     if (symptoms.includes("headache") && symptoms.includes("dizziness")) {
//       conditions.push("Preeclampsia (requires immediate attention)")
//     }
//     if (symptoms.includes("nausea") && severity === "severe") {
//       conditions.push("Hyperemesis gravidarum")
//     }
//     if (symptoms.includes("bleeding")) {
//       conditions.push("Possible complications (requires immediate medical attention)")
//     }
    
//     return conditions
//   }

//   private getRecommendations(
//     urgency: "monitor" | "consult" | "urgent",
//     severity: "mild" | "moderate" | "severe",
//     language: string
//   ): { en: string[], bn: string[] } {
//     const recommendations = {
//       en: [] as string[],
//       bn: [] as string[]
//     }
    
//     if (urgency === "urgent") {
//       recommendations.en = [
//         "Seek immediate medical attention",
//         "Go to emergency room or call emergency services",
//         "Do not delay medical care"
//       ]
//       recommendations.bn = [
//         "অবিলম্বে চিকিৎসা সেবা নিন",
//         "জরুরি বিভাগে যান বা জরুরি সেবায় ফোন করুন",
//         "চিকিৎসা সেবায় বিলম্ব করবেন না"
//       ]
//     } else if (urgency === "consult") {
//       recommendations.en = [
//         "Schedule an appointment with your healthcare provider",
//         "Monitor symptoms closely",
//         "Keep a symptom diary"
//       ]
//       recommendations.bn = [
//         "আপনার স্বাস্থ্যসেবা প্রদানকারীর সাথে অ্যাপয়েন্টমেন্ট নিন",
//         "লক্ষণগুলি নিবিড়ভাবে পর্যবেক্ষণ করুন",
//         "একটি লক্ষণ ডায়েরি রাখুন"
//       ]
//     } else {
//       recommendations.en = [
//         "Monitor symptoms and note any changes",
//         "Maintain adequate rest and hydration",
//         "Contact healthcare provider if symptoms worsen"
//       ]
//       recommendations.bn = [
//         "লক্ষণগুলি পর্যবেক্ষণ করুন এবং কোনো পরিবর্তন লক্ষ্য করুন",
//         "পর্যাপ্ত বিশ্রাম এবং হাইড্রেশন বজায় রাখুন",
//         "লক্ষণগুলি খারাপ হলে স্বাস্থ্যসেবা প্রদানকারীর সাথে যোগাযোগ করুন"
//       ]
//     }
    
//     return recommendations
//   }

//   private generateMessage(
//     urgency: "monitor" | "consult" | "urgent",
//     severity: "mild" | "moderate" | "severe",
//     symptoms: string[],
//     language: string
//   ): { en: string, bn: string } {
//     if (urgency === "urgent") {
//       return {
//         en: "Based on your symptoms, you need immediate medical attention. Please go to the nearest emergency room or contact emergency services right away.",
//         bn: "আপনার লক্ষণগুলির ভিত্তিতে, আপনার অবিলম্বে চিকিৎসা সেবা প্রয়োজন। অনুগ্রহ করে নিকটতম জরুরি বিভাগে যান বা অবিলম্বে জরুরি সেবায় যোগাযোগ করুন।"
//       }
//     } else if (urgency === "consult") {
//       return {
//         en: "Your symptoms suggest you should consult with a healthcare provider soon. While not immediately urgent, these symptoms warrant professional medical evaluation.",
//         bn: "আপনার লক্ষণগুলি পরামর্শ দেয় যে আপনার শীঘ্রই একজন স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করা উচিত। যদিও অবিলম্বে জরুরি নয়, এই লক্ষণগুলির জন্য পেশাদার চিকিৎসা মূল্যায়ন প্রয়োজন।"
//       }
//     } else {
//       return {
//         en: "Your symptoms appear to be mild and can likely be managed with self-care. Continue monitoring and contact your healthcare provider if symptoms worsen or persist.",
//         bn: "আপনার লক্ষণগুলি হালকা বলে মনে হচ্ছে এবং সম্ভবত স্ব-যত্নের মাধ্যমে পরিচালনা করা যেতে পারে। পর্যবেক্ষণ চালিয়ে যান এবং লক্ষণগুলি খারাপ হলে বা অব্যাহত থাকলে আপনার স্বাস্থ্যসেবা প্রদানকারীর সাথে যোগাযোগ করুন।"
//       }
//     }
//   }
// }

// // Export singleton instance
// export const healthAI = new HealthAIService()




// Health AI Service using Hugging Face Inference API (Free)
// Pregnancy-focused symptom analysis with JSON outputs + safe fallbacks.

import { HfInference } from "@huggingface/inference";

export interface AISymptomAnalysisResult {
  extractedSymptoms: string[];
  severity: "mild" | "moderate" | "severe";
  urgency: "monitor" | "consult" | "urgent";
  riskLevel: "low" | "medium" | "high";
  possibleConditions: string[];
  recommendations: { en: string[]; bn: string[] };
  message: { en: string; bn: string };
  confidence: number;
  aiGenerated: boolean;
}

const MEDICAL_PRIMARY =
  process.env.HF_MODEL_PRIMARY || "epfl-llm/meditron-7b";
const MEDICAL_FALLBACK =
  process.env.HF_MODEL_FALLBACK || "medalpaca/medalpaca-7b";
const LAST_RESORT = "gpt2";

const HF_TOKEN =
  process.env.HF_TOKEN || process.env.HUGGINGFACE_API_TOKEN || "";

if (!HF_TOKEN) {
  console.warn(
    "[health-ai-service] Missing HF token. The service will use rule-based fallback."
  );
}

const hf = HF_TOKEN ? new HfInference(HF_TOKEN) : null;

// --- Prompt templates --------------------------------------------------------

const SYSTEM_JSON_PROMPT = (selectedSymptoms: string[], description: string, language: "en" | "bn") => {
  const symptomsText =
    selectedSymptoms.length > 0
      ? `Selected symptoms: ${selectedSymptoms.join(", ")}`
      : "No specific symptoms selected";
  const descriptionText = description?.trim()
    ? `Patient description: "${description}"`
    : "No additional description provided";

  // Ask for STRICT JSON so we can parse reliably.
  return `
You are a careful obstetrics assistant for Bangladesh. Analyze pregnancy-related symptoms and produce a short, supportive, non-diagnostic triage.

Rules:
- Never provide a diagnosis. Use "possible" or "may indicate".
- If heavy bleeding, severe pain, very high BP, breathing difficulty, or high fever: set urgency to "urgent".
- Otherwise:
  - multiple moderate concerns => "consult"
  - mild and isolated => "monitor"
- Keep it culturally practical for Bangladesh.
- Output STRICT JSON only. Do not include any extra text.

JSON schema:
{
  "extractedSymptoms": string[],
  "severity": "mild" | "moderate" | "severe",
  "urgency": "monitor" | "consult" | "urgent",
  "riskLevel": "low" | "medium" | "high",
  "possibleConditions": string[],
  "recommendations": {
    "en": string[],
    "bn": string[]
  },
  "message": {
    "en": string,
    "bn": string
  },
  "confidence": number
}

${symptomsText}
${descriptionText}
Preferred language: ${language}

Return ONLY valid JSON matching the schema.`.trim();
};

// --- Service ----------------------------------------------------------------

class HealthAIService {
  async analyzeSymptoms(
    selectedSymptoms: string[],
    description: string,
    language: "en" | "bn" = "en"
  ): Promise<AISymptomAnalysisResult> {
    // If no token, skip remote and do fallback.
    if (!hf) {
      return this.getFallbackAnalysis(selectedSymptoms, description, language);
    }

    const prompt = SYSTEM_JSON_PROMPT(selectedSymptoms, description, language);

    // Try primary, then fallback, then last resort.
    const models = [MEDICAL_PRIMARY, MEDICAL_FALLBACK, LAST_RESORT];

    let raw = "";
    for (const model of models) {
      try {
        // Use textGeneration from the official SDK
        const res = await hf.textGeneration({
          model,
          inputs: prompt,
          parameters: {
            max_new_tokens: 220,
            temperature: 0.2,
            do_sample: false,
            return_full_text: false,
          },
          // small timeout safety; if the model is cold, you may increase this
          accessToken: HF_TOKEN,
        });

        raw = (res as any)?.generated_text || (typeof res === "string" ? res : "");
        if (!raw) throw new Error("Empty response from HF");
        // Got something—stop here
        break;
      } catch (err: any) {
        const msg = (err?.message || "").toLowerCase();
        // Helpful hints for common cases:
        if (msg.includes("404")) {
          console.warn(
            `[health-ai-service] 404 for ${model}. Check model id or gated access ("Access repository").`
          );
        } else if (msg.includes("403")) {
          console.warn(
            `[health-ai-service] 403 for ${model}. Open the model page on HF and click "Access repository".`
          );
        } else if (msg.includes("loading") || msg.includes("503")) {
          console.warn(
            `[health-ai-service] ${model} is loading or unavailable. Retrying with fallback...`
          );
        } else {
          console.warn(`[health-ai-service] ${model} failed:`, err);
        }
        raw = "";
        continue;
      }
    }

    if (!raw) {
      // All models failed → fallback
      return this.getFallbackAnalysis(selectedSymptoms, description, language);
    }

    // Try to parse JSON; if it fails, use enhanced rules.
    try {
      const parsed = JSON.parse(this.extractJsonBlock(raw));
      return this.formatAIResult(parsed, selectedSymptoms, true);
    } catch (e) {
      console.warn("[health-ai-service] JSON parse failed; using enhanced rules.");
      return this.getEnhancedAnalysis(selectedSymptoms, description, raw, language);
    }
  }

  // Try to extract the JSON block if the model accidentally wrapped it.
  private extractJsonBlock(s: string) {
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end > start) return s.slice(start, end + 1);
    return s; // hope it's already pure JSON
  }

  private formatAIResult(parsed: any, selected: string[], aiGenerated: boolean): AISymptomAnalysisResult {
    // Validate fields with sane defaults
    const sev: any = parsed?.severity;
    const urg: any = parsed?.urgency;
    const rsk: any = parsed?.riskLevel;

    const severity: "mild" | "moderate" | "severe" =
      ["mild", "moderate", "severe"].includes(sev) ? sev : "mild";
    const urgency: "monitor" | "consult" | "urgent" =
      ["monitor", "consult", "urgent"].includes(urg) ? urg : "monitor";
    const riskLevel: "low" | "medium" | "high" =
      ["low", "medium", "high"].includes(rsk) ? rsk : "low";

    return {
      extractedSymptoms: Array.isArray(parsed?.extractedSymptoms)
        ? parsed.extractedSymptoms
        : selected,
      severity,
      urgency,
      riskLevel,
      possibleConditions: Array.isArray(parsed?.possibleConditions)
        ? parsed.possibleConditions
        : [],
      recommendations: {
        en: Array.isArray(parsed?.recommendations?.en)
          ? parsed.recommendations.en
          : [],
        bn: Array.isArray(parsed?.recommendations?.bn)
          ? parsed.recommendations.bn
          : [],
      },
      message: {
        en:
          parsed?.message?.en ||
          "Please consult a healthcare provider for proper evaluation.",
        bn:
          parsed?.message?.bn ||
          "সঠিক মূল্যায়নের জন্য দয়া করে একজন স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করুন।",
      },
      confidence:
        typeof parsed?.confidence === "number"
          ? Math.min(Math.max(parsed.confidence, 0), 1)
          : 0.8,
      aiGenerated,
    };
  }

  // ------------------ Rule / Heuristic fallback path ------------------------

  private getEnhancedAnalysis(
    selectedSymptoms: string[],
    description: string,
    aiContext: string,
    language: "en" | "bn"
  ): AISymptomAnalysisResult {
    const text = (description + " " + aiContext).toLowerCase();
    const extractedSymptoms = this.extractSymptomsFromText(text, selectedSymptoms);
    const severity = this.determineSeverityFromText(text);
    const urgency = this.determineUrgencyFromSymptoms(extractedSymptoms, severity, text);
    const riskLevel =
      urgency === "urgent" ? "high" : severity === "severe" ? "medium" : "low";

    return {
      extractedSymptoms,
      severity,
      urgency,
      riskLevel,
      possibleConditions: this.getPossibleConditions(extractedSymptoms, severity),
      recommendations: this.getRecommendations(urgency, severity, language),
      message: this.generateMessage(urgency, severity, extractedSymptoms, language),
      confidence: 0.75,
      aiGenerated: true,
    };
  }

  private getFallbackAnalysis(
    selectedSymptoms: string[],
    description: string,
    language: "en" | "bn"
  ): AISymptomAnalysisResult {
    const text = (description || "").toLowerCase();
    const extractedSymptoms = this.extractSymptomsFromText(text, selectedSymptoms);
    const severity = this.determineSeverityFromText(text);
    const urgency = this.determineUrgencyFromSymptoms(extractedSymptoms, severity, text);
    const riskLevel =
      urgency === "urgent" ? "high" : severity === "severe" ? "medium" : "low";

    return {
      extractedSymptoms,
      severity,
      urgency,
      riskLevel,
      possibleConditions: this.getPossibleConditions(extractedSymptoms, severity),
      recommendations: this.getRecommendations(urgency, severity, language),
      message: this.generateMessage(urgency, severity, extractedSymptoms, language),
      confidence: 0.6,
      aiGenerated: false,
    };
  }

  private extractSymptomsFromText(text: string, selectedSymptoms: string[]): string[] {
    const symptoms = [...selectedSymptoms];
    const patterns = {
      fever: /fever|temperature|hot|burning/i,
      headache: /headache|head pain|migraine/i,
      nausea: /nausea|vomit|sick|morning sickness/i,
      bleeding: /bleeding|blood|spotting/i,
      pain: /pain|ache|hurt|cramp/i,
      dizziness: /dizzy|faint|lightheaded/i,
      breathing: /breathing|breath|shortness/i,
      swelling: /swelling|swollen|edema/i,
    };
    for (const [symptom, pattern] of Object.entries(patterns)) {
      if (pattern.test(text) && !symptoms.includes(symptom)) symptoms.push(symptom);
    }
    return symptoms;
  }

  private determineSeverityFromText(text: string): "mild" | "moderate" | "severe" {
    const severe = /severe|intense|extreme|unbearable|very bad|worst/i;
    const moderate = /moderate|medium|noticeable|bothering|uncomfortable/i;
    if (severe.test(text)) return "severe";
    if (moderate.test(text)) return "moderate";
    return "mild";
    }

  private determineUrgencyFromSymptoms(
    symptoms: string[],
    severity: "mild" | "moderate" | "severe",
    text: string
  ): "monitor" | "consult" | "urgent" {
    const urgentSymptoms = ["bleeding", "severe-pain", "high-fever", "difficulty-breathing"];
    const urgentKeywords = /emergency|urgent|immediate|sudden|heavy bleeding|can't breathe/i;

    if (urgentKeywords.test(text) || symptoms.some((s) => urgentSymptoms.includes(s))) {
      return "urgent";
    }
    if (severity === "severe" || symptoms.length >= 3) {
      return "consult";
    }
    return "monitor";
  }

  private getPossibleConditions(symptoms: string[], severity: "mild" | "moderate" | "severe"): string[] {
    const out: string[] = [];
    if (symptoms.includes("fever") && /burning/.test(symptoms.join(" "))) out.push("Urinary tract infection");
    if (symptoms.includes("headache") && symptoms.includes("dizziness"))
      out.push("Preeclampsia (requires medical evaluation)");
    if (symptoms.includes("nausea") && severity === "severe") out.push("Hyperemesis gravidarum");
    if (symptoms.includes("bleeding")) out.push("Possible complication (seek urgent care)");
    return out;
  }

  private getRecommendations(
    urgency: "monitor" | "consult" | "urgent",
    severity: "mild" | "moderate" | "severe",
    language: "en" | "bn"
  ): { en: string[]; bn: string[] } {
    const rec = { en: [] as string[], bn: [] as string[] };
    if (urgency === "urgent") {
      rec.en = [
        "Seek immediate medical attention.",
        "Go to the nearest emergency facility.",
        "Do not delay care.",
      ];
      rec.bn = [
        "অবিলম্বে চিকিৎসা সেবা নিন।",
        "নিকটতম জরুরি বিভাগে যান।",
        "চিকিৎসা নেয়া দেরি করবেন না।",
      ];
    } else if (urgency === "consult") {
      rec.en = [
        "Book a consultation with your healthcare provider.",
        "Monitor symptoms closely.",
        "Keep a simple symptom diary.",
      ];
      rec.bn = [
        "স্বাস্থ্যসেবা প্রদানকারীর সাথে দ্রুত পরামর্শ নিন।",
        "লক্ষণগুলো নিবিড়ভাবে পর্যবেক্ষণ করুন।",
        "সহজ একটি লক্ষণ ডায়েরি রাখুন।",
      ];
    } else {
      rec.en = [
        "Monitor symptoms and note any change.",
        "Rest and maintain hydration.",
        "Contact a provider if symptoms worsen or persist.",
      ];
      rec.bn = [
        "লক্ষণগুলো পর্যবেক্ষণ করুন এবং পরিবর্তন লক্ষ করুন।",
        "বিশ্রাম নিন এবং পানীয় গ্রহণ বজায় রাখুন।",
        "লক্ষণ বাড়লে বা চলতে থাকলে চিকিৎসকের সাথে যোগাযোগ করুন।",
      ];
    }
    return rec;
  }

  private generateMessage(
    urgency: "monitor" | "consult" | "urgent",
    severity: "mild" | "moderate" | "severe",
    symptoms: string[],
    language: "en" | "bn"
  ): { en: string; bn: string } {
    if (urgency === "urgent") {
      return {
        en: "Your symptoms require urgent medical attention. Go to the nearest hospital now.",
        bn: "আপনার লক্ষণগুলোর জন্য অবিলম্বে চিকিৎসা প্রয়োজন। এখনই নিকটস্থ হাসপাতালে যান।",
      };
    } else if (urgency === "consult") {
      return {
        en: "Please consult a healthcare provider soon for proper evaluation.",
        bn: "সঠিক মূল্যায়নের জন্য শীঘ্রই একজন চিকিৎসকের সাথে পরামর্শ করুন।",
      };
    }
    return {
      en: "Symptoms appear mild—monitor at home and rest. Seek care if they worsen.",
      bn: "লক্ষণগুলো হালকা—বাসায় পর্যবেক্ষণ ও বিশ্রাম নিন। খারাপ হলে চিকিৎসা নিন।",
    };
  }
}

// Export singleton
export const healthAI = new HealthAIService();
