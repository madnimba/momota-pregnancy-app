"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { CameraCapture } from "@/components/camera-capture"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Volume2, Save } from "lucide-react"
import Link from "next/link"
import { imageAnalysisClient } from "@/lib/image-analysis-client"
import { type AnemiaResult, type NutritionResult } from "@/lib/ai-mock"
import { speak } from "@/lib/speech"
import { saveHealthLog } from "@/lib/storage"
import { useRouter } from "next/navigation"

export default function AnemiaToolPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [anemiaImage, setAnemiaImage] = useState<string | null>(null)
  const [mealImage, setMealImage] = useState<string | null>(null)
  const [anemiaResult, setAnemiaResult] = useState<AnemiaResult | null>(null)
  const [nutritionResult, setNutritionResult] = useState<NutritionResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnemiaAnalysis = async () => {
    if (!anemiaImage) return
    setAnalyzing(true)
    try {
      const result = await imageAnalysisClient.analyzeAnemia(anemiaImage, language)
      setAnemiaResult(result)
      speak(result.message[language], language)
    } catch (error) {
      console.error("Anemia analysis failed:", error)
      // Fallback will be handled by the client
    } finally {
      setAnalyzing(false)
    }
  }

  const handleNutritionAnalysis = async () => {
    if (!mealImage) return
    setAnalyzing(true)
    try {
      const result = await imageAnalysisClient.analyzeNutrition(mealImage, language)
      setNutritionResult(result)
      speak(result.message[language], language)
    } catch (error) {
      console.error("Nutrition analysis failed:", error)
      // Fallback will be handled by the client
    } finally {
      setAnalyzing(false)
    }
  }

  const saveAnemiaLog = () => {
    if (!anemiaResult) return
    saveHealthLog({
      type: "anemia",
      data: { pallorLevel: anemiaResult.pallorLevel },
      result: anemiaResult.message.en,
      riskLevel: anemiaResult.riskLevel,
    })
    router.push("/logs")
  }

  const saveNutritionLog = () => {
    if (!nutritionResult) return
    saveHealthLog({
      type: "nutrition",
      data: { iron: nutritionResult.iron, protein: nutritionResult.protein, calcium: nutritionResult.calcium },
      result: nutritionResult.message.en,
      riskLevel: nutritionResult.riskLevel,
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
      <header className="bg-gradient-to-br from-red-50 to-pink-50 border-b border-red-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{t("Anemia Detection", "রক্তস্বল্পতা সনাক্তকরণ")}</h1>
            <p className="text-xs text-muted-foreground">{t("Photo-based analysis", "ছবি-ভিত্তিক বিশ্লেষণ")}</p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <Tabs defaultValue="detection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detection">{t("Anemia Check", "রক্তস্বল্পতা পরীক্ষা")}</TabsTrigger>
            <TabsTrigger value="nutrition">{t("Meal Analysis", "খাবার বিশ্লেষণ")}</TabsTrigger>
          </TabsList>

          <TabsContent value="detection" className="space-y-6">
            <Card className="p-5 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <h3 className="font-semibold mb-3 text-balance">
                {t("Upload photo of nail, lip, or eye", "নখ, ঠোঁট বা চোখের ছবি আপলোড করুন")}
              </h3>
              <CameraCapture onImageCapture={setAnemiaImage} label="Anemia detection photo" />
              {anemiaImage && (
                <Button onClick={handleAnemiaAnalysis} disabled={analyzing} className="w-full mt-4" size="lg">
                  {analyzing ? t("Analyzing...", "বিশ্লেষণ করা হচ্ছে...") : t("Analyze", "বিশ্লেষণ করুন")}
                </Button>
              )}
            </Card>

            {anemiaResult && (
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t("Results", "ফলাফল")}</h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(anemiaResult.riskLevel)}`}
                  >
                    {t(
                      anemiaResult.riskLevel === "high"
                        ? "High Risk"
                        : anemiaResult.riskLevel === "medium"
                          ? "Medium Risk"
                          : "Low Risk",
                      anemiaResult.riskLevel === "high"
                        ? "উচ্চ ঝুঁকি"
                        : anemiaResult.riskLevel === "medium"
                          ? "মাঝারি ঝুঁকি"
                          : "কম ঝুঁকি",
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{t("Pallor Level", "ফ্যাকাশে স্তর")}</p>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        anemiaResult.riskLevel === "high"
                          ? "bg-red-500"
                          : anemiaResult.riskLevel === "medium"
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${anemiaResult.pallorLevel}%` }}
                    />
                  </div>
                  <p className="text-xs text-right text-muted-foreground">{anemiaResult.pallorLevel}%</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">{anemiaResult.message[language]}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{t("Recommendations", "সুপারিশ")}</h4>
                  <ul className="space-y-2">
                    {anemiaResult.recommendations[language].map((rec, idx) => (
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
                    onClick={() => speak(anemiaResult.message[language], language)}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {t("Listen", "শুনুন")}
                  </Button>
                  <Button className="flex-1" onClick={saveAnemiaLog}>
                    <Save className="h-4 w-4 mr-2" />
                    {t("Save Log", "লগ সংরক্ষণ করুন")}
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h3 className="font-semibold mb-3 text-balance">
                {t("Upload photo of your meal", "আপনার খাবারের ছবি আপলোড করুন")}
              </h3>
              <CameraCapture onImageCapture={setMealImage} label="Meal photo" />
              {mealImage && (
                <Button onClick={handleNutritionAnalysis} disabled={analyzing} className="w-full mt-4" size="lg">
                  {analyzing ? t("Analyzing...", "বিশ্লেষণ করা হচ্ছে...") : t("Analyze Nutrition", "পুষ্টি বিশ্লেষণ করুন")}
                </Button>
              )}
            </Card>

            {nutritionResult && (
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t("Nutrition Analysis", "পুষ্টি বিশ্লেষণ")}</h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(nutritionResult.riskLevel)}`}
                  >
                    {t(
                      nutritionResult.riskLevel === "high"
                        ? "Needs Improvement"
                        : nutritionResult.riskLevel === "medium"
                          ? "Good"
                          : "Excellent",
                      nutritionResult.riskLevel === "high"
                        ? "উন্নতি প্রয়োজন"
                        : nutritionResult.riskLevel === "medium"
                          ? "ভালো"
                          : "চমৎকার",
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs text-muted-foreground">{t("Iron", "আয়রন")}</p>
                    <p className="text-xl font-bold text-red-700">{nutritionResult.iron}mg</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-muted-foreground">{t("Protein", "প্রোটিন")}</p>
                    <p className="text-xl font-bold text-blue-700">{nutritionResult.protein}g</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-muted-foreground">{t("Calcium", "ক্যালসিয়াম")}</p>
                    <p className="text-xl font-bold text-purple-700">{nutritionResult.calcium}mg</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-muted-foreground">{t("Calories", "ক্যালোরি")}</p>
                    <p className="text-xl font-bold text-amber-700">{nutritionResult.calories}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">{nutritionResult.message[language]}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{t("Suggestions", "পরামর্শ")}</h4>
                  <ul className="space-y-2">
                    {nutritionResult.recommendations[language].map((rec, idx) => (
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
                    onClick={() => speak(nutritionResult.message[language], language)}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {t("Listen", "শুনুন")}
                  </Button>
                  <Button className="flex-1" onClick={saveNutritionLog}>
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
