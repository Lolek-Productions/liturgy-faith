'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Search, Filter, BookOpen, Eye, Copy, Calendar } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { getIndividualReadings } from '@/lib/actions/readings'
import type { IndividualReading } from '@/lib/types'

export default function ReadingsLibraryPage() {
  const [readings, setReadings] = useState<IndividualReading[]>([])
  const [filteredReadings, setFilteredReadings] = useState<IndividualReading[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Liturgical Readings", href: "/liturgical-readings" },
      { label: "Readings Library" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    const loadReadings = async () => {
      try {
        const allReadings = await getIndividualReadings()
        setReadings(allReadings)
        setFilteredReadings(allReadings)
      } catch (error) {
        console.error('Failed to load readings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReadings()
  }, [])

  useEffect(() => {
    let filtered = readings

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reading =>
        reading.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.pericope.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.reading_text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(reading => 
        reading.category.toLowerCase().includes(categoryFilter.toLowerCase())
      )
    }

    // Type filter (template vs personal)
    if (typeFilter) {
      if (typeFilter === 'template') {
        filtered = filtered.filter(reading => reading.is_template)
      } else if (typeFilter === 'personal') {
        filtered = filtered.filter(reading => !reading.is_template)
      }
    }

    setFilteredReadings(filtered)
  }, [readings, searchTerm, categoryFilter, typeFilter])

  const getReadingTypeColor = (category: string) => {
    if (category.includes('first') || category.includes('-1')) return 'bg-blue-100 text-blue-800'
    if (category.includes('psalm')) return 'bg-purple-100 text-purple-800'
    if (category.includes('second') || category.includes('-2')) return 'bg-green-100 text-green-800'
    if (category.includes('gospel')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getUniqueCategories = () => {
    const categories = readings.map(r => r.category)
    return [...new Set(categories)].sort()
  }

  const handleCopyToCollection = (reading: IndividualReading) => {
    // TODO: Implement copy to user's collection
    console.log('Copy reading to collection:', reading.id)
    alert(`Reading "${reading.title}" copied to your collection!`)
  }

  if (loading) {
    return <div className="space-y-8">Loading readings library...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Readings Library</h1>
          <p className="text-muted-foreground">
            Browse and use readings from the liturgical library for your collections.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search readings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {getUniqueCategories().map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace('-', ' ').replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="template">Template Readings</SelectItem>
                  <SelectItem value="personal">Personal Readings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {filteredReadings.length} of {readings.length} readings
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readings Grid */}
      {filteredReadings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReadings.map((reading) => (
            <Card key={reading.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{reading.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{reading.pericope}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getReadingTypeColor(reading.category)}>
                        {reading.category.replace('-', ' ').replace('_', ' ')}
                      </Badge>
                      <Badge variant={reading.is_template ? "secondary" : "default"}>
                        {reading.is_template ? "Template" : "Personal"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {reading.introduction && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    <strong>Introduction:</strong> {reading.introduction}
                  </p>
                )}
                
                <p className="text-sm line-clamp-3">
                  {reading.reading_text}
                </p>
                
                {reading.conclusion && (
                  <p className="text-sm text-muted-foreground italic">
                    — {reading.conclusion}
                  </p>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(reading.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/readings/library/${reading.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    {reading.is_template && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopyToCollection(reading)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm || categoryFilter || typeFilter ? 'No readings found' : 'No readings available'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || categoryFilter || typeFilter 
                ? 'Try adjusting your search or filter criteria.'
                : 'The readings library is empty. Check back later for available readings.'
              }
            </p>
            {(searchTerm || categoryFilter || typeFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('')
                  setTypeFilter('')
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}