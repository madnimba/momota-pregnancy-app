"use client"

import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { clearHealthLogs } from "@/lib/storage"
import { Trash2, Info, Shield } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const [cleared, setCleared] = useState(false)

  const handleClearData = () => {
    if (confirm(t("Are you sure you want to clear all data?", "আপনি কি সমস্ত ডেটা মুছে ফেলতে চান?"))) {
      clearHealthLogs()
      setCleared(true)
      setTimeout(() => setCleared(false), 3000)
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{t("Settings", "সেটিংস")}</h1>
            <p className="text-xs text-muted-foreground">{t("App preferences", "অ্যাপ পছন্দসমূহ")}</p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t("Language", "ভাষা")}
          </h3>
          <div className="flex gap-3">
            <Button
              variant={language === "en" ? "default" : "outline"}
              onClick={() => setLanguage("en")}
              className="flex-1"
            >
              English
            </Button>
            <Button
              variant={language === "bn" ? "default" : "outline"}
              onClick={() => setLanguage("bn")}
              className="flex-1"
            >
              বাংলা
            </Button>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t("How to Use", "কিভাবে ব্যবহার করবেন")}
          </h3>
          <div className="space-y-3 text-sm leading-relaxed">
            <div>
              <p className="font-medium mb-1">{t("1. Choose a Health Tool", "১. একটি স্বাস্থ্য টুল নির্বাচন করুন")}</p>
              <p className="text-muted-foreground">
                {t(
                  "Select from anemia detection, BP monitoring, diabetes tracking, infection triage, or nutrition planning.",
                  "রক্তস্বল্পতা সনাক্তকরণ, রক্তচাপ পর্যবেক্ষণ, ডায়াবেটিস ট্র্যাকিং, সংক্রমণ ট্রাইয়েজ, বা পুষ্টি পরিকল্পনা থেকে নির্বাচন করুন।",
                )}
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">{t("2. Take or Upload Photo", "২. ছবি তুলুন বা আপলোড করুন")}</p>
              <p className="text-muted-foreground">
                {t(
                  "Use your camera to take a photo or upload an existing image for analysis.",
                  "বিশ্লেষণের জন্য আপনার ক্যামেরা ব্যবহার করে ছবি তুলুন বা বিদ্যমান ছবি আপলোড করুন।",
                )}
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">{t("3. Get AI Analysis", "৩. এআই বিশ্লেষণ পান")}</p>
              <p className="text-muted-foreground">
                {t(
                  "Receive instant analysis with risk levels and recommendations in your language.",
                  "আপনার ভাষায় ঝুঁকি স্তর এবং সুপারিশ সহ তাৎক্ষণিক বিশ্লেষণ পান।",
                )}
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">{t("4. Listen & Save", "৪. শুনুন এবং সংরক্ষণ করুন")}</p>
              <p className="text-muted-foreground">
                {t(
                  "Listen to voice feedback and save results to your health log for tracking.",
                  "ভয়েস ফিডব্যাক শুনুন এবং ট্র্যাকিংয়ের জন্য আপনার স্বাস্থ্য লগে ফলাফল সংরক্ষণ করুন।",
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            {t("Data Management", "ডেটা ব্যবস্থাপনা")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t(
              "All your health data is stored locally on your device. Clear it anytime.",
              "আপনার সমস্ত স্বাস্থ্য ডেটা আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষিত। যেকোনো সময় মুছে ফেলুন।",
            )}
          </p>
          <Button variant="destructive" onClick={handleClearData} className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            {t("Clear All Health Data", "সমস্ত স্বাস্থ্য ডেটা মুছুন")}
          </Button>
          {cleared && (
            <p className="text-sm text-green-600 text-center">
              {t("Data cleared successfully", "ডেটা সফলভাবে মুছে ফেলা হয়েছে")}
            </p>
          )}
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("Privacy & Disclaimer", "গোপনীয়তা এবং দাবিত্যাগ")}
          </h3>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              {t(
                "Momota is an AI-powered health companion tool designed to provide guidance and support during pregnancy. It is NOT a substitute for professional medical advice, diagnosis, or treatment.",
                "মমতা একটি এআই-চালিত স্বাস্থ্য সহায়ক টুল যা গর্ভাবস্থায় নির্দেশনা এবং সহায়তা প্রদানের জন্য ডিজাইন করা হয়েছে। এটি পেশাদার চিকিৎসা পরামর্শ, নির্ণয় বা চিকিৎসার বিকল্প নয়।",
              )}
            </p>
            <p>
              {t(
                "All data is stored locally on your device. We do not collect, store, or share your personal health information.",
                "সমস্ত ডেটা আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষিত। আমরা আপনার ব্যক্তিগত স্বাস্থ্য তথ্য সংগ্রহ, সংরক্ষণ বা শেয়ার করি না।",
              )}
            </p>
            <p>
              {t(
                "Always consult with qualified healthcare providers for medical decisions. In case of emergency, seek immediate medical attention.",
                "চিকিৎসা সিদ্ধান্তের জন্য সর্বদা যোগ্য স্বাস্থ্যসেবা প্রদানকারীদের সাথে পরামর্শ করুন। জরুরি অবস্থায়, অবিলম্বে চিকিৎসা সহায়তা নিন।",
              )}
            </p>
          </div>
        </Card>
      </main>

      <Navigation />
    </div>
  )
}
