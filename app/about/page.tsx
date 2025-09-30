"use client"

import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { Card } from "@/components/ui/card"
import { Heart, Users, Target } from "lucide-react"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{t("About Momota", "মমতা সম্পর্কে")}</h1>
            <p className="text-xs text-muted-foreground">{t("Our mission", "আমাদের লক্ষ্য")}</p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-3">
            {t("মমতা", "মমতা")}
            <br />
            <span className="text-lg font-normal text-muted-foreground">Momota</span>
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            {t("AI-Powered Pregnancy Companion", "এআই-চালিত গর্ভাবস্থা সঙ্গী")}
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t("Our Mission", "আমাদের মিশন")}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(
                  "Every year, thousands of mothers in Bangladesh die from preventable causes like anemia, preeclampsia, gestational diabetes, and infections. Momota helps stop that using AI-powered early detection and guidance.",
                  "প্রতি বছর, বাংলাদেশে হাজার হাজার মা রক্তস্বল্পতা, প্রিক্ল্যাম্পসিয়া, গর্ভকালীন ডায়াবেটিস এবং সংক্রমণের মতো প্রতিরোধযোগ্য কারণে মারা যান। মমতা এআই-চালিত প্রাথমিক সনাক্তকরণ এবং নির্দেশনা ব্যবহার করে এটি বন্ধ করতে সাহায্য করে।",
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t("What We Do", "আমরা কি করি")}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                {t(
                  "Momota provides AI-powered health monitoring tools that are accessible, affordable, and easy to use for pregnant mothers in Bangladesh and beyond.",
                  "মমতা এআই-চালিত স্বাস্থ্য পর্যবেক্ষণ টুল সরবরাহ করে যা বাংলাদেশ এবং এর বাইরে গর্ভবতী মায়েদের জন্য অ্যাক্সেসযোগ্য, সাশ্রয়ী এবং ব্যবহার করা সহজ।",
                )}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t("Photo-based anemia detection", "ছবি-ভিত্তিক রক্তস্বল্পতা সনাক্তকরণ")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t("Blood pressure & preeclampsia monitoring", "রক্তচাপ ও প্রিক্ল্যাম্পসিয়া পর্যবেক্ষণ")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t("Gestational diabetes tracking", "গর্ভকালীন ডায়াবেটিস ট্র্যাকিং")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t("Infection symptom triage", "সংক্রমণ লক্ষণ ট্রাইয়েজ")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t("Personalized nutrition planning", "ব্যক্তিগত পুষ্টি পরিকল্পনা")}</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t("Built By", "নির্মাতা")}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(
                  "Team Arctic Wolves – 2025. A group of passionate developers and healthcare advocates committed to saving mothers' lives through technology.",
                  "টিম আর্কটিক উলভস – ২০২৫। প্রযুক্তির মাধ্যমে মায়েদের জীবন বাঁচাতে প্রতিশ্রুতিবদ্ধ উত্সাহী ডেভেলপার এবং স্বাস্থ্যসেবা সমর্থকদের একটি দল।",
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <p className="text-sm text-center leading-relaxed text-green-800 font-medium">
            {t(
              "Together, we can prevent maternal deaths and ensure every mother receives the care she deserves.",
              "একসাথে, আমরা মাতৃমৃত্যু প্রতিরোধ করতে পারি এবং নিশ্চিত করতে পারি যে প্রতিটি মা তার প্রাপ্য যত্ন পায়।",
            )}
          </p>
        </Card>

        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>© 2025 Momota - Team Arctic Wolves</p>
          <p className="mt-1">{t("Made with love for mothers everywhere", "সর্বত্র মায়েদের জন্য ভালোবাসা দিয়ে তৈরি")}</p>
        </div>
      </main>

      <Navigation />
    </div>
  )
}
