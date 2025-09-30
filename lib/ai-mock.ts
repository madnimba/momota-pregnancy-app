// Mock AI analysis functions with realistic logic

export interface AnemiaResult {
  pallorLevel: number // 0-100
  riskLevel: "low" | "medium" | "high"
  ironDeficiency: boolean
  recommendations: {
    en: string[]
    bn: string[]
  }
  message: {
    en: string
    bn: string
  }
}

export function analyzeAnemia(imageData?: string): AnemiaResult {
  // Mock analysis based on random but realistic patterns
  const pallorLevel = Math.floor(Math.random() * 100)
  const ironDeficiency = pallorLevel > 50

  let riskLevel: "low" | "medium" | "high"
  if (pallorLevel < 30) riskLevel = "low"
  else if (pallorLevel < 60) riskLevel = "medium"
  else riskLevel = "high"

  const recommendations = {
    en:
      riskLevel === "high"
        ? [
            "Consult a doctor immediately",
            "Eat iron-rich foods: spinach, lentils, fish",
            "Take iron supplements as prescribed",
            "Avoid tea/coffee with meals",
          ]
        : riskLevel === "medium"
          ? ["Increase iron intake", "Eat green vegetables daily", "Include fish and eggs", "Monitor symptoms"]
          : ["Maintain balanced diet", "Regular checkups", "Stay hydrated"],
    bn:
      riskLevel === "high"
        ? [
            "অবিলম্বে ডাক্তারের পরামর্শ নিন",
            "আয়রন সমৃদ্ধ খাবার খান: পালং শাক, ডাল, মাছ",
            "নির্দেশিত আয়রন সাপ্লিমেন্ট নিন",
            "খাবারের সাথে চা/কফি এড়িয়ে চলুন",
          ]
        : riskLevel === "medium"
          ? ["আয়রন গ্রহণ বাড়ান", "প্রতিদিন সবুজ শাকসবজি খান", "মাছ এবং ডিম অন্তর্ভুক্ত করুন", "লক্ষণ পর্যবেক্ষণ করুন"]
          : ["সুষম খাদ্য বজায় রাখুন", "নিয়মিত চেকআপ", "হাইড্রেটেড থাকুন"],
  }

  const message = {
    en:
      riskLevel === "high"
        ? "High risk of anemia detected. Please consult a healthcare provider immediately."
        : riskLevel === "medium"
          ? "Moderate anemia risk. Increase iron-rich foods in your diet."
          : "Low anemia risk. Continue maintaining a healthy diet.",
    bn:
      riskLevel === "high"
        ? "রক্তস্বল্পতার উচ্চ ঝুঁকি সনাক্ত হয়েছে। অনুগ্রহ করে অবিলম্বে স্বাস্থ্যসেবা প্রদানকারীর পরামর্শ নিন।"
        : riskLevel === "medium"
          ? "মাঝারি রক্তস্বল্পতার ঝুঁকি। আপনার খাদ্যতালিকায় আয়রন সমৃদ্ধ খাবার বাড়ান।"
          : "কম রক্তস্বল্পতার ঝুঁকি। স্বাস্থ্যকর খাদ্য বজায় রাখুন।",
  }

  return {
    pallorLevel,
    riskLevel,
    ironDeficiency,
    recommendations,
    message,
  }
}

export interface NutritionResult {
  iron: number // mg
  protein: number // g
  calcium: number // mg
  calories: number
  riskLevel: "low" | "medium" | "high"
  missing: string[]
  recommendations: {
    en: string[]
    bn: string[]
  }
  message: {
    en: string
    bn: string
  }
}

