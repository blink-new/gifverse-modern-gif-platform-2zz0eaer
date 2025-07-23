import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    try {
      await blink.db.newsletterSubscribers.create({
        id: `sub_${Date.now()}`,
        email: email.trim(),
        interests: ['marketing', 'startups', 'developers'],
        isActive: true
      })

      setIsSubscribed(true)
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our weekly GIF pack for marketers.",
      })
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              Welcome to the GIFVerse community!
            </h3>
            <p className="text-green-600 dark:text-green-300">
              You'll receive your first weekly GIF pack soon. Check your inbox!
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-card/50 backdrop-blur rounded-2xl p-8 border"
        >
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Weekly GIF Pack for Marketers
          </h3>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Get a curated collection of the best GIFs for your campaigns, social media, 
            and email marketing. Delivered every Tuesday.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="gradient-primary text-white px-6"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-medium mb-1">Curated Content</h4>
              <p className="text-sm text-muted-foreground">
                Hand-picked GIFs for maximum impact
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium mb-1">Marketing Focus</h4>
              <p className="text-sm text-muted-foreground">
                Perfect for campaigns and outreach
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-medium mb-1">Weekly Delivery</h4>
              <p className="text-sm text-muted-foreground">
                Fresh content every Tuesday
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}