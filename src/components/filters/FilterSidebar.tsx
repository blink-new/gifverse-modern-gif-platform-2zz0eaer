import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { FilterOptions, Category } from '@/types'

interface FilterSidebarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  categories: Category[]
}

export function FilterSidebar({ filters, onFiltersChange, categories }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const toneOptions = [
    { value: 'funny', label: 'Funny', emoji: '😄' },
    { value: 'professional', label: 'Professional', emoji: '💼' },
    { value: 'sarcastic', label: 'Sarcastic', emoji: '😏' },
    { value: 'motivational', label: 'Motivational', emoji: '💪' }
  ]

  const formatOptions = [
    { value: 'loop', label: 'Loop', emoji: '🔄' },
    { value: 'short-clip', label: 'Short Clip', emoji: '⏱️' },
    { value: 'meme', label: 'Meme', emoji: '😂' },
    { value: 'transparent', label: 'Transparent', emoji: '🔍' }
  ]

  const useCaseOptions = [
    { value: 'email', label: 'Email', emoji: '📧' },
    { value: 'presentation', label: 'Presentation', emoji: '📊' },
    { value: 'tweet', label: 'Tweet', emoji: '🐦' },
    { value: 'linkedin-post', label: 'LinkedIn Post', emoji: '💼' },
    { value: 'slack', label: 'Slack', emoji: '💬' }
  ]

  const handleToneChange = (tone: string, checked: boolean) => {
    const currentTones = filters.tone || []
    const newTones = checked 
      ? [...currentTones, tone]
      : currentTones.filter(t => t !== tone)
    
    onFiltersChange({ ...filters, tone: newTones })
  }

  const handleFormatChange = (format: string, checked: boolean) => {
    const currentFormats = filters.format || []
    const newFormats = checked 
      ? [...currentFormats, format]
      : currentFormats.filter(f => f !== format)
    
    onFiltersChange({ ...filters, format: newFormats })
  }

  const handleUseCaseChange = (useCase: string, checked: boolean) => {
    const currentUseCases = filters.useCases || []
    const newUseCases = checked 
      ? [...currentUseCases, useCase]
      : currentUseCases.filter(u => u !== useCase)
    
    onFiltersChange({ ...filters, useCases: newUseCases })
  }

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy: sortBy as any })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof FilterOptions]
    return Array.isArray(value) ? value.length > 0 : Boolean(value)
  })

  return (
    <div className="w-80 flex-shrink-0 hidden lg:block">
      <Card className="sticky top-24">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-indigo-500" />
              <h3 className="font-semibold text-lg">Filters</h3>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-3 block">Sort By</label>
              <Select value={filters.sortBy || 'newest'} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="most-downloaded">Most Downloaded</SelectItem>
                  <SelectItem value="most-liked">Most Liked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="text-sm font-medium mb-3 block">Quick Filters</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trending"
                    checked={filters.trending || false}
                    onCheckedChange={(checked) => 
                      onFiltersChange({ ...filters, trending: checked as boolean })
                    }
                  />
                  <label htmlFor="trending" className="text-sm">Trending</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={filters.featured || false}
                    onCheckedChange={(checked) => 
                      onFiltersChange({ ...filters, featured: checked as boolean })
                    }
                  />
                  <label htmlFor="featured" className="text-sm">Featured</label>
                </div>
              </div>
            </div>

            {/* Tone Filter */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium mb-3">
                <span>Tone</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2">
                  {toneOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tone-${option.value}`}
                        checked={filters.tone?.includes(option.value) || false}
                        onCheckedChange={(checked) => 
                          handleToneChange(option.value, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`tone-${option.value}`} 
                        className="text-sm flex items-center space-x-2"
                      >
                        <span>{option.emoji}</span>
                        <span>{option.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Format Filter */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium mb-3">
                <span>Format</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2">
                  {formatOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`format-${option.value}`}
                        checked={filters.format?.includes(option.value) || false}
                        onCheckedChange={(checked) => 
                          handleFormatChange(option.value, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`format-${option.value}`} 
                        className="text-sm flex items-center space-x-2"
                      >
                        <span>{option.emoji}</span>
                        <span>{option.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Use Case Filter */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium mb-3">
                <span>Use Cases</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2">
                  {useCaseOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`usecase-${option.value}`}
                        checked={filters.useCases?.includes(option.value) || false}
                        onCheckedChange={(checked) => 
                          handleUseCaseChange(option.value, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`usecase-${option.value}`} 
                        className="text-sm flex items-center space-x-2"
                      >
                        <span>{option.emoji}</span>
                        <span>{option.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </Card>
    </div>
  )
}