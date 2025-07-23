import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ImageOff } from 'lucide-react'
import { GIFCard } from './GIFCard'
import { Button } from '@/components/ui/button'
import { GIF } from '@/types'

interface GIFGridProps {
  gifs: GIF[]
  loading: boolean
  onLike: (gifId: string) => void
  onDownload: (gifId: string) => void
}

export function GIFGrid({ gifs, loading, onLike, onDownload }: GIFGridProps) {
  const [displayedGifs, setDisplayedGifs] = useState<GIF[]>([])
  const [page, setPage] = useState(1)
  const gifsPerPage = 20

  useEffect(() => {
    // Reset pagination when gifs change
    setPage(1)
    setDisplayedGifs(gifs.slice(0, gifsPerPage))
  }, [gifs])

  const loadMore = () => {
    const nextPage = page + 1
    const startIndex = page * gifsPerPage
    const endIndex = startIndex + gifsPerPage
    const newGifs = gifs.slice(startIndex, endIndex)
    
    setDisplayedGifs(prev => [...prev, ...newGifs])
    setPage(nextPage)
  }

  const hasMore = displayedGifs.length < gifs.length

  if (loading && displayedGifs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-500" />
          <p className="text-muted-foreground">Loading amazing GIFs...</p>
        </div>
      </div>
    )
  }

  if (!loading && gifs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <ImageOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No GIFs Found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search terms to find more GIFs.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset Filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Masonry Grid */}
      <div className="masonry-grid">
        {displayedGifs.map((gif, index) => (
          <motion.div
            key={gif.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (index % 20) * 0.05 }}
            className="masonry-item"
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

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <Button
            onClick={loadMore}
            disabled={loading}
            size="lg"
            className="gradient-primary text-white px-8 py-3 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More GIFs'
            )}
          </Button>
        </div>
      )}

      {/* Loading Indicator for Load More */}
      {loading && displayedGifs.length > 0 && (
        <div className="text-center mt-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500" />
        </div>
      )}
    </div>
  )
}