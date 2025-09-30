"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { CameraCapture } from "@/components/camera-capture"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Volume2, Save, TrendingUp } from "lucide-react"
import Link from "next/link"
import { analyzeGlucose, analyzeFoodGlycemic, type DiabetesResult } from "@/lib/ai-mock"
import { speak } from "@/lib/speech"
import { saveHealthLog, getHealthLogs } from "@/lib/storage"
import { useRouter } from "next/navigation"

export default function DiabetesToolPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [glucoseImage, setGlucoseImage] = useState<string | null>(null)
  const [foodImage, setFoodImage] = useState<string | null>(null)
  const [glucoseResult, setGlucoseResult] = useState<DiabetesResult | null>(null)
  const [foodResult, setFoodResult] = useState<DiabetesResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const handleGlucoseAnalysis = () => {
    if (!glucoseImage) return
    setAnalyzing(true)
    setTimeout(() => {
      const result = analyzeGlucose(glucoseImage)
      setGlucoseResult(result)
      setAnalyzing(false)
      speak(result.message[language], language)
    }, 1500)
  }

  const handleFoodAnalysis = () => {
    if (!foodImage) return
    setAnalyzing(true)
    setTimeout(() => {
      const result = analyzeFoodGlycemic(foodImage)
      setFoodResult(result)
      setAnalyzing(false)
      speak(result.message[language], language)
    }, 1500)
  }

  const saveGlucoseLog = () => {
    if (!glucoseResult) return
    saveHealthLog({
      type: "diabetes",
      data: { glucoseLevel: glucoseResult.glucoseLevel },
      result: glucoseResult.message.en,
      riskLevel: glucoseResult.riskLevel,
    })
    router.push("/logs")
  }

  const saveFoodLog = () => {
    if (!foodResult) return
    saveHealthLog({
      type: "diabetes",
      data: { glycemicLoad: foodResult.glycemicLoad, predictedGlucose: foodResult.glucoseLevel },
      result: foodResult.message.en,
      riskLevel: foodResult.riskLevel,
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

  const getGlucoseHistory = () => {
    return getHealthLogs()
      .filter((log) => log.type === "diabetes" && log.data.glucoseLevel)
      .slice(-5)
      .reverse()
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-amber-50 to-yellow-50 border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{t("Diabetes Monitor", "ডায়াবেটিস মনিটর")}</h1>
            <p className="text-xs text-muted-foreground">{t("Blood sugar tracking", "রক্তে শর্করা ট্র্যাকিং")}</p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <Tabs defaultValue="glucose" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="glucose">{t("Glucose Reading", "গ্লুকোজ রিডিং")}</TabsTrigger>
            <TabsTrigger value="food">{t("Food Analysis", "খাদ্য বিশ্লেষণ")}</TabsTrigger>
          </TabsList>

          <TabsContent value="glucose" className="space-y-6">
            <Card className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <h3 className="font-semibold mb-3 text-balance">
                {t("Upload photo of glucometer", "গ্লুকোমিটারের ছবি আপলোড করুন")}
              </h3>
              <CameraCapture onImageCapture={setGlucoseImage} label="Glucometer photo" />
              {glucoseImage && (
                <Button onClick={handleGlucoseAnalysis} disabled={analyzing} className="w-full mt-4" size="lg">
                  {analyzing ? t("Analyzing...", "বিশ্লেষণ করা হচ্ছে...") : t("Analyze", "বিশ্লেষণ করুন")}
                </Button>
              )}
            </Card>

            {glucoseResult && (
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t("Glucose Level", "গ্লুকোজ স্তর")}</h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(glucoseResult.riskLevel)}`}
                  >
                    {t(
                      glucoseResult.riskLevel === "high"
                        ? "Alert"
                        : glucoseResult.riskLevel === "medium"
                          ? "Caution"
                          : "Normal",
                      glucoseResult.riskLevel === "high"
                        ? "সতর্কতা"
                        : glucoseResult.riskLevel === "medium"
                          ? "সাবধান"
                          : "স্বাভাবিক",
                    )}
                  </div>
                </div>

                <div className="text-center py-6">
                  <p className="text-5xl font-bold text-primary">{glucoseResult.glucoseLevel}</p>
                  <p className="text-sm text-muted-foreground mt-2">mg/dL</p>
                  <p className="text-xs text-muted-foreground mt-1">{glucoseResult.prediction}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <p className="font-semibold text-green-700">70-120</p>
                    <p className="text-muted-foreground">{t("Normal", "স্বাভাবিক")}</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded border border-amber-200">
                    <p className="font-semibold text-amber-700">120-140</p>
                    <p className="text-muted-foreground">{t("Elevated", "উচ্চতর")}</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded border border-red-200">
                    <p className="font-semibold text-red-700">{">140"}</p>
                    <p className="text-muted-foreground">{t("High", "উচ্চ")}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">{glucoseResult.message[language]}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{t("Recommendations", "সুপারিশ")}</h4>
                  <ul className="space-y-2">
                    {glucoseResult.recommendations[language].map((rec, idx) => (
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
                    onClick={() => speak(glucoseResult.message[language], language)}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {t("Listen", "শুনুন")}
                  </Button>
                  <Button className="flex-1" onClick={saveGlucoseLog}>
                    <Save className="h-4 w-4 mr-2" />
                    {t("Save Log", "লগ সংরক্ষণ করুন")}
                  </Button>
                </div>
              </Card>
            )}

            {getGlucoseHistory().length > 0 && (
              <Card className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{t("Recent Glucose History", "সাম্প্রতিক গ্লুকোজ ইতিহাস")}</h3>
                </div>
                <div className="space-y-2">
                  {getGlucoseHistory().map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{log.data.glucoseLevel} mg/dL</p>
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
          </TabsContent>

          <TabsContent value="food" className="space-y-6">
            <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h3 className="font-semibold mb-3 text-balance">
                {t("Upload photo of your meal", "আপনার খাবারের ছবি আপলোড করুন")}
              </h3>
              <CameraCapture onImageCapture={setFoodImage} label="Food photo" />
              {foodImage && (
                <Button onClick={handleFoodAnalysis} disabled={analyzing} className="w-full mt-4" size="lg">
                  {analyzing
                    ? t("Analyzing...", "বিশ্লেষণ করা হচ্ছে...")
                    : t("Analyze Glycemic Load", "গ্লাইসেমিক লোড বিশ্লেষণ করুন")}
                </Button>
              )}
            </Card>

            {foodResult && (
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t("Glycemic Analysis", "গ্লাইসেমিক বিশ্লেষণ")}</h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(foodResult.riskLevel)}`}
                  >
                    {t(
                      foodResult.riskLevel === "high"
                        ? "High Impact"
                        : foodResult.riskLevel === "medium"
                          ? "Moderate"
                          : "Low Impact",
                      foodResult.riskLevel === "high"
                        ? "উচ্চ প্রভাব"
                        : foodResult.riskLevel === "medium"
                          ? "মাঝারি"
                          : "কম প্রভাব",
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t("Glycemic Load", "গ্লাইসেমিক লোড")}</p>
                    <p className="text-3xl font-bold text-amber-700">{foodResult.glycemicLoad}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t("Predicted Glucose", "পূর্বাভাসিত গ্লুকোজ")}</p>
                    <p className="text-3xl font-bold text-blue-700">{foodResult.glucoseLevel}</p>
                    <p className="text-xs text-muted-foreground">mg/dL</p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">{foodResult.message[language]}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{t("Suggestions", "পরামর্শ")}</h4>
                  <ul className="space-y-2">
                    {foodResult.recommendations[language].map((rec, idx) => (
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
                    onClick={() => speak(foodResult.message[language], language)}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {t("Listen", "শুনুন")}
                  </Button>
                  <Button className="flex-1" onClick={saveFoodLog}>
                    <Save className="h-4 w-4 mr-2" />
                    {t("Save Log", "লগ সংরক্ষণ করুন")}
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  )
}
