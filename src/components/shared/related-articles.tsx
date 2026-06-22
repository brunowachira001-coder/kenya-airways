import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Article {
  title: string
  description: string
  href: string
  image: string
}

interface RelatedArticlesProps {
  title?: string
  articles: Article[]
}

export function RelatedArticles({ title = "You might also be interested in", articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null

  return (
    <section className="w-full py-12 md:py-16 border-t">
      <div className="max-w-content mx-auto px-4">
        <h2 className="font-sans text-2xl md:text-3xl font-medium mb-8">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <Link 
              key={index} 
              href={article.href}
              className="group flex flex-col h-full bg-white rounded-card overflow-hidden shadow-sm hover:shadow-md border transition-all"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-sans text-xl font-medium mb-2 group-hover:text-brand-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {article.description}
                </p>
                <div className="flex items-center text-brand-primary font-medium text-sm mt-auto">
                  Read More <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
