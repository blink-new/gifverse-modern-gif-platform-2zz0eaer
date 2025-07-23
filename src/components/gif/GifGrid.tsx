import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Heart, Share2, Eye, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import blink from '@/blink/client'

interface Gif {
  id: string
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  category: string
  subcategory?: string
  tags: string
  tone: string
  format: string
  useCases: string
  width: number
  height: number
  downloadCount: number
  viewCount: number
  isTrending: string
  isFeatured: string
}

interface GifGridProps {
  gifs: Gif[]
  loading?: boolean
}

export default function GifGrid({ gifs, loading }: GifGridProps) {
  const [hoveredGif, setHoveredGif] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleGifClick = (gif: Gif) => {
    // Increment view count
    blink.db.gifs.update(gif.id, {
      viewCount: gif.viewCount + 1
    }).catch(console.error)

    navigate(`/gif/${gif.id}`)
  }

  const handleDownload = async (e: React.MouseEvent, gif: Gif) => {
    e.stopPropagation()
    
    try {
      // Increment download count
      await blink.db.gifs.update(gif.id, {
        downloadCount: gif.downloadCount + 1
      })

      // Create download link
      const link = document.createElement('a')
      link.href = gif.url
      link.download = `${gif.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.gif`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download started",
        description: `${gif.title} is being downloaded.`,
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download failed",
        description: "Please try again later.",
        variant: "destructive"
      })
    }
  }

  const handleFavorite = async (e: React.MouseEvent, gif: Gif) => {
    e.stopPropagation()
    
    try {
      const user = await blink.auth.me()
      if (!user) {
        blink.auth.login()
        return
      }

      const isFavorited = favorites.has(gif.id)
      
      if (isFavorited) {
        // Remove from favorites
        const existingFavorites = await blink.db.favorites.list({
          where: { userId: user.id, gifId: gif.id }
        })
        
        if (existingFavorites.length > 0) {
          await blink.db.favorites.delete(existingFavorites[0].id)
        }
        
        setFavorites(prev => {
          const newSet = new Set(prev)
          newSet.delete(gif.id)
          return newSet
        })
        
        toast({
          title: "Removed from favorites",
          description: `${gif.title} has been removed from your favorites.`,
        })
      } else {
        // Add to favorites
        await blink.db.favorites.create({
          id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          gifId: gif.id
        })
        
        setFavorites(prev => new Set([...prev, gif.id]))
        
        toast({
          title: "Added to favorites",
          description: `${gif.title} has been added to your favorites.`,
        })
      }
    } catch (error) {
      console.error('Favorite error:', error)
      toast({
        title: "Action failed",
        description: "Please try again later.",
        variant: "destructive"
      })
    }
  }

  const handleShare = async (e: React.MouseEvent, gif: Gif) => {
    e.stopPropagation()
    
    const shareUrl = `${window.location.origin}/gif/${gif.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: gif.title,
          text: gif.description || gif.title,
          url: shareUrl
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link copied",
          description: "GIF link has been copied to your clipboard.",
        })
      } catch (error) {
        console.error('Share error:', error)
      }
    }
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

  if (loading) {
    return (
      <div className="masonry-grid">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="masonry-item">
            <div className="bg-muted rounded-lg animate-pulse">
              <div className="aspect-video bg-muted-foreground/10 rounded-t-lg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted-foreground/10 rounded w-3/4" />
                <div className="h-3 bg-muted-foreground/10 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (gifs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <ExternalLink className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No GIFs found</h3>
        <p className="text-muted-foreground">Try adjusting your search or browse our categories.</p>
      </div>
    )
  }

  return (
    <div className="masonry-grid">
      {gifs.map((gif, index) => {
        const tags = gif.tags ? JSON.parse(gif.tags) : []
        const useCases = gif.useCases ? JSON.parse(gif.useCases) : []
        
        return (
          <motion.div
            key={gif.id}
            className="masonry-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div
              className="gif-card bg-card rounded-lg overflow-hidden border cursor-pointer group"
              onMouseEnter={() => setHoveredGif(gif.id)}
              onMouseLeave={() => setHoveredGif(null)}
              onClick={() => handleGifClick(gif)}
            >
              {/* GIF Image */}
              <div className="relative overflow-hidden">
                <img
                  src={gif.thumbnailUrl || gif.url}
                  alt={gif.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay Actions */}
                {hoveredGif === gif.id && (
                  <motion.div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => handleDownload(e, gif)}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => handleFavorite(e, gif)}
                      className={`bg-white/90 hover:bg-white ${
                        favorites.has(gif.id) ? 'text-red-500' : 'text-black'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(gif.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => handleShare(e, gif)}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {Number(gif.isTrending) > 0 && (
                    <Badge variant="secondary" className="bg-red-500 text-white text-xs">
                      Trending
                    </Badge>
                  )}
                  {Number(gif.isFeatured) > 0 && (
                    <Badge variant="secondary" className="bg-yellow-500 text-white text-xs">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="absolute bottom-2 right-2 flex items-center space-x-2 text-white text-xs">
                  <div className="flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
                    <Eye className="w-3 h-3" />
                    <span>{gif.viewCount}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
                    <Download className="w-3 h-3" />
                    <span>{gif.downloadCount}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{gif.title}</h3>
                
                {gif.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {gif.description}
                  </p>
                )}

                {/* Tone Badge */}
                <div className="mb-3">
                  <Badge className={`text-xs ${getToneColor(gif.tone)}`}>
                    {gif.tone}
                  </Badge>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Use Cases */}
                {useCases.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {useCases.slice(0, 2).map((useCase: string) => (
                      <Badge key={useCase} variant="secondary" className="text-xs">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}