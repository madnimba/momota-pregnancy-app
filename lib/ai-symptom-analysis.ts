// AI service for processing natural language symptom descriptions
// This will be enhanced with real AI models later

export interface SymptomAnalysisResult {
  extractedSymptoms: string[]
  severity: "mild" | "moderate" | "severe"
  urgency: "monitor" | "consult" | "urgent"
  riskLevel: "low" | "medium" | "high"
  possibleConditions: string[]
  recommendations: {
    en: string[]
    bn: string[]
  }
  message: {
    en: string
    bn: string
  }
  language: "en" | "bn" | "mixed"
}

// Keywords for symptom detection (can be expanded)
const symptomKeywords = {
  en: {
    fever: ["fever", "temperature", "hot", "burning up", "feverish"],
    pain: ["pain", "ache", "hurt", "sore", "tender", "cramp"],
    bleeding: ["bleeding", "blood", "spotting", "hemorrhage"],
    nausea: ["nausea", "vomit", "sick", "queasy", "throw up"],
    headache: ["headache", "head pain", "migraine"],
    dizziness: ["dizzy", "faint", "lightheaded", "spinning"],
    breathing: ["breathing", "breathe", "breath", "shortness", "suffocation"],
    discharge: ["discharge", "fluid", "leak", "secretion"]
  },
  bn: {
    fever: ["জ্বর", "তাপমাত্রা", "গরম", "জ্বর জ্বর"],
    pain: ["ব্যথা", "যন্ত্রণা", "কষ্ট", "ফুলে"],
    bleeding: ["রক্তপাত", "রক্ত", "রক্তক্ষরণ"],
    nausea: ["বমি", "গা গুলিয়ে", "বমি বমি"],
    headache: ["মাথাব্যথা", "মাথা ব্যথা", "মাথার যন্ত্রণা"],
    dizziness: ["মাথা ঘোরা", "চক্কর", "অজ্ঞান"],
    breathing: ["শ্বাস", "শ্বাসকষ্ট", "দম"],
    discharge: ["স্রাব", "নিঃসরণ", "ক্ষরণ"]
  }
}

// Severity indicators
const severityKeywords = {
  severe: {
    en: ["severe", "intense", "extreme", "unbearable", "terrible", "very bad", "worst"],
    bn: ["তীব্র", "অসহ্য", "খুব", "ভীষণ", "প্রচণ্ড", "অত্যধিক"]
  },
  moderate: {
    en: ["moderate", "medium", "noticeable", "bothering", "uncomfortable"],
    bn: ["মাঝারি", "মোটামুটি", "অস্বস্তিকর", "বিরক্তিকর"]
  }
}

// Urgency indicators  
const urgencyKeywords = {
  urgent: {
    en: ["emergency", "urgent", "immediate", "sudden", "sharp", "can't", "unable", "heavy bleeding"],
    bn: ["জরুরি", "তাৎক্ষণিক", "হঠাৎ", "তীক্ষ্ণ", "পারছি না", "অক্ষম", "ভারী রক্তপাত"]
  }
}

function detectLanguage(text: string): "en" | "bn" | "mixed" {
  const bengaliPattern = /[\u0980-\u09FF]/
  const englishPattern = /[A-Za-z]/
  
  const hasBengali = bengaliPattern.test(text)
  const hasEnglish = englishPattern.test(text)
  
  if (hasBengali && hasEnglish) return "mixed"
  if (hasBengali) return "bn"
  return "en"
}

function extractSymptoms(text: string, language: "en" | "bn" | "mixed"): string[] {
  const extractedSymptoms: string[] = []
  const lowerText = text.toLowerCase()
  
  // Check both languages if mixed or unknown
  const languagesToCheck = language === "mixed" ? ["en", "bn"] : [language === "bn" ? "bn" : "en"]
  
  for (const lang of languagesToCheck) {
    const keywords = symptomKeywords[lang as keyof typeof symptomKeywords]
    
    for (const [symptom, variations] of Object.entries(keywords)) {
      for (const variation of variations) {
        if (lowerText.includes(variation.toLowerCase())) {
          if (!extractedSymptoms.includes(symptom)) {
            extractedSymptoms.push(symptom)
          }
          break
        }
      }
    }
  }
  
  return extractedSymptoms
}

