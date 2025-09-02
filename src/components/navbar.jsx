"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Car, Moon, Sun, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "sq", name: "Shqip", flag: "🇦🇱" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "rs", name: "Српски", flag: "🇷🇸" },
]

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [currentLang, setCurrentLang] = useState("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Read locale from cookie
    const savedLocale = getCookie("locale")
    if (savedLocale && languages.some((lang) => lang.code === savedLocale)) {
      setCurrentLang(savedLocale)
    }
  }, [])

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", controlNavbar)
    return () => window.removeEventListener("scroll", controlNavbar)
  }, [lastScrollY])

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode)
    setCookie("locale", langCode)
  
  }

  const navLinks = [
    { href: "/properties?category=buy", label: "Buy" },
    { href: "/properties?category=rent", label: "Rent" },
    { href: "/team", label: "Team" },
    { href: "/career", label: "Career" },
    { href: "/blog", label: "Blog" },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 lg:px-[5%] left-0 right-0 z-50 bg-background/30 h-[100px] backdrop-blur-md border-b transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between ">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <img src="/images/logo_blue.png" className="size-[105px] object-contain" alt="" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80  text-xl transition-colors font-medium hover:text-blue-800"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center text-lg space-x-1 hover:bg-transparent cursor-pointer">
                  <Globe className="h-4 w-4" />
                  <span className="text-lg font-medium ">
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

            {/* Theme Toggle */}
   

            {/* Auth Buttons */}
            <Link href={'/sign-in'}>
             <Button variant="ghost" className='hover:bg-transparent cursor-pointer text-lg px-4 py-4' size="sm">
              Login
            </Button>
            </Link>
          <Link href={'/sign-up'}>
           <Button size="sm" className="bg-[#2C5AE2]  hover:bg-[#203E97] rounded-none px-4 py-5 text-lg cursor-pointer">Register</Button>
          </Link>
           
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Theme Toggle Mobile */}
          

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between pb-6 border-b">
                    <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
                      <Car className="h-8 w-8 text-primary" />
                      <span>CarRental</span>
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="sm">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 lg:py-6">
                    <div className="">
                      {navLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className="block py-3 px-4 text-lg font-medium text-foreground/80 hover:text-blue-800 hover:bg-muted rounded transition-colors"
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    {/* Mobile Language Switcher */}
                    <div className="lg:mt-8 pt-6 border-t">
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
                  </div>

                  {/* Mobile Auth Buttons */}
                  <div className="pt-6 border-t space-y-3">
                    <SheetClose asChild >
                        <Link href={'/sign-in'}>
                        <Button variant="outline" className="w-full bg-transparent" size="lg">
                        Login
                      </Button>
                        </Link>
                      
                    </SheetClose>
                    <SheetClose asChild className="mt-2">
                        <Link href={"/sign-up"}>
                         <Button className="w-full" size="lg">
                        Register
                      </Button></Link>
                     
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
