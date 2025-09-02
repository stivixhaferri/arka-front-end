import { Button } from "@/components/ui/button"
import {getTranslations} from 'next-intl/server';

export async  function CareerHero() {
    const t = await getTranslations('Career');
  return (
    <section className="relative bg-[#1546E6]   py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-primary-foreground mb-6 text-balance">{t("career_title")}</h1>
        <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-pretty">
          {t("career_description")}
        </p>
        
      </div>
    </section>
  )
}
