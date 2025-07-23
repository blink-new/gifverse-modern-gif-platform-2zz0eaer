import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

interface Gif {
  id: string
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  category: string
  tone: string
  downloadCount: number
  viewCount: number
}

interface TrendingCarouselProps {
  gifs: Gif[]
}

export default function TrendingCarousel({ gifs }: TrendingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, gifs.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, gifs.length - 2)) % Math.max(1, gifs.length - 2))
  }

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'funny': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'professional': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'sarcastic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'motivational': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (gifs.length === 0) return null

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {gifs.length > 3 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden mx-8">
        <motion.div
          className="flex space-x-6"
          animate={{ x: -currentIndex * 320 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {gifs.map((gif, index) => (
            <motion.div
              key={gif.id}
              className="flex-shrink-0 w-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div
                className="bg-card rounded-lg overflow-hidden border cursor-pointer group hover:shadow-lg transition-all duration-300"
                onClick={() => navigate(`/gif/${gif.id}`)}
              >
                {/* GIF Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={gif.thumbnailUrl || gif.url}
                    alt={gif.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Trending Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-500 text-white text-xs">
                      🔥 Trending
                    </Badge>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-black/70 text-white rounded px-2 py-1 text-xs">
                      <Eye className="w-3 h-3" />
                      <span>{gif.viewCount}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-black/70 text-white rounded px-2 py-1 text-xs">
                      <Download className="w-3 h-3" />
                      <span>{gif.downloadCount}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {gif.title}
                  </h3>
                  
                  {gif.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {gif.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getToneColor(gif.tone)}`}>
                      {gif.tone}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {gif.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      {gifs.length > 3 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.max(1, gifs.length - 2) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}