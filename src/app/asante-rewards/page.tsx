import { PageHero } from "@/components/shared/page-hero"
import { Award, CreditCard, Gift, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AsanteRewardsPage() {
  return (
    <>
      <PageHero 
        title="Asante Rewards" 
        subtitle="Earn miles, enjoy exclusive benefits, and discover a world of rewards."
        image="/hero_slide_1.png"
      />
      
      <div className="max-w-content mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans text-3xl md:text-4xl font-medium mb-6">Welcome to Asante Rewards</h2>
          <p className="text-lg text-muted-foreground">
            Our loyalty program is designed to reward you every time you fly. Earn miles that never expire and redeem them for flights, upgrades, extra baggage, and more.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-button px-8 h-12 text-base font-medium">Join Now for Free</Button>
            <Button variant="outline" className="rounded-button px-8 h-12 text-base font-medium">Log In</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-8 rounded-card border shadow-sm text-center group hover:border-brand-primary transition-colors">
            <div className="w-16 h-16 rounded-full bg-brand-light-grey mx-auto flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 transition-colors">
              <Plane className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="font-sans text-xl font-medium mb-3">Earn Miles</h3>
            <p className="text-muted-foreground text-sm">Earn miles on every flight with us and our airline partners worldwide.</p>
          </div>
          <div className="bg-white p-8 rounded-card border shadow-sm text-center group hover:border-brand-primary transition-colors">
            <div className="w-16 h-16 rounded-full bg-brand-light-grey mx-auto flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 transition-colors">
              <Gift className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="font-sans text-xl font-medium mb-3">Redeem Rewards</h3>
            <p className="text-muted-foreground text-sm">Use your miles for free flights, cabin upgrades, and excess baggage.</p>
          </div>
          <div className="bg-white p-8 rounded-card border shadow-sm text-center group hover:border-brand-primary transition-colors">
            <div className="w-16 h-16 rounded-full bg-brand-light-grey mx-auto flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 transition-colors">
              <Award className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="font-sans text-xl font-medium mb-3">Tier Benefits</h3>
            <p className="text-muted-foreground text-sm">Progress through Silver, Gold, and Platinum tiers for exclusive privileges.</p>
          </div>
          <div className="bg-white p-8 rounded-card border shadow-sm text-center group hover:border-brand-primary transition-colors">
            <div className="w-16 h-16 rounded-full bg-brand-light-grey mx-auto flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 transition-colors">
              <CreditCard className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="font-sans text-xl font-medium mb-3">Partner Offers</h3>
            <p className="text-muted-foreground text-sm">Earn and spend miles with our hotel, car rental, and retail partners.</p>
          </div>
        </div>
      </div>
    </>
  )
}
