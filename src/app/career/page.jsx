import { CareerHero } from "@/components/CareerHero"
import { WhyJoinUs } from "@/components/WhyJoinUs"
import { ApplicationForm } from "@/components/ApplicationForm"
import ClientTheme from "@/components/layout-theme"

export default function CareersPage() {
  return (
    <ClientTheme>
    <main className="min-h-screen">
      <CareerHero />
      <WhyJoinUs />
      <ApplicationForm />
    </main>
    </ClientTheme>
  )
}