export function analyzeMealNutrition(imageData?: string): NutritionResult {
  // Mock nutrition analysis
  const iron = Math.floor(Math.random() * 20) + 5
  const protein = Math.floor(Math.random() * 40) + 10
  const calcium = Math.floor(Math.random() * 800) + 200
  const calories = Math.floor(Math.random() * 600) + 300

  const missing: string[] = []
  if (iron < 15) missing.push("iron")
  if (protein < 25) missing.push("protein")
  if (calcium < 500) missing.push("calcium")

  const riskLevel = missing.length >= 2 ? "high" : missing.length === 1 ? "medium" : "low"

  const recommendations = {
    en:
      riskLevel === "high"
        ? [
            "Add more protein: fish, eggs, lentils",
            "Include leafy greens for iron",
            "Add dairy or fortified foods for calcium",
            "Eat small frequent meals",
          ]
        : riskLevel === "medium"
          ? ["Add one iron-rich food", "Include protein in every meal", "Drink milk or eat yogurt"]
          : ["Well-balanced meal", "Continue eating variety", "Stay consistent"],
    bn:
      riskLevel === "high"
        ? [
            "আরও প্রোটিন যোগ করুন: মাছ, ডিম, ডাল",
            "আয়রনের জন্য পাতাযুক্ত শাক অন্তর্ভুক্ত করুন",
            "ক্যালসিয়ামের জন্য দুগ্ধজাত বা সুরক্ষিত খাবার যোগ করুন",
            "ছোট ঘন ঘন খাবার খান",
          ]
        : riskLevel === "medium"
          ? ["একটি আয়রন সমৃদ্ধ খাবার যোগ করুন", "প্রতিটি খাবারে প্রোটিন অন্তর্ভুক্ত করুন", "দুধ পান করুন বা দই খান"]
          : ["সুষম খাবার", "বৈচিত্র্যময় খাবার খেতে থাকুন", "সামঞ্জস্যপূর্ণ থাকুন"],
  }

  const message = {
    en:
      riskLevel === "high"
        ? `Meal is lacking ${missing.join(", ")}. Add more nutrient-rich foods.`
        : riskLevel === "medium"
          ? `Good meal, but could use more ${missing[0]}.`
          : "Well-balanced nutritious meal!",
    bn:
      riskLevel === "high"
        ? `খাবারে ${missing.join(", ")} এর অভাব রয়েছে। আরও পুষ্টি সমৃদ্ধ খাবার যোগ করুন।`
        : riskLevel === "medium"
          ? `ভালো খাবার, তবে আরও ${missing[0]} প্রয়োজন।`
          : "সুষম পুষ্টিকর খাবার!",
  }

  return {
    iron,
    protein,
    calcium,
    calories,
    riskLevel,
    missing,
    recommendations,
    message,
  }
}

export interface BPResult {
  systolic: number
  diastolic: number
  riskLevel: "low" | "medium" | "high"
  preeclampsiaRisk: boolean
  symptoms: string[]
  recommendations: {
    en: string[]
    bn: string[]
  }
  message: {
    en: string
    bn: string
  }
}

export function analyzeBP(imageData?: string, symptoms?: string[]): BPResult {
  // Mock OCR extraction of BP values
  const systolic = Math.floor(Math.random() * 60) + 100 // 100-160
  const diastolic = Math.floor(Math.random() * 40) + 60 // 60-100

  let riskLevel: "low" | "medium" | "high"
  const preeclampsiaRisk = systolic >= 140 || diastolic >= 90 || (symptoms && symptoms.length >= 2)

  if (systolic >= 140 || diastolic >= 90) {
    riskLevel = "high"
  } else if (systolic >= 130 || diastolic >= 85) {
    riskLevel = "medium"
  } else {
    riskLevel = "low"
  }

  const recommendations = {
    en:
      riskLevel === "high"
        ? [
            "Seek immediate medical attention",
            "Monitor BP twice daily",
            "Reduce salt intake",
            "Rest and avoid stress",
            "Watch for severe headaches or vision changes",
          ]
        : riskLevel === "medium"
          ? ["Monitor BP daily", "Limit salt and caffeine", "Get adequate rest", "Consult doctor if symptoms worsen"]
          : ["Continue regular checkups", "Maintain healthy diet", "Stay active", "Monitor weekly"],
    bn:
      riskLevel === "high"
        ? [
            "অবিলম্বে চিকিৎসা সহায়তা নিন",
            "দিনে দুবার রক্তচাপ পর্যবেক্ষণ করুন",
            "লবণ গ্রহণ কমান",
            "বিশ্রাম নিন এবং চাপ এড়িয়ে চলুন",
            "তীব্র মাথাব্যথা বা দৃষ্টি পরিবর্তনের জন্য সতর্ক থাকুন",
          ]
        : riskLevel === "medium"
          ? [
              "প্রতিদিন রক্তচাপ পর্যবেক্ষণ করুন",
              "লবণ এবং ক্যাফেইন সীমিত করুন",
              "পর্যাপ্ত বিশ্রাম নিন",
              "লক্ষণ খারাপ হলে ডাক্তারের পরামর্শ নিন",
            ]
          : ["নিয়মিত চেকআপ চালিয়ে যান", "স্বাস্থ্যকর খাদ্য বজায় রাখুন", "সক্রিয় থাকুন", "সাপ্তাহিক পর্যবেক্ষণ করুন"],
  }

  const message = {
    en: preeclampsiaRisk
      ? `High BP detected (${systolic}/${diastolic}). Preeclampsia risk present. Call your doctor immediately.`
      : riskLevel === "medium"
        ? `BP is elevated (${systolic}/${diastolic}). Monitor closely and reduce salt intake.`
        : `BP is normal (${systolic}/${diastolic}). Continue healthy habits.`,
    bn: preeclampsiaRisk
      ? `উচ্চ রক্তচাপ সনাক্ত হয়েছে (${systolic}/${diastolic})। প্রিক্ল্যাম্পসিয়ার ঝুঁকি রয়েছে। এখনই আপনার ডাক্তারকে কল করুন।`
      : riskLevel === "medium"
        ? `রক্তচাপ বৃদ্ধি পেয়েছে (${systolic}/${diastolic})। ঘনিষ্ঠভাবে পর্যবেক্ষণ করুন এবং লবণ গ্রহণ কমান।`
        : `রক্তচাপ সাধারণ (${systolic}/${diastolic})। স্বাস্থ্যকর অভ্যাস চালিয়ে যান।`,
  }

  return {
    systolic,
    diastolic,
    riskLevel,
    preeclampsiaRisk,
    symptoms: symptoms || [],
    recommendations,
    message,
  }
}

