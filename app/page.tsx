"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Shield, Brain, Volume2, Save, AlertTriangle, Activity, Droplet, Apple, Stethoscope } from "lucide-react"
import Link from "next/link"
import { analyzeInfection, type InfectionResult } from "@/lib/ai-mock"
import { speak } from "@/lib/speech"
import { saveHealthLog } from "@/lib/storage"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [result, setResult] = useState<InfectionResult | null>(null)
  const [showSymptomChecker, setShowSymptomChecker] = useState(false)

  const symptomOptions = [
    { id: "fever", en: "Fever (>100.4°F)", bn: "জ্বর (>১০০.৪°F)" },
    { id: "high-fever", en: "High fever (>102°F)", bn: "উচ্চ জ্বর (>১০২°F)" },
    { id: "severe-pain", en: "Severe abdominal pain", bn: "তীব্র পেটে ব্যথা" },
    { id: "bleeding", en: "Vaginal bleeding", bn: "যোনি রক্তপাত" },
    { id: "difficulty-breathing", en: "Difficulty breathing", bn: "শ্বাস নিতে অসুবিধা" },
    { id: "dizziness", en: "Dizziness or fainting", bn: "মাথা ঘোরা বা অজ্ঞান" },
    { id: "pain", en: "Abdominal pain", bn: "পেটে ব্যথা" },
    { id: "burning", en: "Burning during urination", bn: "প্রস্রাবে জ্বালাপোড়া" },
    { id: "discharge", en: "Unusual discharge", bn: "অস্বাভাবিক স্রাব" },
    { id: "headache", en: "Persistent headache", bn: "ক্রমাগত মাথাব্যথা" },
  ]

  const toggleSymptom = (symptomId: string) => {
    setSymptoms((prev) => (prev.includes(symptomId) ? prev.filter((s) => s !== symptomId) : [...prev, symptomId]))
  }

  const handleAnalysis = () => {
    if (symptoms.length === 0) return
    const analysisResult = analyzeInfection(symptoms)
    setResult(analysisResult)
    speak(analysisResult.message[language], language)
  }

  const saveLog = () => {
    if (!result) return
    saveHealthLog({
      type: "infection",
      data: { symptoms, urgency: result.urgency },
      result: result.message.en,
      riskLevel: result.riskLevel,
    })
    router.push("/logs")
  }

  const getRiskColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-b border-border sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">মমতা</h1>
            <p className="text-xs text-muted-foreground">Momota</p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold text-balance">
            {t("How are you feeling today?", "আজ আপনি কেমন অনুভব করছেন?")}
          </h2>
          <p className="text-sm text-muted-foreground text-balance leading-relaxed">
            {t(
              "Are you experiencing any discomfort or symptoms? Let me help you.",
              "আপনি কি কোনো অস্বস্তি বা লক্ষণ অনুভব করছেন? আমি আপনাকে সাহায্য করি।",
            )}
          </p>
        </div>

        {!showSymptomChecker ? (
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start gap-3 mb-4">
              <Stethoscope className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-balance mb-1">{t("Quick Symptom Check", "দ্রুত লক্ষণ পরীক্ষা")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "Tell me what you're feeling, and I'll help assess if you need immediate care",
                    "আপনি কী অনুভব করছেন তা বলুন, আমি মূল্যায়ন করতে সাহায্য করব",
                  )}
                </p>
              </div>
            </div>
            <Button onClick={() => setShowSymptomChecker(true)} className="w-full" size="lg">
              {t("Check My Symptoms", "আমার লক্ষণ পরীক্ষা করুন")}
            </Button>
          </Card>
        ) : (
          <>
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t("Select your symptoms", "আপনার লক্ষণ নির্বাচন করুন")}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowSymptomChecker(false)}>
                  {t("Cancel", "বাতিল")}
                </Button>
              </div>

              <div className="space-y-3">
                {symptomOptions.map((symptom) => (
                  <div key={symptom.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={symptom.id}
                      checked={symptoms.includes(symptom.id)}
                      onCheckedChange={() => toggleSymptom(symptom.id)}
                      className="mt-0.5"
                    />
                    <label htmlFor={symptom.id} className="text-sm leading-relaxed cursor-pointer flex-1">
                      {symptom[language]}
                    </label>
                  </div>
                ))}
              </div>

              {symptoms.length > 0 && (
                <Button onClick={handleAnalysis} className="w-full" size="lg">
                  {t("Assess Symptoms", "লক্ষণ মূল্যায়ন করুন")} ({symptoms.length})
                </Button>
              )}
            </Card>

            {result && (
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t("Assessment", "মূল্যায়ন")}</h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(result.riskLevel)}`}
                  >
                    {t(
                      result.urgency === "urgent" ? "URGENT" : "Monitor",
                      result.urgency === "urgent" ? "জরুরি" : "পর্যবেক্ষণ",
                    )}
                  </div>
                </div>

                {result.urgency === "urgent" && (
                  <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-800 mb-1">
                          {t("URGENT MEDICAL ATTENTION NEEDED", "জরুরি চিকিৎসা প্রয়োজন")}
                        </p>
                        <p className="text-xs text-red-700">
                          {t(
                            "Please seek immediate medical care. Do not delay.",
                            "অবিলম্বে চিকিৎসা সেবা নিন। বিলম্ব করবেন না।",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed font-medium">{result.message[language]}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => speak(result.message[language], language)}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {t("Listen", "শুনুন")}
                  </Button>
                  <Button className="flex-1" onClick={saveLog}>
                    <Save className="h-4 w-4 mr-2" />
                    {t("Save Log", "লগ সংরক্ষণ করুন")}
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}

        <div className="space-y-3">
          <h3 className="font-semibold text-lg px-1">{t("Smart Health Tools", "স্মার্ট স্বাস্থ্য সরঞ্জাম")}</h3>

          <Link href="/tools/anemia">
            <Card className="p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-card to-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Droplet className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-balance">{t("Anemia Detection", "রক্তস্বল্পতা সনাক্তকরণ")}</h4>
                  <p className="text-xs text-muted-foreground">
                    {t("Photo-based anemia check", "ছবি-ভিত্তিক রক্তস্বল্পতা পরীক্ষা")}
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/tools/bp">
            <Card className="p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-card to-blue-50 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-balance">
                    {t("BP & Preeclampsia Guard", "বিপি ও প্রিক্ল্যাম্পসিয়া গার্ড")}
                  </h4>
                  <p className="text-xs text-muted-foreground">{t("Blood pressure monitoring", "রক্তচাপ পর্যবেক্ষণ")}</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/tools/diabetes">
            <Card className="p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-card to-amber-50 border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-balance">{t("Diabetes Monitor", "ডায়াবেটিস মনিটর")}</h4>
                  <p className="text-xs text-muted-foreground">{t("Glucose & food tracking", "গ্লুকোজ ও খাদ্য ট্র্যাকিং")}</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/tools/nutrition">
            <Card className="p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-card to-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Apple className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-balance">
                    {t("Diet & Nutrition Planner", "খাদ্য ও পুষ্টি পরিকল্পনাকারী")}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t("Meal analysis & planning", "খাবার বিশ্লেষণ ও পরিকল্পনা")}
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/tools">
            <Button variant="outline" className="w-full bg-transparent">
              {t("View All Tools", "সব সরঞ্জাম দেখুন")}
            </Button>
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <Card className="p-3 text-center bg-gradient-to-br from-card to-primary/5">
            <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs font-medium">{t("AI Protection", "এআই সুরক্ষা")}</p>
          </Card>
          <Card className="p-3 text-center bg-gradient-to-br from-card to-secondary/10">
            <Volume2 className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-xs font-medium">{t("Voice Guide", "ভয়েস গাইড")}</p>
          </Card>
          <Card className="p-3 text-center bg-gradient-to-br from-card to-accent/10">
            <Heart className="w-6 h-6 text-accent mx-auto mb-2" fill="currentColor" />
            <p className="text-xs font-medium">{t("24/7 Care", "২৪/৭ যত্ন")}</p>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground space-y-2 pt-4">
          <p className="text-xs">{t("Built with care for mothers", "মায়েদের জন্য যত্ন সহকারে নির্মিত")}</p>
          <div className="flex justify-center gap-4 text-xs">
            <Link href="/about" className="hover:text-foreground transition-colors">
              {t("About", "সম্পর্কে")}
            </Link>
            <span>•</span>
            <Link href="/settings" className="hover:text-foreground transition-colors">
              {t("Settings", "সেটিংস")}
            </Link>
          </div>
        </footer>
      </main>

      <Navigation />
    </div>
  )
}
