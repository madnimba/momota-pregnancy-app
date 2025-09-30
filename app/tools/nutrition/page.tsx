"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { CameraCapture } from "@/components/camera-capture"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Volume2, Save, Sparkles } from "lucide-react"
import Link from "next/link"
import { analyzeMealNutrition, type NutritionResult } from "@/lib/ai-mock"
import { speak } from "@/lib/speech"
import { saveHealthLog } from "@/lib/storage"
import { useRouter } from "next/navigation"

export default function NutritionToolPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [mealImage, setMealImage] = useState<string | null>(null)
  const [result, setResult] = useState<NutritionResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [showPlan, setShowPlan] = useState(false)

  const handleAnalysis = () => {
    if (!mealImage) return
    setAnalyzing(true)
    setTimeout(() => {
      const analysisResult = analyzeMealNutrition(mealImage)
      setResult(analysisResult)
      setAnalyzing(false)
      speak(analysisResult.message[language], language)
    }, 1500)
  }

  const generateDailyPlan = () => {
    setShowPlan(true)
    const planMessage = t(
      "Here is your personalized daily meal plan based on your nutritional needs.",
      "এখানে আপনার পুষ্টির চাহিদার উপর ভিত্তি করে আপনার ব্যক্তিগত দৈনিক খাবার পরিকল্পনা রয়েছে।",
    )
    speak(planMessage, language)
  }

  const saveLog = () => {
    if (!result) return
    saveHealthLog({
      type: "nutrition",
      data: { iron: result.iron, protein: result.protein, calcium: result.calcium },
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

  const dailyPlan = {
    en: {
      breakfast: "1 bowl of oats with milk, 1 banana, 1 boiled egg",
      midMorning: "1 glass of milk or yogurt, handful of nuts",
      lunch: "2 pieces of fish, 1 cup rice, spinach curry, lentil soup",
      afternoon: "1 apple or orange, green tea",
      dinner: "2 chapatis, vegetable curry, chicken/egg, salad",
      beforeBed: "1 glass of warm milk",
    },
    bn: {
      breakfast: "১ বাটি দুধের সাথে ওটস, ১টি কলা, ১টি সিদ্ধ ডিম",
      midMorning: "১ গ্লাস দুধ বা দই, এক মুঠো বাদাম",
      lunch: "২ টুকরো মাছ, ১ কাপ ভাত, পালং শাক তরকারি, ডাল স্যুপ",
      afternoon: "১টি আপেল বা কমলা, সবুজ চা",
      dinner: "২টি চাপাতি, সবজি তরকারি, মুরগি/ডিম, সালাদ",
      beforeBed: "১ গ্লাস গরম দুধ",
    },
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{t("Diet & Nutrition Planner", "খাদ্য ও পুষ্টি পরিকল্পনাকারী")}</h1>
            <p className="text-xs text-muted-foreground">{t("Meal analysis & planning", "খাবার বিশ্লেষণ ও পরিকল্পনা")}</p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <h3 className="font-semibold mb-3 text-balance">
            {t("Upload photo of your meal plate", "আপনার খাবারের প্লেটের ছবি আপলোড করুন")}
          </h3>
          <CameraCapture onImageCapture={setMealImage} label="Meal plate photo" />
          {mealImage && (
            <Button onClick={handleAnalysis} disabled={analyzing} className="w-full mt-4" size="lg">
              {analyzing ? t("Analyzing...", "বিশ্লেষণ করা হচ্ছে...") : t("Analyze Meal", "খাবার বিশ্লেষণ করুন")}
            </Button>
          )}
        </Card>

        {result && (
          <>
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{t("Nutrition Analysis", "পুষ্টি বিশ্লেষণ")}</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(result.riskLevel)}`}>
                  {t(
                    result.riskLevel === "high"
                      ? "Needs Improvement"
                      : result.riskLevel === "medium"
                        ? "Good"
                        : "Excellent",
                    result.riskLevel === "high" ? "উন্নতি প্রয়োজন" : result.riskLevel === "medium" ? "ভালো" : "চমৎকার",
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs text-muted-foreground">{t("Iron", "আয়রন")}</p>
                  <p className="text-2xl font-bold text-red-700">{result.iron}mg</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("Target: 27mg/day", "লক্ষ্য: ২৭mg/দিন")}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-muted-foreground">{t("Protein", "প্রোটিন")}</p>
                  <p className="text-2xl font-bold text-blue-700">{result.protein}g</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("Target: 71g/day", "লক্ষ্য: ৭১g/দিন")}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-muted-foreground">{t("Calcium", "ক্যালসিয়াম")}</p>
                  <p className="text-2xl font-bold text-purple-700">{result.calcium}mg</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("Target: 1000mg/day", "লক্ষ্য: ১০০০mg/দিন")}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-muted-foreground">{t("Calories", "ক্যালোরি")}</p>
                  <p className="text-2xl font-bold text-amber-700">{result.calories}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("Per meal", "প্রতি খাবার")}</p>
                </div>
              </div>

              {result.missing.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-semibold text-amber-800 mb-2">{t("Missing Nutrients", "অনুপস্থিত পুষ্টি")}</p>
                  <div className="flex flex-wrap gap-2">
                    {result.missing.map((nutrient) => (
                      <span key={nutrient} className="px-2 py-1 bg-amber-100 rounded text-xs text-amber-800">
                        {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm leading-relaxed">{result.message[language]}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t("Suggestions", "পরামর্শ")}</h4>
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

            <Button onClick={generateDailyPlan} variant="outline" className="w-full bg-transparent" size="lg">
              <Sparkles className="h-4 w-4 mr-2" />
              {t("Generate Daily Meal Plan", "দৈনিক খাবার পরিকল্পনা তৈরি করুন")}
            </Button>
          </>
        )}

        {showPlan && (
          <Card className="p-5 space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-lg">{t("Your Daily Meal Plan", "আপনার দৈনিক খাবার পরিকল্পনা")}</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-700 mb-1">
                  {t("Breakfast (8:00 AM)", "সকালের নাস্তা (সকাল ৮:০০)")}
                </p>
                <p className="text-sm leading-relaxed">{dailyPlan[language].breakfast}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-700 mb-1">
                  {t("Mid-Morning (11:00 AM)", "সকাল-মধ্য (সকাল ১১:০০)")}
                </p>
                <p className="text-sm leading-relaxed">{dailyPlan[language].midMorning}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-700 mb-1">
                  {t("Lunch (1:00 PM)", "দুপুরের খাবার (দুপুর ১:০০)")}
                </p>
                <p className="text-sm leading-relaxed">{dailyPlan[language].lunch}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-700 mb-1">
                  {t("Afternoon Snack (4:00 PM)", "বিকেলের নাস্তা (বিকেল ৪:০০)")}
                </p>
                <p className="text-sm leading-relaxed">{dailyPlan[language].afternoon}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-700 mb-1">
                  {t("Dinner (8:00 PM)", "রাতের খাবার (রাত ৮:০০)")}
                </p>
                <p className="text-sm leading-relaxed">{dailyPlan[language].dinner}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-700 mb-1">
                  {t("Before Bed (10:00 PM)", "ঘুমানোর আগে (রাত ১০:০০)")}
                </p>
                <p className="text-sm leading-relaxed">{dailyPlan[language].beforeBed}</p>
              </div>
            </div>

            <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-xs text-green-800 leading-relaxed">
                {t(
                  "This plan provides approximately 2200-2500 calories with balanced nutrients for pregnancy.",
                  "এই পরিকল্পনাটি গর্ভাবস্থার জন্য সুষম পুষ্টি সহ প্রায় ২২০০-২৫০০ ক্যালোরি সরবরাহ করে।",
                )}
              </p>
            </div>
          </Card>
        )}
      </main>

      <Navigation />
    </div>
  )
}
