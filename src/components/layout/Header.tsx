import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Menu, Moon, Sun, User, Heart, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'
import { blink } from '@/blink/client'

interface HeaderProps {
  onSearch: (query: string) => void
  searchQuery: string
}

export function Header({ onSearch, searchQuery }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState(null)

  // Auth state management would go here
  // useEffect(() => {
  //   const unsubscribe = blink.auth.onAuthStateChanged((state) => {
  //     setUser(state.user)
  //   })
  //   return unsubscribe
  // }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const query = formData.get('search') as string
    onSearch(query)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleSignIn = () => {
    blink.auth.login()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="gradient-primary w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              GIFVerse
            </span>
          </motion.div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  name="search"
                  placeholder="Search GIFs by mood, keyword, or use case..."
                  defaultValue={searchQuery}
                  className={`pl-12 pr-4 py-3 w-full rounded-full border-2 transition-all duration-200 ${
                    isSearchFocused 
                      ? 'border-primary ring-4 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Upload Button */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center space-x-2 rounded-full"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Upload className="mr-2 h-4 w-4" />
                    My Uploads
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => blink.auth.logout()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleSignIn}
                size="sm"
                className="gradient-primary text-white rounded-full px-6"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        name="search"
                        placeholder="Search GIFs..."
                        defaultValue={searchQuery}
                        className="pl-10"
                      />
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload GIF
                    </Button>
                    {user ? (
                      <>
                        <Button variant="ghost" className="w-full justify-start">
                          <Heart className="mr-2 h-4 w-4" />
                          Favorites
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleSignIn}
                        className="w-full gradient-primary text-white"
                      >
                        Sign In
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}