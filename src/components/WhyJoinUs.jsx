import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {getTranslations} from 'next-intl/server';



export async function WhyJoinUs() {
    const t = await getTranslations('Career');


    const benefits = [
  {
    title: `${t("f1_title")}`,
    description: `${t("f1_text")}`,
    icon: "🤝",
  },
  {
    title: `${t("f2_title")}`,
    description: `${t("f2_text")}`,
    icon: "📈",
  },
  {
    title: `${t("f3_title")}`,
    description: `${t("f3_text")}`,
    icon: "💰",
  },
  {
    title: `${t("f4_title")}`,
    description: `${t("f4_text")}`,
    icon: "⚖️",
  },
  {
    title: `${t("f5_title")}`,
    description: `${t("f5_text")}`,
    icon: "💻",
  },
  {
    title: `${t("f6_title")}`,
    description: `${t("f6_text")}`,
    icon: "🏡",
  },
]
  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
           {t("why_choose_us")}
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6 text-balance">{t("why_title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t("why_description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground text-pretty">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