export interface DiabetesResult {
  glucoseLevel: number
  riskLevel: "low" | "medium" | "high"
  prediction: string
  glycemicLoad: number
  recommendations: {
    en: string[]
    bn: string[]
  }
  message: {
    en: string
    bn: string
  }
}

export function analyzeGlucose(imageData?: string): DiabetesResult {
  // Mock OCR extraction of glucose meter reading
  const glucoseLevel = Math.floor(Math.random() * 100) + 70 // 70-170 mg/dL

  let riskLevel: "low" | "medium" | "high"
  let prediction = ""

  if (glucoseLevel < 70) {
    riskLevel = "high"
    prediction = "Low blood sugar - risk of hypoglycemia"
  } else if (glucoseLevel > 140) {
    riskLevel = "high"
    prediction = "High blood sugar - risk of hyperglycemia"
  } else if (glucoseLevel > 120) {
    riskLevel = "medium"
    prediction = "Slightly elevated - monitor closely"
  } else {
    riskLevel = "low"
    prediction = "Normal range"
  }

  const glycemicLoad = Math.floor(Math.random() * 30) + 10

  const recommendations = {
    en:
      riskLevel === "high" && glucoseLevel > 140
        ? [
            "Reduce carbohydrate intake immediately",
            "Avoid rice, bread, and sweets",
            "Drink plenty of water",
            "Contact your doctor if levels stay high",
            "Monitor glucose every 2-3 hours",
          ]
        : riskLevel === "high" && glucoseLevel < 70
          ? [
              "Eat something sweet immediately (juice, candy)",
              "Rest and recheck in 15 minutes",
              "Keep emergency snacks nearby",
              "Inform someone about your condition",
            ]
          : riskLevel === "medium"
            ? [
                "Reduce portion sizes",
                "Choose whole grains over white rice",
                "Add more vegetables to meals",
                "Monitor after meals",
              ]
            : ["Maintain current diet", "Regular monitoring", "Stay active", "Balanced meals"],
    bn:
      riskLevel === "high" && glucoseLevel > 140
        ? [
            "অবিলম্বে কার্বোহাইড্রেট গ্রহণ কমান",
            "ভাত, রুটি এবং মিষ্টি এড়িয়ে চলুন",
            "প্রচুর পানি পান করুন",
            "মাত্রা উচ্চ থাকলে আপনার ডাক্তারের সাথে যোগাযোগ করুন",
            "প্রতি ২-৩ ঘন্টায় গ্লুকোজ পর্যবেক্ষণ করুন",
          ]
        : riskLevel === "high" && glucoseLevel < 70
          ? [
              "অবিলম্বে মিষ্টি কিছু খান (জুস, ক্যান্ডি)",
              "বিশ্রাম নিন এবং ১৫ মিনিটে পুনরায় পরীক্ষা করুন",
              "জরুরি স্ন্যাকস কাছে রাখুন",
              "আপনার অবস্থা সম্পর্কে কাউকে জানান",
            ]
          : riskLevel === "medium"
            ? ["অংশের আকার কমান", "সাদা চালের পরিবর্তে পুরো শস্য বেছে নিন", "খাবারে আরও শাকসবজি যোগ করুন", "খাবারের পরে পর্যবেক্ষণ করুন"]
            : ["বর্তমান খাদ্য বজায় রাখুন", "নিয়মিত পর্যবেক্ষণ", "সক্রিয় থাকুন", "সুষম খাবার"],
  }

  const message = {
    en:
      glucoseLevel < 70
        ? `Low blood sugar detected (${glucoseLevel} mg/dL). Eat something sweet immediately.`
        : glucoseLevel > 140
          ? `High blood sugar detected (${glucoseLevel} mg/dL). Reduce carbs and monitor closely.`
          : glucoseLevel > 120
            ? `Blood sugar slightly elevated (${glucoseLevel} mg/dL). Watch your diet.`
            : `Blood sugar is normal (${glucoseLevel} mg/dL). Keep up the good work!`,
    bn:
      glucoseLevel < 70
        ? `নিম্ন রক্তে শর্করা সনাক্ত হয়েছে (${glucoseLevel} mg/dL)। অবিলম্বে মিষ্টি কিছু খান।`
        : glucoseLevel > 140
          ? `উচ্চ রক্তে শর্করা সনাক্ত হয়েছে (${glucoseLevel} mg/dL)। কার্বোহাইড্রেট কমান এবং ঘনিষ্ঠভাবে পর্যবেক্ষণ করুন।`
          : glucoseLevel > 120
            ? `রক্তে শর্করা সামান্য বৃদ্ধি পেয়েছে (${glucoseLevel} mg/dL)। আপনার খাদ্য দেখুন।`
            : `রক্তে শর্করা স্বাভাবিক (${glucoseLevel} mg/dL)। ভালো কাজ চালিয়ে যান!`,
  }

  return {
    glucoseLevel,
    riskLevel,
    prediction,
    glycemicLoad,
    recommendations,
    message,
  }
}

