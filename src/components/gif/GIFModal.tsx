import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share2, Heart, Copy, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { GIF } from '../../types'
import { blink } from '../../blink/client'

interface GIFModalProps {
  gif: GIF | null
  isOpen: boolean
  onClose: () => void
}

export const GIFModal: React.FC<GIFModalProps> = ({ gif, isOpen, onClose }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  if (!gif) return null

  const handleDownload = async (format: 'gif' | 'webp' | 'mp4') => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading ${gif.title} as ${format}`)
    
    // Update download count
    try {
      await blink.db.gifs.update(gif.id, {
        downloadCount: gif.downloadCount + 1
      })
    } catch (error) {
      console.error('Failed to update download count:', error)
    }
  }

  const handleLike = async () => {
    setIsLiked(!isLiked)
    // In a real app, this would save to user's favorites
    console.log(`${isLiked ? 'Unliked' : 'Liked'} ${gif.title}`)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/gif/${gif.id}`)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/gif/${gif.id}`
    const text = `Check out this GIF: ${gif.title}`
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      slack: `slack://channel?team=&id=&message=${encodeURIComponent(`${text} ${url}`)}`
    }
    
    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {gif.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {gif.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* GIF Display */}
              <div className="flex-1 p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <div className="relative max-w-full max-h-[60vh]">
                  <img
                    src={gif.url}
                    alt={gif.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
                {/* Actions */}
                <div className="space-y-4 mb-6">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleLike}
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? 'Liked' : 'Like'}
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copySuccess ? 'Copied!' : 'Copy Link'}
                    </Button>
                  </div>

                  {/* Download Options */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Download</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => handleDownload('gif')}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        GIF
                      </Button>
                      <Button
                        onClick={() => handleDownload('webp')}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        WebP
                      </Button>
                      <Button
                        onClick={() => handleDownload('mp4')}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        MP4
                      </Button>
                    </div>
                  </div>

                  {/* Share Options */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Share</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => handleShare('twitter')}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Twitter
                      </Button>
                      <Button
                        onClick={() => handleShare('linkedin')}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        LinkedIn
                      </Button>
                      <Button
                        onClick={() => handleShare('slack')}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Slack
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {gif.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium">{gif.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tone:</span>
                    <span className="font-medium capitalize">{gif.tone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium capitalize">{gif.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span className="font-medium">{gif.downloadCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}