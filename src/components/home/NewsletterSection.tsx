import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import blink from '@/blink/client'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Subscribe to newsletter
      await blink.db.newsletterSubscribers.create({
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.trim(),
        name: name.trim() || null,
        interests: JSON.stringify(['weekly_gif_pack', 'new_categories', 'trending_gifs']),
        isActive: "1"
      })

      setIsSubscribed(true)
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our weekly GIF pack for marketers.",
      })
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubscribed) {
    return (
      <section className="py-16 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Welcome to the GIFVerse Community! 🎉
            </h2>
            <p className="text-xl text-white/90 mb-8">
              You're all set! Check your inbox for our welcome email and get ready for weekly GIF goodness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100"
                onClick={() => window.location.href = '/category/startups'}
              >
                Start Exploring GIFs
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setIsSubscribed(false)}
              >
                Subscribe Another Email
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 gradient-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="w-6 h-6 text-white" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wide">
              Weekly GIF Pack
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Never Miss the Perfect{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              GIF Moment
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Get curated GIF collections, trending reactions, and exclusive content delivered to your inbox every week.
          </p>

          {/* Newsletter Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/95 backdrop-blur-sm border-white/20 focus:border-white/40 text-gray-900 placeholder:text-gray-500"
              />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/95 backdrop-blur-sm border-white/20 focus:border-white/40 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin mr-2" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Get Weekly GIF Pack
                </>
              )}
            </Button>
          </motion.form>

          {/* Benefits */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Weekly Curations</h3>
              <p className="text-white/80 text-sm">
                Hand-picked GIFs for marketers, developers, and startup teams
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Trending First</h3>
              <p className="text-white/80 text-sm">
                Be the first to discover viral GIFs before they hit mainstream
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">No Spam Ever</h3>
              <p className="text-white/80 text-sm">
                Quality over quantity. Unsubscribe anytime with one click
              </p>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.p
            className="text-white/70 text-sm mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Join 10,000+ professionals who never miss the perfect GIF moment
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}