function determineSeverity(text: string): "mild" | "moderate" | "severe" {
  const lowerText = text.toLowerCase()
  
  // Check for severe indicators
  for (const lang of ["en", "bn"]) {
    const severeWords = severityKeywords.severe[lang as keyof typeof severityKeywords.severe]
    for (const word of severeWords) {
      if (lowerText.includes(word.toLowerCase())) {
        return "severe"
      }
    }
  }
  
  // Check for moderate indicators
  for (const lang of ["en", "bn"]) {
    const moderateWords = severityKeywords.moderate[lang as keyof typeof severityKeywords.moderate]
    for (const word of moderateWords) {
      if (lowerText.includes(word.toLowerCase())) {
        return "moderate"
      }
    }
  }
  
  return "mild"
}

function determineUrgency(text: string, extractedSymptoms: string[], severity: "mild" | "moderate" | "severe"): "monitor" | "consult" | "urgent" {
  const lowerText = text.toLowerCase()
  
  // Check for urgent keywords
  for (const lang of ["en", "bn"]) {
    const urgentWords = urgencyKeywords.urgent[lang as keyof typeof urgencyKeywords.urgent]
    for (const word of urgentWords) {
      if (lowerText.includes(word.toLowerCase())) {
        return "urgent"
      }
    }
  }
  
  // Check for urgent symptom combinations
  const urgentSymptoms = ["bleeding", "breathing", "severe-pain"]
  const hasUrgentSymptom = extractedSymptoms.some(symptom => urgentSymptoms.includes(symptom))
  
  if (hasUrgentSymptom || severity === "severe") {
    return "urgent"
  }
  
  if (extractedSymptoms.length >= 3 || severity === "moderate") {
    return "consult"
  }
  
  return "monitor"
}

function generateRecommendations(
  urgency: "monitor" | "consult" | "urgent",
  extractedSymptoms: string[],
  severity: "mild" | "moderate" | "severe"
): { en: string[], bn: string[] } {
  
  if (urgency === "urgent") {
    return {
      en: [
        "Seek immediate medical attention",
        "Go to the nearest emergency room",
        "Call your doctor or emergency services",
        "Do not delay treatment",
        "Have someone accompany you"
      ],
      bn: [
        "অবিলম্বে চিকিৎসা সহায়তা নিন",
        "নিকটতম জরুরি বিভাগে যান",
        "আপনার ডাক্তার বা জরুরি সেবায় কল করুন",
        "চিকিৎসা বিলম্বিত করবেন না",
        "কাউকে সাথে নিয়ে যান"
      ]
    }
  }
  
  if (urgency === "consult") {
    return {
      en: [
        "Contact your healthcare provider today",
        "Schedule an appointment within 24-48 hours",
        "Monitor symptoms closely",
        "Rest and stay hydrated",
        "Keep a symptom diary"
      ],
      bn: [
        "আজই আপনার স্বাস্থ্যসেবা প্রদানকারীর সাথে যোগাযোগ করুন",
        "২৪-৪৮ ঘন্টার মধ্যে অ্যাপয়েন্টমেন্ট নিন",
        "লক্ষণগুলো ঘনিষ্ঠভাবে পর্যবেক্ষণ করুন",
        "বিশ্রাম নিন এবং হাইড্রেটেড থাকুন",
        "লক্ষণের ডায়েরি রাখুন"
      ]
    }
  }
  
  // Monitor
  return {
    en: [
      "Continue monitoring symptoms",
      "Rest and maintain good hydration", 
      "Eat nutritious meals",
      "Contact doctor if symptoms worsen",
      "Maintain regular prenatal checkups"
    ],
    bn: [
      "লক্ষণগুলো পর্যবেক্ষণ চালিয়ে যান",
      "বিশ্রাম নিন এবং পর্যাপ্ত পানি পান করুন",
      "পুষ্টিকর খাবার খান",
      "লক্ষণ খারাপ হলে ডাক্তারের সাথে যোগাযোগ করুন",
      "নিয়মিত প্রসবপূর্ব চেকআপ বজায় রাখুন"
    ]
  }
}

