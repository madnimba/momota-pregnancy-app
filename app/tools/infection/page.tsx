"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Volume2, Save, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { analyzeInfection, type InfectionResult } from "@/lib/ai-mock"
import { speak } from "@/lib/speech"
import { saveHealthLog } from "@/lib/storage"
import { useRouter } from "next/navigation"

export default function InfectionToolPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [result, setResult] = useState<InfectionResult | null>(null)

  const symptomOptions = [
    { id: "fever", en: "Fever (>100.4°F / 38°C)", bn: "জ্বর (>১০০.৪°F / ৩৮°C)" },
    { id: "high-fever", en: "High fever (>102°F / 39°C)", bn: "উচ্চ জ্বর (>১০২°F / ৩৯°C)" },
    { id: "chills", en: "Chills or shaking", bn: "ঠান্ডা লাগা বা কাঁপুনি" },
    { id: "pain", en: "Abdominal pain", bn: "পেটে ব্যথা" },
    { id: "severe-pain", en: "Severe abdominal pain", bn: "তীব্র পেটে ব্যথা" },
    { id: "back-pain", en: "Lower back pain", bn: "পিঠের নিচের দিকে ব্যথা" },
    { id: "burning", en: "Burning during urination", bn: "প্রস্রাবের সময় জ্বালাপোড়া" },
    { id: "discharge", en: "Unusual vaginal discharge", bn: "অস্বাভাবিক যোনি স্রাব" },
    { id: "bleeding", en: "Vaginal bleeding", bn: "যোনি রক্তপাত" },
    { id: "nausea", en: "Nausea or vomiting", bn: "বমি বমি ভাব বা বমি" },
    { id: "headache", en: "Persistent headache", bn: "ক্রমাগত মাথাব্যথা" },
    { id: "difficulty-breathing", en: "Difficulty breathing", bn: "শ্বাস নিতে অসুবিধা" },
    { id: "dizziness", en: "Dizziness or fainting", bn: "মাথা ঘোরা বা অজ্ঞান হওয়া" },
    { id: "contractions", en: "Regular contractions", bn: "নিয়মিত সংকোচন" },
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
      <header className="bg-gradient-to-br from-purple-50 to-pink-50 border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{t("Infection Triage", "সংক্রমণ ট্রাইয়েজ")}</h1>
            <p className="text-xs text-muted-foreground">{t("Symptom assessment", "লক্ষণ মূল্যায়ন")}</p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-balance mb-1">
                {t("Select all symptoms you are experiencing", "আপনি যে সমস্ত লক্ষণ অনুভব করছেন তা নির্বাচন করুন")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t(
                  "This tool helps assess urgency, not diagnose conditions",
                  "এই টুলটি জরুরিতা মূল্যায়ন করতে সাহায্য করে, অবস্থা নির্ণয় করে না",
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="font-semibold">{t("Symptoms", "লক্ষণ")}</h3>
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
        </Card>

        {symptoms.length > 0 && (
          <Button onClick={handleAnalysis} className="w-full" size="lg">
            {t("Assess Symptoms", "লক্ষণ মূল্যায়ন করুন")} ({symptoms.length})
          </Button>
        )}

        {result && (
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{t("Assessment", "মূল্যায়ন")}</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(result.riskLevel)}`}>
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
                        "অনুগ্রহ করে অবিলম্বে চিকিৎসা সেবা নিন। বিলম্ব করবেন না।",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed font-medium">{result.message[language]}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{t("Possible Conditions", "সম্ভাব্য অবস্থা")}</h4>
              <div className="flex flex-wrap gap-2">
                {result.possibleConditions.map((condition, idx) => (
                  <span key={idx} className="px-3 py-1 bg-secondary rounded-full text-xs">
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{t("What to do", "কি করতে হবে")}</h4>
              <ul className="space-y-2">
                {result.recommendations[language].map((rec, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
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

        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-xs text-blue-800 leading-relaxed">
            {t(
              "Note: This tool provides guidance only. Always consult a healthcare provider for proper diagnosis and treatment.",
              "দ্রষ্টব্য: এই টুলটি শুধুমাত্র নির্দেশনা প্রদান করে। সঠিক নির্ণয় এবং চিকিৎসার জন্য সর্বদা একজন স্বাস্থ্যসেবা প্রদানকারীর পরামর্শ নিন।",
            )}
          </p>
        </Card>
      </main>

      <Navigation />
    </div>
  )
}
