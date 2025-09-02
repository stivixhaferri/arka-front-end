"use client"
import { useTranslations } from "next-intl";
import {
  Building2  ,
  Home,
  UsersRound ,
  Phone ,
  Handshake 
} from "lucide-react"
import { useEffect, useState } from "react"
import { ExpandedTabs } from "./ui/expanded-tabs"

export function TabsHome() {
  const [showTabs, setShowTabs] = useState(false)
  const t = useTranslations("Tabs");
  useEffect(() => {
    const handleScroll = () => {
      // show only when scrolled down 100px (adjust as needed)
      setShowTabs(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const tabs = [
    { title: `${t("home")}`, icon: Home , link: '/' },
     { type: "separator" },
    { title: `${t("properties")}`, icon: Building2 , link: '/properties'  },
   
    { title: `${t("team")}`, icon: UsersRound  , link: '/team' },
    { title:  `${t("career")}`, icon: Handshake  , link: '/career' },
    { title:  `${t("contact")}`, icon: Phone , link: '/contact'},
  ]

  if (!showTabs) return null

  return (
    <div className="flex items-center z-[50] justify-center lg:hidden fixed left-0 right-0 bottom-3">
      <ExpandedTabs tabs={tabs} />
    </div>
  )
}
