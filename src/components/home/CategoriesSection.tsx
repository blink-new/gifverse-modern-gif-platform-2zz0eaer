import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Rocket, 
  Megaphone, 
  Code, 
  Users, 
  HeadphonesIcon, 
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  {
    name: 'Startups',
    path: '/category/startups',
    icon: Rocket,
    description: 'Fundraising, pitch decks, growth hacking, and team motivation',
    color: 'from-blue-500 to-cyan-500',
    count: '150+ GIFs'
  },
  {
    name: 'Marketing',
    path: '/category/marketing',
    icon: Megaphone,
    description: 'Email campaigns, social media reactions, and sales outreach',
    color: 'from-pink-500 to-rose-500',
    count: '200+ GIFs'
  },
  {
    name: 'Developers',
    path: '/category/developers',
    icon: Code,
    description: 'Debugging pain, deploying, code reviews, and deadlines',
    color: 'from-green-500 to-emerald-500',
    count: '180+ GIFs'
  },
  {
    name: 'Social Media',
    path: '/category/social_media',
    icon: Users,
    description: 'Funny reactions, trending memes, and user engagement',
    color: 'from-purple-500 to-violet-500',
    count: '220+ GIFs'
  },
  {
    name: 'Customer Success',
    path: '/category/customer_success',
    icon: HeadphonesIcon,
    description: 'Onboarding, renewals, feedback, and churn prevention',
    color: 'from-orange-500 to-amber-500',
    count: '120+ GIFs'
  },
  {
    name: 'Other',
    path: '/category/other',
    icon: Sparkles,
    description: 'Holidays, celebrations, apologies, and random fun',
    color: 'from-indigo-500 to-purple-500',
    count: '100+ GIFs'
  }
]

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect GIF for every situation, organized by your professional needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={category.path}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/50 overflow-hidden">
                    <CardContent className="p-6">
                      {/* Icon with Gradient Background */}
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Category Info */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {category.description}
                      </p>

                      {/* Count Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          Explore
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* View All Categories Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Button 
            size="lg" 
            className="gradient-primary text-white hover:opacity-90 transition-opacity"
            asChild
          >
            <Link to="/search">
              View All Categories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}