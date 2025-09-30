"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { CameraCapture } from "@/components/camera-capture"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Volume2, Save, TrendingUp } from "lucide-react"
import Link from "next/link"
import { imageAnalysisClient } from "@/lib/image-analysis-client"
import { type BPResult } from "@/lib/ai-mock"
import { speak } from "@/lib/speech"
import { saveHealthLog, getHealthLogs } from "@/lib/storage"
import { useRouter } from "next/navigation"

export default function BPToolPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [bpImage, setBpImage] = useState<string | null>(null)
  const [result, setResult] = useState<BPResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [symptoms, setSymptoms] = useState<string[]>([])

  const symptomOptions = [
    { id: "swelling", en: "Swelling in hands/feet", bn: "হাত/পায়ে ফোলাভাব" },
    { id: "headache", en: "Severe headache", bn: "তীব্র মাথাব্যথা" },
    { id: "vision", en: "Blurry vision", bn: "ঝাপসা দৃষ্টি" },
    { id: "pain", en: "Upper abdominal pain", bn: "উপরের পেটে ব্যথা" },
    { id: "nausea", en: "Nausea or vomiting", bn: "বমি বমি ভাব বা বমি" },
  ]

  const toggleSymptom = (symptomId: string) => {
    setSymptoms((prev) => (prev.includes(symptomId) ? prev.filter((s) => s !== symptomId) : [...prev, symptomId]))
  }

  const handleAnalysis = async () => {
    if (!bpImage) return
    setAnalyzing(true)
    try {
      const analysisResult = await imageAnalysisClient.analyzeBP(bpImage, symptoms, language)
      setResult(analysisResult)
      speak(analysisResult.message[language], language)
    } catch (error) {
      console.error("BP analysis failed:", error)
      // Fallback will be handled by the client
    } finally {
      setAnalyzing(false)
    }
  }

  const saveLog = () => {
    if (!result) return
    saveHealthLog({
      type: "bp",
      data: { systolic: result.systolic, diastolic: result.diastolic, symptoms },
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

  const getBPHistory = () => {
    return getHealthLogs()
      .filter((log) => log.type === "bp")
      .slice(-5)
      .reverse()
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{t("BP & Preeclampsia Guard", "রক্তচাপ ও প্রিক্ল্যাম্পসিয়া")}</h1>
            <p className="text-xs text-muted-foreground">{t("Blood pressure monitoring", "রক্তচাপ পর্যবেক্ষণ")}</p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 space-y-4">
          <h3 className="font-semibold text-balance">
            {t("Upload photo of BP machine screen", "রক্তচাপ মেশিনের স্ক্রিনের ছবি আপলোড করুন")}
          </h3>
          <CameraCapture onImageCapture={setBpImage} label="BP machine photo" />
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">{t("Select any symptoms you have", "আপনার যে কোনো লক্ষণ নির্বাচন করুন")}</h3>
          <div className="space-y-3">
            {symptomOptions.map((symptom) => (
              <div key={symptom.id} className="flex items-center space-x-3">
                <Checkbox
                  id={symptom.id}
                  checked={symptoms.includes(symptom.id)}
                  onCheckedChange={() => toggleSymptom(symptom.id)}
                />
                <label htmlFor={symptom.id} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {symptom[language]}
                </label>
              </div>
            ))}
          </div>
        </Card>

        {bpImage && (
          <Button onClick={handleAnalysis} disabled={analyzing} className="w-full" size="lg">
            {analyzing ? t("Analyzing...", "বিশ্লেষণ করা হচ্ছে...") : t("Analyze BP", "রক্তচাপ বিশ্লেষণ করুন")}
          </Button>
        )}

        {result && (
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{t("BP Reading", "রক্তচাপ রিডিং")}</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(result.riskLevel)}`}>
                {t(
                  result.riskLevel === "high" ? "High Risk" : result.riskLevel === "medium" ? "Elevated" : "Normal",
                  result.riskLevel === "high" ? "উচ্চ ঝুঁকি" : result.riskLevel === "medium" ? "উচ্চতর" : "স্বাভাবিক",
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 py-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{result.systolic}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("Systolic", "সিস্টোলিক")}</p>
              </div>
              <div className="text-3xl text-muted-foreground">/</div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{result.diastolic}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("Diastolic", "ডায়াস্টোলিক")}</p>
              </div>
            </div>

            {result.preeclampsiaRisk && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  {t("⚠️ Preeclampsia Risk Detected", "⚠️ প্রিক্ল্যাম্পসিয়ার ঝুঁকি সনাক্ত হয়েছে")}
                </p>
                <p className="text-xs text-red-700">
                  {t(
                    "Please contact your healthcare provider immediately.",
                    "অনুগ্রহ করে অবিলম্বে আপনার স্বাস্থ্যসেবা প্রদানকারীর সাথে যোগাযোগ করুন।",
                  )}
                </p>
              </div>
            )}

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">{result.message[language]}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{t("Recommendations", "সুপারিশ")}</h4>
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

        {getBPHistory().length > 0 && (
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{t("Recent BP History", "সাম্প্রতিক রক্তচাপ ইতিহাস")}</h3>
            </div>
            <div className="space-y-2">
              {getBPHistory().map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">
                      {log.data.systolic}/{log.data.diastolic}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(log.riskLevel)}`}>
                    {t(
                      log.riskLevel === "high" ? "High" : log.riskLevel === "medium" ? "Med" : "Low",
                      log.riskLevel === "high" ? "উচ্চ" : log.riskLevel === "medium" ? "মধ্য" : "কম",
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>

      <Navigation />
    </div>
  )
}
