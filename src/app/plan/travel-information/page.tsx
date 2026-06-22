import { PageHero } from "@/components/shared/page-hero"
import { RelatedArticles } from "@/components/shared/related-articles"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { FileText, Map, Clock, CreditCard } from "lucide-react"

export default function TravelInformationPage() {
  return (
    <>
      <PageHero 
        title="Travel Information" 
        subtitle="Prepare for your journey with essential information about visas, health, and airport procedures."
        image="/hero_slide_3.png"
      />
      
      <div className="max-w-content mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Plan", href: "/plan/travel-information" },
            { label: "Travel Information" }
          ]} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-16">
          <div className="bg-white rounded-card shadow-sm p-8 border group hover:border-brand-primary transition-colors cursor-pointer">
            <FileText className="w-10 h-10 text-brand-primary mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-sans text-2xl font-medium mb-3 group-hover:text-brand-primary transition-colors">Visas and Passports</h3>
            <p className="text-muted-foreground mb-4">Ensure you have the correct documentation for your destination. Learn about visa requirements, passport validity, and necessary forms for international travel.</p>
            <span className="text-brand-primary font-medium hover:underline">Check requirements →</span>
          </div>

          <div className="bg-white rounded-card shadow-sm p-8 border group hover:border-brand-primary transition-colors cursor-pointer">
            <Map className="w-10 h-10 text-brand-primary mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-sans text-2xl font-medium mb-3 group-hover:text-brand-primary transition-colors">Health Requirements</h3>
            <p className="text-muted-foreground mb-4">Stay informed about vaccination requirements, COVID-19 travel protocols, and general health guidelines for your departure and destination countries.</p>
            <span className="text-brand-primary font-medium hover:underline">View health guidelines →</span>
          </div>

          <div className="bg-white rounded-card shadow-sm p-8 border group hover:border-brand-primary transition-colors cursor-pointer">
            <Clock className="w-10 h-10 text-brand-primary mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-sans text-2xl font-medium mb-3 group-hover:text-brand-primary transition-colors">Airport Information</h3>
            <p className="text-muted-foreground mb-4">Find information about airport layouts, transit times, lounge locations, and transportation options to and from the airport.</p>
            <span className="text-brand-primary font-medium hover:underline">Explore airports →</span>
          </div>

          <div className="bg-white rounded-card shadow-sm p-8 border group hover:border-brand-primary transition-colors cursor-pointer">
            <CreditCard className="w-10 h-10 text-brand-primary mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-sans text-2xl font-medium mb-3 group-hover:text-brand-primary transition-colors">Payment Options</h3>
            <p className="text-muted-foreground mb-4">Learn about the various ways you can pay for your booking, including credit cards, mobile money (M-Pesa), and installment options.</p>
            <span className="text-brand-primary font-medium hover:underline">View payment methods →</span>
          </div>
        </div>
      </div>

      <RelatedArticles 
        articles={[
          {
            title: "Baggage Information",
            description: "Everything you need to know about what to pack and how to carry it.",
            href: "/plan/baggage-information",
            image: "/hero_slide_2.png"
          },
          {
            title: "Special Care",
            description: "Information about traveling with pets, infants, or medical needs.",
            href: "/plan/special-care",
            image: "/hero_slide_4.png"
          },
          {
            title: "Travel Services",
            description: "Protect your journey with our comprehensive insurance plans.",
            href: "/plan/travel-services",
            image: "/hero_slide_1.png"
          }
        ]}
      />
    </>
  )
}