export function analyzeFoodGlycemic(imageData?: string): DiabetesResult {
  // Mock food glycemic load analysis
  const glycemicLoad = Math.floor(Math.random() * 50) + 10 // 10-60
  const predictedGlucose = Math.floor(Math.random() * 60) + 100 // 100-160

  let riskLevel: "low" | "medium" | "high"
  if (glycemicLoad > 40) {
    riskLevel = "high"
  } else if (glycemicLoad > 25) {
    riskLevel = "medium"
  } else {
    riskLevel = "low"
  }

  const recommendations = {
    en:
      riskLevel === "high"
        ? [
            "This meal has high sugar impact",
            "Reduce rice/bread portion by half",
            "Add more protein and vegetables",
            "Expect blood sugar spike in 1-2 hours",
          ]
        : riskLevel === "medium"
          ? ["Moderate glycemic load", "Add vegetables to balance", "Monitor after eating", "Good protein content"]
          : ["Low glycemic impact", "Well-balanced meal", "Good for blood sugar control"],
    bn:
      riskLevel === "high"
        ? [
            "এই খাবারে উচ্চ চিনির প্রভাব রয়েছে",
            "ভাত/রুটির অংশ অর্ধেক কমান",
            "আরও প্রোটিন এবং শাকসবজি যোগ করুন",
            "১-২ ঘন্টায় রক্তে শর্করা বৃদ্ধির আশা করুন",
          ]
        : riskLevel === "medium"
          ? ["মাঝারি গ্লাইসেমিক লোড", "ভারসাম্যের জন্য শাকসবজি যোগ করুন", "খাওয়ার পরে পর্যবেক্ষণ করুন", "ভালো প্রোটিন সামগ্রী"]
          : ["কম গ্লাইসেমিক প্রভাব", "সুষম খাবার", "রক্তে শর্করা নিয়ন্ত্রণের জন্য ভালো"],
  }

  const message = {
    en:
      riskLevel === "high"
        ? `High glycemic load (${glycemicLoad}). This meal may cause blood sugar spike. Reduce rice portion.`
        : riskLevel === "medium"
          ? `Moderate glycemic load (${glycemicLoad}). Balanced meal, but watch portions.`
          : `Low glycemic load (${glycemicLoad}). Excellent choice for blood sugar control!`,
    bn:
      riskLevel === "high"
        ? `উচ্চ গ্লাইসেমিক লোড (${glycemicLoad})। এই খাবার রক্তে শর্করা বৃদ্ধি ঘটাতে পারে। চাল কম খান।`
        : riskLevel === "medium"
          ? `মাঝারি গ্লাইসেমিক লোড (${glycemicLoad})। সুষম খাবার, তবে অংশ দেখুন।`
          : `কম গ্লাইসেমিক লোড (${glycemicLoad})। রক্তে শর্করা নিয়ন্ত্রণের জন্য চমৎকার পছন্দ!`,
  }

  return {
    glucoseLevel: predictedGlucose,
    riskLevel,
    prediction: `Predicted glucose: ${predictedGlucose} mg/dL`,
    glycemicLoad,
    recommendations,
    message,
  }
}

