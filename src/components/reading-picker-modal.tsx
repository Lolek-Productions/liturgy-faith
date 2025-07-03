'use client'

import { useState, useMemo, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, Filter, X, Check } from "lucide-react"
import type { IndividualReading } from '@/lib/actions/readings'

interface ReadingPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (reading: IndividualReading | null) => void
  selectedReading?: IndividualReading | null
  readings: IndividualReading[]
  title: string
  readingType: 'first' | 'psalm' | 'second' | 'gospel'
}

export function ReadingPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedReading,
  readings,
  title,
  readingType
}: ReadingPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('relevance')

  // Get relevant readings based on type
  const relevantReadings = useMemo(() => {
    const categoryFilters: Record<string, string[]> = {
      first: ['first', 'reading', 'sunday', 'weekday', 'marriage', 'funeral', 'baptism', 'confirmation'],
      psalm: ['psalm', 'responsorial'],
      second: ['second', 'reading', 'sunday', 'weekday', 'marriage', 'funeral', 'baptism', 'confirmation'],
      gospel: ['gospel']
    }
    
    const relevantCategories = categoryFilters[readingType] || []
    
    return readings.filter(reading => {
      const readingCategory = reading.category?.toLowerCase() || ''
      return relevantCategories.some(cat => 
        readingCategory.includes(cat.toLowerCase())
      )
    })
  }, [readings, readingType])

  // Get unique languages and categories for filters
  const availableLanguages = useMemo(() => {
    const languages = new Set<string>()
    relevantReadings.forEach(reading => {
      const language = reading.language || 'English'
      languages.add(language)
    })
    return Array.from(languages).sort()
  }, [relevantReadings])

  const availableCategories = useMemo(() => {
    const categories = new Set<string>()
    relevantReadings.forEach(reading => {
      if (reading.category) {
        // Clean up category names
        const cleanCategory = reading.category
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
        categories.add(cleanCategory)
      }
    })
    return Array.from(categories).sort()
  }, [relevantReadings])

  const getReadingLanguage = useCallback((reading: IndividualReading): string => {
    return reading.language || 'English'
  }, [])

  // Filter and sort readings
  const filteredReadings = useMemo(() => {
    const filtered = relevantReadings.filter(reading => {
      // Text search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matches = 
          reading.pericope?.toLowerCase().includes(searchLower) ||
          reading.reading_text?.toLowerCase().includes(searchLower) ||
          reading.introduction?.toLowerCase().includes(searchLower) ||
          reading.category?.toLowerCase().includes(searchLower)
        if (!matches) return false
      }

      // Language filter
      if (selectedLanguage !== 'all') {
        const readingLanguage = getReadingLanguage(reading)
        if (readingLanguage !== selectedLanguage) return false
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const hasMatchingCategory = selectedCategories.some(category => 
          reading.category?.toLowerCase().includes(category.toLowerCase())
        )
        if (!hasMatchingCategory) return false
      }

      return true
    })

    // Sort readings
    if (sortBy === 'pericope') {
      filtered.sort((a, b) => (a.pericope || '').localeCompare(b.pericope || ''))
    } else if (sortBy === 'category') {
      filtered.sort((a, b) => (a.category || '').localeCompare(b.category || ''))
    } else if (sortBy === 'relevance') {
      // Sort by relevance to reading type
      const typeKeywords: Record<string, string[]> = {
        first: ['first', 'reading'],
        psalm: ['psalm'],
        second: ['second'],
        gospel: ['gospel']
      }
      const keywords = typeKeywords[readingType] || []
      
      filtered.sort((a, b) => {
        const aScore = keywords.reduce((score, keyword) => 
          score + (a.category?.toLowerCase().includes(keyword) ? 1 : 0), 0)
        const bScore = keywords.reduce((score, keyword) => 
          score + (b.category?.toLowerCase().includes(keyword) ? 1 : 0), 0)
        return bScore - aScore
      })
    }

    return filtered
  }, [relevantReadings, searchTerm, selectedLanguage, selectedCategories, sortBy, readingType, getReadingLanguage])

  const handleSelect = (reading: IndividualReading | null) => {
    onSelect(reading)
    onClose()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLanguage('all')
    setSelectedCategories([])
    setSortBy('relevance')
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-h-[90vh] flex flex-col"
        style={{ width: '80vw', maxWidth: '1000px' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-4 border-b pb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search" className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by pericope, text, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div>
                <Label className="text-sm font-medium">Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {availableLanguages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Sort by</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="pericope">Pericope</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Categories on separate row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Categories</Label>
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategories([])}
                  className="text-xs text-muted-foreground h-6 px-2"
                >
                  Clear all ({selectedCategories.length})
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  className="text-xs h-7"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredReadings.length} of {relevantReadings.length} readings
                {selectedCategories.length > 0 && (
                  <span className="ml-2 text-primary">
                    • {selectedCategories.length} category filter{selectedCategories.length > 1 ? 's' : ''}
                  </span>
                )}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Reading List */}
        <ScrollArea className="flex-1">
          <div className="space-y-4 pr-4">
            {/* Reading options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredReadings.slice(0, 8).map((reading) => (
                <div
                  key={reading.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReading?.id === reading.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleSelect(reading)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="font-medium text-base flex-1 pr-2">
                      {reading.pericope}
                    </div>
                    {selectedReading?.id === reading.id && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    {reading.category}
                  </div>
                  
                  {reading.reading_text && (
                    <div className="text-sm text-gray-700 line-clamp-2">
                      {reading.reading_text.substring(0, 120)}
                      {reading.reading_text.length > 120 && '...'}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredReadings.length > 8 && (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">
                  Showing 8 of {filteredReadings.length} readings. Use filters to narrow your search.
                </div>
              </div>
            )}

            {filteredReadings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="font-medium">No readings found</div>
                <div className="text-sm">Try adjusting your search or filters</div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedReading ? `Selected: ${selectedReading.pericope}` : 'No reading selected'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => handleSelect(selectedReading || null)}>
              Confirm Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}