export function analyzeSymptomDescription(description: string): SymptomAnalysisResult {
  // Detect language
  const language = detectLanguage(description)
  
  // Extract symptoms from text
  const extractedSymptoms = extractSymptoms(description, language)
  
  // Determine severity
  const severity = determineSeverity(description)
  
  // Determine urgency
  const urgency = determineUrgency(description, extractedSymptoms, severity)
  
  // Map urgency to risk level
  const riskLevel: "low" | "medium" | "high" = 
    urgency === "urgent" ? "high" : 
    urgency === "consult" ? "medium" : "low"
  
  // Generate possible conditions (simplified for now)
  const possibleConditions = []
  if (extractedSymptoms.includes("fever") && extractedSymptoms.includes("pain")) {
    possibleConditions.push("Infection", "Urinary tract infection")
  }
  if (extractedSymptoms.includes("bleeding")) {
    possibleConditions.push("Pregnancy complications", "Placental issues")
  }
  if (extractedSymptoms.includes("headache") && extractedSymptoms.includes("dizziness")) {
    possibleConditions.push("Preeclampsia", "High blood pressure")
  }
  
  if (possibleConditions.length === 0) {
    possibleConditions.push("General pregnancy discomfort", "Common symptoms")
  }
  
  // Generate recommendations
  const recommendations = generateRecommendations(urgency, extractedSymptoms, severity)
  
  // Generate message
  const message = {
    en: urgency === "urgent" 
      ? "Based on your description, you need immediate medical attention. Please seek care right away."
      : urgency === "consult"
      ? "Your symptoms suggest you should consult with your healthcare provider soon."
      : "Your symptoms appear manageable. Continue monitoring and maintain regular checkups.",
    bn: urgency === "urgent"
      ? "আপনার বর্ণনার ভিত্তিতে, আপনার অবিলম্বে চিকিৎসা প্রয়োজন। অনুগ্রহ করে এখনই চিকিৎসা নিন।"
      : urgency === "consult"  
      ? "আপনার লক্ষণগুলো বলছে যে আপনার শীঘ্রই স্বাস্থ্যসেবা প্রদানকারীর পরামর্শ নেওয়া উচিত।"
      : "আপনার লক্ষণগুলো নিয়ন্ত্রণযোগ্য বলে মনে হচ্ছে। পর্যবেক্ষণ চালিয়ে যান এবং নিয়মিত চেকআপ রাখুন।"
  }
  
  return {
    extractedSymptoms,
    severity,
    urgency,
    riskLevel,
    possibleConditions,
    recommendations,
    message,
    language
  }
}

// Enhanced analysis combining checkboxes + text description
export function analyzeSymptomsCombined(
  selectedSymptoms: string[],
  description: string
): SymptomAnalysisResult {
  
  if (!description.trim()) {
    // Fall back to checkbox-only analysis (existing logic)
    const severityScore = selectedSymptoms.length
    const urgentSymptoms = ["high-fever", "severe-pain", "bleeding", "difficulty-breathing"]
    const hasUrgentSymptom = selectedSymptoms.some(s => urgentSymptoms.includes(s))
    
    const urgency = hasUrgentSymptom || severityScore >= 4 ? "urgent" : 
                   severityScore >= 2 ? "consult" : "monitor"
    
    return {
      extractedSymptoms: selectedSymptoms,
      severity: hasUrgentSymptom ? "severe" : severityScore >= 2 ? "moderate" : "mild",
      urgency,
      riskLevel: urgency === "urgent" ? "high" : urgency === "consult" ? "medium" : "low",
      possibleConditions: ["Based on selected symptoms"],
      recommendations: generateRecommendations(urgency, selectedSymptoms, "moderate"),
      message: {
        en: "Assessment based on selected symptoms.",
        bn: "নির্বাচিত লক্ষণের ভিত্তিতে মূল্যায়ন।"
      },
      language: "mixed"
    }
  }
  
  // Analyze text description
  const textAnalysis = analyzeSymptomDescription(description)
  
  // Combine with checkbox symptoms
  const combinedSymptoms = [...new Set([...selectedSymptoms, ...textAnalysis.extractedSymptoms])]
  
  // Use the more severe assessment
  const finalUrgency = (selectedSymptoms.length >= 3 || textAnalysis.urgency === "urgent") ? 
    "urgent" : textAnalysis.urgency
  
  return {
    ...textAnalysis,
    extractedSymptoms: combinedSymptoms,
    urgency: finalUrgency,
    riskLevel: finalUrgency === "urgent" ? "high" : finalUrgency === "consult" ? "medium" : "low"
  }
}