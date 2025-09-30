"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Activity, BarChart3, Settings, Info } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const links = [
    { href: "/", icon: Home, label: t("Home", "হোম") },
    { href: "/tools", icon: Activity, label: t("Tools", "টুলস") },
    { href: "/logs", icon: BarChart3, label: t("Logs", "লগ") },
    { href: "/settings", icon: Settings, label: t("Settings", "সেটিংস") },
    { href: "/about", icon: Info, label: t("About", "সম্পর্কে") },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                isActive ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
