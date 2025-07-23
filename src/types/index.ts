export interface GIF {
  id: string
  title: string
  description: string
  url: string
  thumbnailUrl: string
  category: string
  subcategory: string
  tags: string[]
  tone: 'funny' | 'professional' | 'sarcastic' | 'motivational'
  format: 'loop' | 'short-clip' | 'meme' | 'transparent'
  useCases: string[]
  fileSize: number
  width: number
  height: number
  duration: number
  downloads: number
  views: number
  likes: number
  isTrending: boolean
  isFeatured: boolean
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  subcategories: string[]
  gifCount: number
  createdAt: string
}

export interface FilterOptions {
  category?: string
  subcategory?: string
  tone?: string[]
  format?: string[]
  useCases?: string[]
  trending?: boolean
  featured?: boolean
  sortBy?: 'newest' | 'trending' | 'most-downloaded' | 'most-liked'
}

export interface SearchFilters extends FilterOptions {
  query?: string
}

export interface User {
  id: string
  email: string
  displayName: string
  avatar?: string
  favorites: string[]
  collections: Collection[]
  createdAt: string
}

export interface Collection {
  id: string
  name: string
  description: string
  gifIds: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface Newsletter {
  id: string
  email: string
  preferences: string[]
  subscribedAt: string
}