import { motion } from 'framer-motion'
import { ArrowRight, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Category } from '@/types'

interface CategoriesSectionProps {
  categories: Category[]
  onCategorySelect: (categorySlug: string) => void
}

export function CategoriesSection({ categories, onCategorySelect }: CategoriesSectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="gradient-secondary w-12 h-12 rounded-xl flex items-center justify-center">
              <Folder className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect GIF for every situation, organized by use case and industry
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="category-card h-full"
                onClick={() => onCategorySelect(category.slug)}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: category.color + '20', color: category.color }}
                  >
                    {category.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    {/* Subcategories */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <span 
                          key={sub}
                          className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
                        >
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{category.subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className="text-sm text-muted-foreground">
                      {category.gifCount} GIFs available
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 rounded-xl"
            onClick={() => onCategorySelect('')}
          >
            View All Categories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}