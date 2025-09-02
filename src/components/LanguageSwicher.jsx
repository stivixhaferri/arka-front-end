"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Cookie utility functions
const setCookie = (name, value, days = 365) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const getCookie = (name) => {
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// Language options
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "sq", name: "Shqip", flag: "🇦🇱" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
]

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLocale = getCookie("locale")
    if (savedLocale && languages.some((lang) => lang.code === savedLocale)) {
      setCurrentLang(savedLocale)
    }
  }, [])

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode)
    setCookie("locale", langCode)
    window.location.reload()
  }

  // Prevent server-side rendering issues
  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-lg space-x-1 hover:bg-transparent cursor-pointer"
        >
          <Globe className="h-4 w-4" />
          <span className="text-lg font-medium">
            {languages.find((lang) => lang.code === currentLang)?.flag}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <span>{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
