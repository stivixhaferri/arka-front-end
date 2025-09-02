// components/mobile-language-switcher.tsx
"use client"

import { setCookie } from "cookies-next"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const languages = [
  { code: "en", name: "English" },
  { code: "sq", name: "Shqip" },
  { code: "it", name: "Italiano"},
  { code: "rs", name: "Српски" },
]

export function MobileLanguageSwitcher({ currentLang }) {
  const pathname = usePathname()

  const handleLanguageChange = (langCode) => {
    setCookie('NEXT_LOCALE', langCode, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    window.location.href = `/${langCode}${pathname}`
  }

  return (
    <div className="mt-8 pt-6 border-t">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 px-4">Language</h3>
      <div className="space-y-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "w-full flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors text-left",
              currentLang === lang.code ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="font-medium">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}