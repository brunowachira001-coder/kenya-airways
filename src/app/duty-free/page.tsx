import { PageHero } from "@/components/shared/page-hero"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DutyFreePage() {
  const products = [
    { name: "Premium Perfume Set", category: "Fragrances", price: "$120", image: "/dest_mumbai.png" },
    { name: "Luxury Watch", category: "Accessories", price: "$350", image: "/dest_dubai.png" },
    { name: "Aged Single Malt", category: "Spirits", price: "$85", image: "/hero_slide_2.png" },
    { name: "Artisan Chocolate Box", category: "Confectionery", price: "$45", image: "/hero_slide_4.png" },
  ]

  return (
    <>
      <PageHero 
        title="Duty-Free Shopping" 
        subtitle="Pre-order exclusive products and have them delivered directly to your seat."
        image="/hero_slide_3.png"
      />
      
      <div className="max-w-content mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-sans text-3xl font-medium mb-2">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Discover our curated selection of tax-free goods.</p>
          </div>
          <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white hidden md:flex">
            View Catalog
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <div key={idx} className="bg-white rounded-card overflow-hidden shadow-sm border hover:shadow-md transition-shadow group flex flex-col">
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-xs text-brand-primary font-medium uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="font-medium text-lg mb-4">{product.name}</h3>
                
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-xl font-bold">{product.price}</p>
                  <Button size="icon" className="h-10 w-10 rounded-full bg-brand-light-grey text-brand-secondary hover:bg-brand-primary hover:text-white transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-brand-secondary text-white rounded-card p-8 md:p-12 text-center">
          <h2 className="font-sans text-3xl font-medium mb-4">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
              <h4 className="font-medium text-lg mb-2">Browse & Order</h4>
              <p className="text-gray-400 text-sm">Select your favorite products from our online catalog up to 72 hours before your flight.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
              <h4 className="font-medium text-lg mb-2">Secure Payment</h4>
              <p className="text-gray-400 text-sm">Pay securely online using your preferred payment method or Asante Rewards miles.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
              <h4 className="font-medium text-lg mb-2">In-flight Delivery</h4>
              <p className="text-gray-400 text-sm">Our cabin crew will deliver your beautifully packaged purchases directly to your seat.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
