"use client"

import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { Card } from "@/components/ui/card"
import { Droplet, Activity, Candy, AlertCircle, Utensils } from "lucide-react"
import Link from "next/link"

export default function ToolsPage() {
  const { t } = useLanguage()

  const tools = [
    {
      href: "/tools/anemia",
      icon: Droplet,
      title: t("Anemia Detection", "রক্তস্বল্পতা সনাক্তকরণ"),
      subtitle: t("Nail, lip & eye analysis", "নখ, ঠোঁট এবং চোখ বিশ্লেষণ"),
      color: "from-red-50 to-pink-50 border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      href: "/tools/bp",
      icon: Activity,
      title: t("BP & Preeclampsia", "রক্তচাপ ও প্রিক্ল্যাম্পসিয়া"),
      subtitle: t("Blood pressure monitoring", "রক্তচাপ পর্যবেক্ষণ"),
      color: "from-orange-50 to-amber-50 border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      href: "/tools/diabetes",
      icon: Candy,
      title: t("Diabetes Monitor", "ডায়াবেটিস মনিটর"),
      subtitle: t("Blood sugar tracking", "রক্তে শর্করা ট্র্যাকিং"),
      color: "from-amber-50 to-yellow-50 border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      href: "/tools/infection",
      icon: AlertCircle,
      title: t("Infection Triage", "সংক্রমণ ট্রাইয়েজ"),
      subtitle: t("Symptom assessment", "লক্ষণ মূল্যায়ন"),
      color: "from-purple-50 to-pink-50 border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      href: "/tools/nutrition",
      icon: Utensils,
      title: t("Diet Planner", "খাদ্য পরিকল্পনাকারী"),
      subtitle: t("Meal analysis & planning", "খাবার বিশ্লেষণ ও পরিকল্পনা"),
      color: "from-green-50 to-emerald-50 border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ]

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{t("Smart Health Tools", "স্মার্ট স্বাস্থ্য টুলস")}</h1>
            <p className="text-xs text-muted-foreground">{t("Choose a tool below", "নিচে একটি টুল নির্বাচন করুন")}</p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className={`p-5 bg-gradient-to-br ${tool.color} hover:shadow-lg transition-all duration-200`}>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-full ${tool.iconBg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-7 h-7 ${tool.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-balance leading-tight">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tool.subtitle}</p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </main>

      <Navigation />
    </div>
  )
}
