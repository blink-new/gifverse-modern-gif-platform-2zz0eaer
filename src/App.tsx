import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Moon, Sun, User, Heart, Folder, ArrowUp, TrendingUp, ArrowRight, Mail, CheckCircle, Download, Share2, Eye, Filter } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'
import { GIF, Category, FilterOptions } from '@/types'

// Header Component
function Header({ onSearch, searchQuery }: { onSearch: (query: string) => void; searchQuery: string }) {
  const [isDark, setIsDark] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setIsLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark'
    setIsDark(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newTheme)
  }

  const handleLogin = () => {
    blink.auth.login()
  }

  const handleLogout = () => {
    blink.auth.logout()
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="font-bold text-xl gradient-text">GIFVerse</span>
        </motion.div>

        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search GIFs by mood, keyword, or use case..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {!isLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.displayName || user.email} />
                        <AvatarFallback>
                          {(user.displayName || user.email).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Folder className="mr-2 h-4 w-4" />
                      Collections
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleLogin} size="sm" className="gradient-primary text-white">
                  Sign In
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}

// Hero Section Component
function HeroSection({ onSearch, onExploreCategories }: { onSearch: (query: string) => void; onExploreCategories: () => void }) {
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search') as string
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-90" />
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            The Ultimate GIF Library
            <br />
            <span className="text-white/90">for Modern Teams</span>
          </h1>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of curated GIFs perfect for startups, marketers, developers, 
            and social media professionals. Express yourself with style.
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                name="search"
                placeholder="Search by mood, keyword, or use case..."
                className="pl-12 pr-32 py-4 text-lg bg-white/95 backdrop-blur border-0 rounded-full shadow-lg focus-visible:ring-2 focus-visible:ring-white/50"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-white rounded-full px-6"
              >
                Search
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={onExploreCategories}
              variant="secondary"
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur rounded-full px-8"
            >
              Explore Categories
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10 rounded-full px-8"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              View Trending
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [gifs, setGifs] = useState<GIF[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'search'>('home')

  const loadCategories = useCallback(async () => {
    try {
      const categoriesData = await blink.db.categories.list({
        orderBy: { name: 'asc' }
      })
      
      const formattedCategories: Category[] = categoriesData.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        icon: cat.icon,
        color: cat.color,
        subcategories: JSON.parse(cat.subcategories || '[]'),
        gifCount: cat.gif_count || 0,
        createdAt: cat.created_at
      }))
      
      setCategories(formattedCategories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }, [])

  const loadGifs = useCallback(async () => {
    setLoading(true)
    try {
      const query: any = {
        orderBy: { created_at: 'desc' },
        limit: 50
      }

      const whereConditions: any = {}

      if (selectedCategory) {
        whereConditions.category = selectedCategory
      }

      if (filters.subcategory) {
        whereConditions.subcategory = filters.subcategory
      }

      if (filters.tone?.length) {
        whereConditions.tone = filters.tone[0]
      }

      if (filters.format?.length) {
        whereConditions.format = filters.format[0]
      }

      if (filters.trending) {
        whereConditions.is_trending = "1"
      }

      if (filters.featured) {
        whereConditions.is_featured = "1"
      }

      if (Object.keys(whereConditions).length > 0) {
        query.where = whereConditions
      }

      if (searchQuery.trim()) {
        query.where = {
          ...query.where,
          title: { like: `%${searchQuery}%` }
        }
      }

      const gifsData = await blink.db.gifs.list(query)
      
      const formattedGifs: GIF[] = gifsData.map(gif => ({
        id: gif.id,
        title: gif.title,
        description: gif.description || '',
        url: gif.url,
        thumbnailUrl: gif.thumbnail_url || gif.url,
        category: gif.category,
        subcategory: gif.subcategory || '',
        tags: JSON.parse(gif.tags || '[]'),
        tone: gif.tone as any,
        format: gif.format as any,
        useCases: JSON.parse(gif.use_cases || '[]'),
        fileSize: gif.file_size || 0,
        width: gif.width || 480,
        height: gif.height || 270,
        duration: gif.duration || 0,
        downloads: gif.downloads || 0,
        views: gif.views || 0,
        likes: gif.likes || 0,
        isTrending: Number(gif.is_trending) > 0,
        isFeatured: Number(gif.is_featured) > 0,
        uploadedBy: gif.uploaded_by || '',
        createdAt: gif.created_at,
        updatedAt: gif.updated_at || gif.created_at
      }))
      
      setGifs(formattedGifs)
    } catch (error) {
      console.error('Failed to load GIFs:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, filters, searchQuery])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (currentView === 'browse' || currentView === 'search') {
      loadGifs()
    }
  }, [selectedCategory, filters, searchQuery, currentView, loadGifs])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setCurrentView('search')
    } else {
      setCurrentView('home')
    }
  }

  const handleExploreCategories = () => {
    setCurrentView('browse')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      
      <main>
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeroSection 
                onSearch={handleSearch}
                onExploreCategories={handleExploreCategories}
              />
              
              {/* Categories Preview */}
              <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
                      Explore Categories
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Find the perfect GIF for every situation, organized by profession and use case
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.slice(0, 6).map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="cursor-pointer"
                        onClick={() => setCurrentView('browse')}
                      >
                        <Card className="h-full bg-card/50 backdrop-blur border-0 shadow-sm hover:shadow-xl transition-all duration-300 group">
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4 transition-transform group-hover:scale-110"
                                style={{ backgroundColor: `${category.color}20` }}
                              >
                                {category.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                  {category.name}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  {category.gifCount} GIFs
                                </Badge>
                              </div>
                            </div>

                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {category.description}
                            </p>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            >
                              Explore {category.name}
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {(currentView === 'browse' || currentView === 'search') && (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-8"
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">
                    {currentView === 'search' ? (
                      <>Search Results for "{searchQuery}"</>
                    ) : (
                      'Browse All GIFs'
                    )}
                  </h1>
                  <p className="text-muted-foreground">
                    {gifs.length} GIFs found
                  </p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="bg-muted rounded-lg overflow-hidden animate-pulse">
                        <div className="w-full h-48 bg-muted" />
                        <div className="p-4 space-y-2">
                          <div className="h-4 bg-muted-foreground/20 rounded" />
                          <div className="h-3 bg-muted-foreground/20 rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : gifs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-4xl">🔍</span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No GIFs found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search to find what you're looking for.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gifs.map((gif, index) => (
                      <motion.div
                        key={gif.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                      >
                        <Card className="overflow-hidden group bg-card/50 backdrop-blur border-0 shadow-sm hover:shadow-xl transition-all duration-300">
                          <div className="relative">
                            <img
                              src={gif.thumbnailUrl || gif.url}
                              alt={gif.title}
                              className="w-full h-48 object-cover"
                              loading="lazy"
                            />
                            
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="flex space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="bg-white/90 hover:bg-white text-black"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Download GIF</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="bg-white/90 hover:bg-white text-black"
                                      >
                                        <Heart className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Like GIF</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="bg-white/90 hover:bg-white text-black"
                                      >
                                        <Share2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Share GIF</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>

                            {gif.isTrending && (
                              <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="font-medium text-sm mb-2 line-clamp-2">{gif.title}</h3>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center">
                                  <Eye className="w-3 h-3 mr-1" />
                                  {gif.views.toLocaleString()}
                                </span>
                                <span className="flex items-center">
                                  <Download className="w-3 h-3 mr-1" />
                                  {gif.downloads.toLocaleString()}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {gif.tone}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className="rounded-full gradient-primary text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  )
}

export default App