export interface InfectionResult {
  urgency: "monitor" | "urgent"
  riskLevel: "low" | "medium" | "high"
  possibleConditions: string[]
  symptoms: string[]
  recommendations: {
    en: string[]
    bn: string[]
  }
  message: {
    en: string
    bn: string
  }
}

export function analyzeInfection(symptoms: string[]): InfectionResult {
  // Mock infection triage based on symptoms
  const severityScore = symptoms.length

  let urgency: "monitor" | "urgent"
  let riskLevel: "low" | "medium" | "high"
  const possibleConditions: string[] = []

  // Check for urgent symptoms
  const urgentSymptoms = ["high-fever", "severe-pain", "bleeding", "difficulty-breathing"]
  const hasUrgentSymptom = symptoms.some((s) => urgentSymptoms.includes(s))

  if (hasUrgentSymptom || severityScore >= 4) {
    urgency = "urgent"
    riskLevel = "high"
    possibleConditions.push("Severe infection", "Urinary tract infection", "Preterm labor risk")
  } else if (severityScore >= 2) {
    urgency = "monitor"
    riskLevel = "medium"
    possibleConditions.push("Mild infection", "Common cold", "Urinary discomfort")
  } else {
    urgency = "monitor"
    riskLevel = "low"
    possibleConditions.push("Minor symptoms", "Normal pregnancy discomfort")
  }

  const recommendations = {
    en:
      urgency === "urgent"
        ? [
            "Seek immediate medical attention",
            "Go to emergency room or call doctor",
            "Do not delay treatment",
            "Bring someone with you",
            "Note all symptoms and their duration",
          ]
        : riskLevel === "medium"
          ? [
              "Monitor symptoms for 24 hours",
              "Rest and stay hydrated",
              "Take temperature regularly",
              "Call doctor if symptoms worsen",
              "Avoid self-medication",
            ]
          : [
              "Continue normal activities",
              "Stay hydrated and rest",
              "Monitor for any changes",
              "Maintain good hygiene",
              "Regular prenatal checkups",
            ],
    bn:
      urgency === "urgent"
        ? [
            "অবিলম্বে চিকিৎসা সহায়তা নিন",
            "জরুরি কক্ষে যান বা ডাক্তারকে কল করুন",
            "চিকিৎসা বিলম্বিত করবেন না",
            "কাউকে সাথে নিয়ে যান",
            "সমস্ত লক্ষণ এবং তাদের সময়কাল নোট করুন",
          ]
        : riskLevel === "medium"
          ? [
              "২৪ ঘন্টার জন্য লক্ষণ পর্যবেক্ষণ করুন",
              "বিশ্রাম নিন এবং হাইড্রেটেড থাকুন",
              "নিয়মিত তাপমাত্রা নিন",
              "লক্ষণ খারাপ হলে ডাক্তারের পরামর্শ নিন",
              "স্ব-ঔষধ এড়িয়ে চলুন",
            ]
          : [
              "স্বাভাবিক কার্যক্রম চালিয়ে যান",
              "হাইড্রেটেড থাকুন এবং বিশ্রাম নিন",
              "যেকোনো পরিবর্তনের জন্য পর্যবেক্ষণ করুন",
              "ভালো স্বাস্থ্যবিধি বজায় রাখুন",
              "নিয়মিত প্রসবপূর্ব চেকআপ",
            ],
  }

  const message = {
    en:
      urgency === "urgent"
        ? "URGENT: These symptoms require immediate medical attention. Please seek care now."
        : riskLevel === "medium"
          ? "Monitor these symptoms closely. Contact your doctor if they worsen or persist."
          : "These symptoms appear mild. Continue monitoring and maintain regular checkups.",
    bn:
      urgency === "urgent"
        ? "জরুরি: এই লক্ষণগুলির জন্য অবিলম্বে চিকিৎসা প্রয়োজন। অনুগ্রহ করে এখনই যত্ন নিন।"
        : riskLevel === "medium"
          ? "এই লক্ষণগুলি ঘনিষ্ঠভাবে পর্যবেক্ষণ করুন। খারাপ হলে বা অব্যাহত থাকলে আপনার ডাক্তারের সাথে যোগাযোগ করুন।"
          : "এই লক্ষণগুলি হালকা বলে মনে হচ্ছে। পর্যবেক্ষণ চালিয়ে যান এবং নিয়মিত চেকআপ বজায় রাখুন।",
  }

  return {
    urgency,
    riskLevel,
    possibleConditions,
    symptoms,
    recommendations,
    message,
  }
}
