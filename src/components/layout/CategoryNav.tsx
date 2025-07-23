import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Category } from '@/types'

interface CategoryNavProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (categorySlug: string | null) => void
}

export function CategoryNav({ categories, selectedCategory, onCategorySelect }: CategoryNavProps) {
  return (
    <div className="mb-8">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-4">
          {/* All Categories Button */}
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className={`rounded-full px-6 py-2 whitespace-nowrap ${
              selectedCategory === null 
                ? 'gradient-primary text-white' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => onCategorySelect(null)}
          >
            All Categories
          </Button>

          {/* Category Buttons */}
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Button
                variant={selectedCategory === category.slug ? "default" : "outline"}
                className={`rounded-full px-6 py-2 whitespace-nowrap ${
                  selectedCategory === category.slug
                    ? 'gradient-primary text-white'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => onCategorySelect(category.slug)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                {category.gifCount > 0 && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                    {category.gifCount}
                  </span>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}