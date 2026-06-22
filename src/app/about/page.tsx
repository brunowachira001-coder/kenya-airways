import { PageHero } from "@/components/shared/page-hero"

export default function AboutPage() {
  return (
    <>
      <PageHero 
        title="About Fly The World" 
        subtitle="Connecting Africa to the world, and the world to Africa."
        image="/hero_slide_4.png"
      />
      
      <div className="max-w-content mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-sans text-3xl md:text-4xl font-medium mb-6">Our Story</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Founded with a vision to showcase the true warmth and hospitality of Africa, Fly The World has grown from a regional carrier to a global airline connecting millions of passengers every year.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our modern fleet, award-winning service, and extensive network make us the preferred choice for travelers seeking a premium experience combined with authentic cultural richness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-y py-12 mb-16">
          <div>
            <div className="text-4xl font-sans font-bold text-brand-primary mb-2">40+</div>
            <div className="font-medium text-brand-secondary">Destinations Worldwide</div>
          </div>
          <div>
            <div className="text-4xl font-sans font-bold text-brand-primary mb-2">5M+</div>
            <div className="font-medium text-brand-secondary">Passengers Annually</div>
          </div>
          <div>
            <div className="text-4xl font-sans font-bold text-brand-primary mb-2">25</div>
            <div className="font-medium text-brand-secondary">Years of Excellence</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-brand-light-grey rounded-card p-8">
            <h3 className="font-sans text-2xl font-medium mb-4">Our Mission</h3>
            <p className="text-muted-foreground">
              To provide safe, reliable, and exceptional air travel experiences while promoting the cultural heritage and economic growth of the communities we serve.
            </p>
          </div>
          <div className="bg-brand-light-grey rounded-card p-8">
            <h3 className="font-sans text-2xl font-medium mb-4">Sustainability</h3>
            <p className="text-muted-foreground">
              We are committed to reducing our environmental footprint through fleet modernization, fuel efficiency initiatives, and community-based conservation programs.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
