import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GIFCard } from '@/components/gif/GIFCard'
import { GIF } from '@/types'

interface TrendingSectionProps {
  trendingGifs: GIF[]
  onViewAll: () => void
  onLike: (gifId: string) => void
  onDownload: (gifId: string) => void
}

export function TrendingSection({ trendingGifs, onViewAll, onLike, onDownload }: TrendingSectionProps) {
  if (trendingGifs.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending Now</h2>
              <p className="text-muted-foreground">
                Most popular GIFs this week
              </p>
            </div>
          </div>
          
          <Button
            onClick={onViewAll}
            variant="outline"
            className="hidden sm:flex items-center space-x-2 rounded-xl"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Trending GIFs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trendingGifs.map((gif, index) => (
            <motion.div
              key={gif.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GIFCard
                gif={gif}
                onLike={onLike}
                onDownload={onDownload}
                showTrendingBadge
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center sm:hidden">
          <Button
            onClick={onViewAll}
            variant="outline"
            className="w-full rounded-xl"
          >
            View All Trending GIFs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}