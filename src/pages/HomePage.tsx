import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import blink from '@/blink/client'
import GifGrid from '@/components/gif/GifGrid'
import CategoriesSection from '@/components/home/CategoriesSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import TrendingCarousel from '@/components/home/TrendingCarousel'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredGifs, setFeaturedGifs] = useState([])
  const [trendingGifs, setTrendingGifs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadGifs = async () => {
    try {
      // Load featured GIFs
      const featured = await blink.db.gifs.list({
        where: { isFeatured: "1" },
        orderBy: { createdAt: 'desc' },
        limit: 12
      })

      // Load trending GIFs
      const trending = await blink.db.gifs.list({
        where: { isTrending: "1" },
        orderBy: { viewCount: 'desc' },
        limit: 8
      })

      setFeaturedGifs(featured)
      setTrendingGifs(trending)
    } catch (error) {
      console.error('Error loading GIFs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGifs()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const popularSearches = [
    'celebration', 'success', 'funny', 'reaction', 'startup', 'coding', 'marketing', 'team'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-primary">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center justify-center space-x-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                New: AI-Powered GIF Search
              </Badge>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              The Ultimate{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                GIF Library
              </span>
              <br />
              for Modern Teams
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Discover, share, and create the perfect GIFs for startups, marketers, developers, and social media professionals.
            </p>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for the perfect GIF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-4 text-lg bg-white/95 backdrop-blur-sm border-white/20 focus:border-white/40"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Search
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.form>

            {/* Popular Searches */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="text-white/70 text-sm mr-2">Popular:</span>
              {popularSearches.map((search, index) => (
                <motion.button
                  key={search}
                  onClick={() => navigate(`/search?q=${search}`)}
                  className="px-3 py-1 text-sm bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {search}
                </motion.button>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3"
                onClick={() => navigate('/category/startups')}
              >
                Browse Categories
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
                onClick={() => navigate('/dashboard')}
              >
                Upload Your GIF
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      {trendingGifs.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">Trending Now</h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The most popular GIFs that are making waves across the internet
              </p>
            </motion.div>
            <TrendingCarousel gifs={trendingGifs} />
          </div>
        </section>
      )}

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured GIFs */}
      {featuredGifs.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured GIFs</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hand-picked GIFs that perfectly capture the modern work experience
              </p>
            </motion.div>
            <GifGrid gifs={featuredGifs} loading={loading} />
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}