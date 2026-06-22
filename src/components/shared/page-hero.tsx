import { cn } from "@/lib/utils"

interface PageHeroProps {
  title: string
  subtitle?: string
  image?: string
  className?: string
  align?: "left" | "center"
}

export function PageHero({ 
  title, 
  subtitle, 
  image = "/hero_slide_1.png", 
  className,
  align = "center" 
}: PageHeroProps) {
  return (
    <div className={cn("relative w-full h-[30vh] min-h-[250px] md:h-[40vh] md:min-h-[350px] flex items-center bg-brand-secondary overflow-hidden", className)}>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/40 to-transparent" />
      
      <div className="relative z-10 max-w-content mx-auto w-full px-4 mt-8">
        <div className={cn(
          "max-w-3xl",
          align === "center" ? "mx-auto text-center" : "text-left"
        )}>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4 drop-shadow-sm">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-200 drop-shadow">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
