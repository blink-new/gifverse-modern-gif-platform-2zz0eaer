import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { GIFGrid } from '../gif/GIFGrid'
import { FilterSidebar } from '../filters/FilterSidebar'
import { GIF } from '../../types'
import { blink } from '../../blink/client'

interface SearchResultsProps {
  initialQuery?: string
}

export const SearchResults: React.FC<SearchResultsProps> = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery)
  const [gifs, setGifs] = useState<GIF[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('trending')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    tone: '',
    format: '',
    useCase: ''
  })

  const searchGifs = useCallback(async () => {
    setLoading(true)
    try {
      // Build search conditions
      const conditions = []
      
      if (query) {
        conditions.push({
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { tags: { contains: query } }
          ]
        })
      }

      if (filters.category) {
        conditions.push({ category: filters.category })
      }
      if (filters.tone) {
        conditions.push({ tone: filters.tone })
      }
      if (filters.format) {
        conditions.push({ format: filters.format })
      }
      if (filters.useCase) {
        conditions.push({ useCases: { contains: filters.useCase } })
      }

      const orderBy = sortBy === 'trending' 
        ? { downloadCount: 'desc' }
        : sortBy === 'newest'
        ? { createdAt: 'desc' }
        : { title: 'asc' }

      const results = await blink.db.gifs.list({
        where: conditions.length > 0 ? { AND: conditions } : undefined,
        orderBy,
        limit: 50
      })

      setGifs(results)
    } catch (error) {
      console.error('Search failed:', error)
      setGifs([])
    } finally {
      setLoading(false)
    }
  }, [query, filters, sortBy])

  useEffect(() => {
    if (query || Object.values(filters).some(f => f)) {
      searchGifs()
    }
  }, [query, filters, sortBy, searchGifs])

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      tone: '',
      format: '',
      useCase: ''
    })
  }

  const activeFiltersCount = Object.values(filters).filter(f => f).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search GIFs by mood, keyword, or use case..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              />
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={clearFilters} className="text-sm">
                  Clear all
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {Object.entries(filters).map(([key, value]) => 
                value && (
                  <Badge key={key} variant="secondary" className="px-3 py-1">
                    {key}: {value}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                )
              )}
            </motion.div>
          )}
        </div>

        {/* Results */}
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-80 flex-shrink-0"
            >
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </motion.div>
          )}

          {/* Results Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : gifs.length > 0 ? (
              <div>
                <div className="mb-6 text-gray-600 dark:text-gray-400">
                  Found {gifs.length} GIFs
                  {query && ` for "${query}"`}
                </div>
                <GIFGrid gifs={gifs} viewMode={viewMode} />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No GIFs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}