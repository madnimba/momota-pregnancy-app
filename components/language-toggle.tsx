"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
      className="font-semibold"
    >
      {language === "en" ? "বাং" : "ENG"}
    </Button>
  )
}
