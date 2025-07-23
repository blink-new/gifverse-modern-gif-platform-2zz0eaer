import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Folder, Upload, Settings, Download, Share2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { GIFGrid } from '../gif/GIFGrid'
import { GIF, Collection } from '../../types'
import { blink } from '../../blink/client'

export const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<GIF[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [uploads, setUploads] = useState<GIF[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFavorites: 0,
    totalCollections: 0,
    totalUploads: 0,
    totalDownloads: 0
  })

  const loadUserData = async () => {
    try {
      const userData = await blink.auth.me()
      setUser(userData)

      // Load user's favorites
      const userFavorites = await blink.db.favorites.list({
        where: { userId: userData.id },
        limit: 20
      })
      
      // Get the actual GIF data for favorites
      if (userFavorites.length > 0) {
        const gifIds = userFavorites.map(f => f.gifId)
        const favoriteGifs = await blink.db.gifs.list({
          where: { id: { in: gifIds } }
        })
        setFavorites(favoriteGifs)
      }

      // Load user's collections
      const userCollections = await blink.db.collections.list({
        where: { userId: userData.id }
      })
      setCollections(userCollections)

      // Load user's uploads
      const userUploads = await blink.db.gifs.list({
        where: { uploadedBy: userData.id },
        orderBy: { createdAt: 'desc' },
        limit: 20
      })
      setUploads(userUploads)

      // Calculate stats
      setStats({
        totalFavorites: userFavorites.length,
        totalCollections: userCollections.length,
        totalUploads: userUploads.length,
        totalDownloads: userUploads.reduce((sum, gif) => sum + gif.downloadCount, 0)
      })

    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  const createCollection = async () => {
    const name = prompt('Enter collection name:')
    if (!name || !user) return

    try {
      await blink.db.collections.create({
        id: `col_${Date.now()}`,
        name,
        description: '',
        userId: user.id,
        gifIds: [],
        isPublic: false,
        createdAt: new Date().toISOString()
      })
      
      loadUserData() // Refresh data
    } catch (error) {
      console.error('Failed to create collection:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => blink.auth.login()} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.displayName || user.email}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your GIFs, collections, and favorites
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Favorites
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalFavorites}
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Collections
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalCollections}
                    </p>
                  </div>
                  <Folder className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Uploads
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalUploads}
                    </p>
                  </div>
                  <Upload className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Downloads
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalDownloads}
                    </p>
                  </div>
                  <Download className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="uploads">My Uploads</TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Your Favorite GIFs
                </CardTitle>
                <CardDescription>
                  GIFs you've liked and saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <GIFGrid gifs={favorites} viewMode="grid" />
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start exploring and like GIFs to see them here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-blue-500" />
                      Your Collections
                    </CardTitle>
                    <CardDescription>
                      Organize your GIFs into custom collections
                    </CardDescription>
                  </div>
                  <Button onClick={createCollection}>
                    Create Collection
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {collections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                      <Card key={collection.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {collection.name}
                            </h3>
                            <Badge variant={collection.isPublic ? "default" : "secondary"}>
                              {collection.isPublic ? 'Public' : 'Private'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {collection.description || 'No description'}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{collection.gifIds.length} GIFs</span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No collections yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create your first collection to organize your GIFs
                    </p>
                    <Button onClick={createCollection}>
                      Create Your First Collection
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uploads" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-green-500" />
                  Your Uploads
                </CardTitle>
                <CardDescription>
                  GIFs you've uploaded to the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploads.length > 0 ? (
                  <GIFGrid gifs={uploads} viewMode="grid" />
                ) : (
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No uploads yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Share your GIFs with the community
                    </p>
                    <Button>
                      Upload Your First GIF
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}