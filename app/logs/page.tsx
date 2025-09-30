"use client"

import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getHealthLogs, clearHealthLogs } from "@/lib/storage"
import { Droplet, Activity, Candy, AlertCircle, Utensils, Trash2 } from "lucide-react"
import { useState } from "react"

export default function LogsPage() {
  const { t } = useLanguage()
  const [logs, setLogs] = useState(getHealthLogs())

  const handleClearLogs = () => {
    if (confirm(t("Are you sure you want to clear all logs?", "আপনি কি সমস্ত লগ মুছে ফেলতে চান?"))) {
      clearHealthLogs()
      setLogs([])
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "anemia":
        return <Droplet className="h-5 w-5 text-red-600" />
      case "bp":
        return <Activity className="h-5 w-5 text-orange-600" />
      case "diabetes":
        return <Candy className="h-5 w-5 text-amber-600" />
      case "infection":
        return <AlertCircle className="h-5 w-5 text-purple-600" />
      case "nutrition":
        return <Utensils className="h-5 w-5 text-green-600" />
      default:
        return null
    }
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

  const getTypeLabel = (type: string) => {
    const labels = {
      anemia: t("Anemia", "রক্তস্বল্পতা"),
      bp: t("Blood Pressure", "রক্তচাপ"),
      diabetes: t("Diabetes", "ডায়াবেটিস"),
      infection: t("Infection", "সংক্রমণ"),
      nutrition: t("Nutrition", "পুষ্টি"),
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{t("Health Log & Predictions", "স্বাস্থ্য লগ ও পূর্বাভাস")}</h1>
            <p className="text-xs text-muted-foreground">{t("Your health history", "আপনার স্বাস্থ্য ইতিহাস")}</p>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {logs.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">{t("No health logs yet", "এখনও কোনো স্বাস্থ্য লগ নেই")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("Start using health tools to track your data", "আপনার ডেটা ট্র্যাক করতে স্বাস্থ্য টুল ব্যবহার শুরু করুন")}
            </p>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{t(`${logs.length} entries`, `${logs.length} এন্ট্রি`)}</p>
              <Button variant="outline" size="sm" onClick={handleClearLogs}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("Clear All", "সব মুছুন")}
              </Button>
            </div>

            {logs.map((log) => (
              <Card key={log.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {getIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{getTypeLabel(log.type)}</h3>
                      <div className={`px-2 py-0.5 rounded text-xs font-medium border ${getRiskColor(log.riskLevel)}`}>
                        {t(
                          log.riskLevel === "high" ? "High" : log.riskLevel === "medium" ? "Med" : "Low",
                          log.riskLevel === "high" ? "উচ্চ" : log.riskLevel === "medium" ? "মধ্য" : "কম",
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(log.timestamp).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="text-sm leading-relaxed line-clamp-2">{log.result}</p>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </main>

      <Navigation />
    </div>
  )
}
