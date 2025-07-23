import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeroSectionProps {
  onSearch: (query: string) => void
  onExploreCategories: () => void
}

export function HeroSection({ onSearch, onExploreCategories }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  const popularSearches = [
    'celebration', 'mind blown', 'typing fast', 'facepalm', 
    'thumbs up', 'party time', 'success', 'coding'
  ]

  return (
    <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20 dark:border-slate-700/50"
          >
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium">AI-Powered GIF Discovery</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance"
          >
            The Ultimate{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GIF Library
            </span>
            <br />
            for Modern Teams
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance"
          >
            Discover perfect GIFs for startups, marketers, developers, and social media professionals. 
            Smart search, trending content, and instant downloads.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by mood, keyword, or use case..."
                  className="search-input pl-16 pr-32 h-16 text-lg"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 gradient-primary text-white px-8 h-12 rounded-xl"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground mr-2">Popular:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => onSearch(term)}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              onClick={onExploreCategories}
              size="lg"
              className="gradient-primary text-white px-8 py-4 rounded-xl text-lg font-medium"
            >
              Explore Categories
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 rounded-xl text-lg font-medium border-2 hover:bg-white/50 dark:hover:bg-slate-800/50"
            >
              View Trending
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-indigo-500 mr-2" />
                <span className="text-2xl font-bold">10K+</span>
              </div>
              <p className="text-muted-foreground">Curated GIFs</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-purple-500 mr-2" />
                <span className="text-2xl font-bold">50K+</span>
              </div>
              <p className="text-muted-foreground">Happy Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-pink-500 mr-2" />
                <span className="text-2xl font-bold">AI</span>
              </div>
              <p className="text-muted-foreground">Smart Search</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}