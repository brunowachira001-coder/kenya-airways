import { PageHero } from "@/components/shared/page-hero"
import { RelatedArticles } from "@/components/shared/related-articles"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Briefcase, Info, AlertTriangle, ShieldCheck } from "lucide-react"

export default function BaggageInformationPage() {
  return (
    <>
      <PageHero 
        title="Baggage Information" 
        subtitle="Everything you need to know about what to pack and how to carry it."
        image="/hero_slide_2.png"
      />
      
      <div className="max-w-content mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Plan", href: "/plan/travel-information" },
            { label: "Baggage Information" }
          ]} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8 mb-16">
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="font-sans text-3xl font-medium mb-6 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-brand-primary" />
                Cabin Baggage Allowance
              </h2>
              <div className="bg-white rounded-card shadow-sm p-6 md:p-8 border">
                <p className="text-muted-foreground mb-6">
                  To ensure a safe and comfortable flight for everyone, please adhere to our cabin baggage rules. Your cabin baggage must fit securely in the overhead lockers or under the seat in front of you.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="pb-3 font-semibold text-brand-secondary">Travel Class</th>
                        <th className="pb-3 font-semibold text-brand-secondary">Allowance</th>
                        <th className="pb-3 font-semibold text-brand-secondary">Max Dimensions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-4 font-medium">Economy Class</td>
                        <td className="py-4">1 piece up to 12kg<br/><span className="text-sm text-muted-foreground">+ 1 small accessory</span></td>
                        <td className="py-4 text-sm text-muted-foreground">55 x 35 x 25 cm</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-4 font-medium">Premium Economy</td>
                        <td className="py-4">2 pieces up to 12kg total<br/><span className="text-sm text-muted-foreground">+ 1 small accessory</span></td>
                        <td className="py-4 text-sm text-muted-foreground">55 x 35 x 25 cm</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-medium">Business Class</td>
                        <td className="py-4">2 pieces up to 18kg total<br/><span className="text-sm text-muted-foreground">+ 1 small accessory</span></td>
                        <td className="py-4 text-sm text-muted-foreground">55 x 35 x 25 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-sans text-3xl font-medium mb-6 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-brand-primary" />
                Checked Baggage
              </h2>
              <div className="bg-white rounded-card shadow-sm p-6 md:p-8 border">
                <p className="text-muted-foreground mb-6">
                  Checked baggage allowances vary depending on your route and class of travel. For the exact allowance for your journey, please check your e-ticket or use our Manage Booking tool.
                </p>
                <div className="bg-brand-light-grey rounded-lg p-4 border border-brand-primary/20 flex items-start gap-4 mb-6">
                  <Info className="w-6 h-6 text-brand-primary flex-shrink-0" />
                  <p className="text-sm text-brand-secondary">
                    <span className="font-semibold block mb-1">Important Dimension Rules:</span>
                    The total dimensions (length + width + height) of any single piece of checked baggage must not exceed 158cm (62 inches). Items exceeding these dimensions may incur oversize fees.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-sans text-2xl font-medium mb-6">Frequently Asked Questions</h2>
              <Accordion className="w-full bg-white rounded-card border px-6">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium hover:text-brand-primary hover:no-underline">Can I pool my baggage allowance with a companion?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    Yes, passengers traveling together on the same booking reference and checking in at the same time can pool their baggage allowance. However, no single bag can weigh more than 32kg (70lbs) due to health and safety regulations for our baggage handlers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium hover:text-brand-primary hover:no-underline">What items are prohibited in checked baggage?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    Prohibited items include explosives, flammable liquids, radioactive materials, and lithium batteries (which must be carried in cabin baggage). Please review our full Restricted Items guide before packing.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium hover:text-brand-primary hover:no-underline">How do I purchase extra baggage?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    You can purchase extra baggage at a discounted rate through the Manage Booking section up to 24 hours before your flight. You can also purchase it at the airport at standard rates.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-card shadow-sm border p-6">
              <h3 className="font-sans text-xl font-medium mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-brand-primary" />
                Restricted Items
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                For safety and security reasons, there are strict rules about what you can and cannot take on board an aircraft.
              </p>
              <ul className="text-sm text-brand-secondary space-y-2 mb-4">
                <li className="flex items-center gap-2">• Lithium batteries</li>
                <li className="flex items-center gap-2">• Flammable liquids</li>
                <li className="flex items-center gap-2">• Corrosive substances</li>
                <li className="flex items-center gap-2">• E-cigarettes</li>
              </ul>
              <a href="#" className="text-brand-primary font-medium text-sm hover:underline">View full restricted items list →</a>
            </div>

            <div className="bg-white rounded-card shadow-sm border p-6">
              <h3 className="font-sans text-xl font-medium mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-primary" />
                Lost or Delayed Bags
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                If your baggage is delayed or damaged, our dedicated team is here to help you resolve the issue as quickly as possible.
              </p>
              <a href="#" className="text-brand-primary font-medium text-sm hover:underline">Report a baggage issue →</a>
            </div>
          </div>
        </div>
      </div>

      <RelatedArticles 
        articles={[
          {
            title: "Travel Information",
            description: "Passports, visas, and health requirements for your destination.",
            href: "/plan/travel-information",
            image: "/hero_slide_3.png"
          },
          {
            title: "Special Care",
            description: "Information about traveling with pets, infants, or medical needs.",
            href: "/plan/special-care",
            image: "/hero_slide_4.png"
          },
          {
            title: "Travel Insurance",
            description: "Protect your journey with our comprehensive insurance plans.",
            href: "/plan/travel-services",
            image: "/hero_slide_1.png"
          }
        ]}
      />
    </>
  )
}
