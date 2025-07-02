'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { ArrowLeft, Save, Plus, X, Eye } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { useRouter } from 'next/navigation'
import { getIndividualReadings } from '@/lib/actions/readings'
import type { IndividualReading } from '@/lib/types'

interface ReadingSelection {
  id: string
  type: 'first' | 'psalm' | 'second' | 'gospel'
  readingId?: string
  lector?: string
  includeInPrint: boolean
}

interface LiturgicalReadingData {
  id: string
  title: string
  description?: string
  includePetitions: boolean
  readings: ReadingSelection[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditLiturgicalReadingPage({ params }: PageProps) {
  const [formData, setFormData] = useState<LiturgicalReadingData>({
    id: '',
    title: '',
    description: '',
    includePetitions: false,
    readings: []
  })
  const [availableReadings, setAvailableReadings] = useState<IndividualReading[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [readingId, setReadingId] = useState<string>('')
  const { setBreadcrumbs } = useBreadcrumbs()
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = await params
        setReadingId(id)
        
        // Load available readings
        const readings = await getIndividualReadings()
        setAvailableReadings(readings)
        
        // TODO: Load actual reading collection data
        // For now, simulate data
        const mockData: LiturgicalReadingData = {
          id: id,
          title: 'Sunday Mass - 3rd Sunday of Advent',
          description: 'Advent readings with special focus on preparation and joy',
          includePetitions: true,
          readings: [
            {
              id: '1',
              type: 'first',
              readingId: 'reading-1',
              lector: 'John Smith',
              includeInPrint: true
            },
            {
              id: '2',
              type: 'psalm',
              readingId: 'psalm-1',
              lector: 'Mary Johnson',
              includeInPrint: true
            },
            {
              id: '3',
              type: 'second',
              readingId: 'reading-2',
              lector: 'David Wilson',
              includeInPrint: true
            },
            {
              id: '4',
              type: 'gospel',
              readingId: 'gospel-1',
              includeInPrint: true
            }
          ]
        }
        
        setFormData(mockData)
        setBreadcrumbs([
          { label: "Dashboard", href: "/dashboard" },
          { label: "Liturgical Readings", href: "/liturgical-readings" },
          { label: mockData.title, href: `/liturgical-readings/${id}` },
          { label: "Edit" }
        ])
      } catch (error) {
        console.error('Failed to load reading collection:', error)
        router.push('/liturgical-readings')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params, setBreadcrumbs, router])

  const updateFormData = (updates: Partial<LiturgicalReadingData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const addReading = () => {
    const newReading: ReadingSelection = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'first',
      includeInPrint: true
    }
    updateFormData({ 
      readings: [...formData.readings, newReading] 
    })
  }

  const updateReading = (id: string, updates: Partial<ReadingSelection>) => {
    const updatedReadings = formData.readings.map(reading => 
      reading.id === id ? { ...reading, ...updates } : reading
    )
    updateFormData({ readings: updatedReadings })
  }

  const removeReading = (id: string) => {
    const filteredReadings = formData.readings.filter(reading => reading.id !== id)
    updateFormData({ readings: filteredReadings })
  }

  const getReadingsForType = (type: ReadingSelection['type']) => {
    const categoryMap = {
      first: ['first-reading', 'sunday-1', 'weekday-1', 'marriage-1', 'funeral-1'],
      psalm: ['psalm', 'sunday-psalm', 'weekday-psalm', 'marriage-psalm', 'funeral-psalm'],
      second: ['second-reading', 'sunday-2', 'weekday-2', 'marriage-2', 'funeral-2'],
      gospel: ['gospel', 'sunday-gospel', 'weekday-gospel', 'marriage-gospel', 'funeral-gospel']
    }
    
    const categories = categoryMap[type]
    return availableReadings.filter(reading => 
      categories.includes(reading.category.toLowerCase())
    )
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title for your reading collection.')
      return
    }

    setSaving(true)
    try {
      // TODO: Implement save functionality
      console.log('Saving reading collection:', formData)
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Reading collection updated successfully!')
      router.push(`/liturgical-readings/${readingId}`)
    } catch (error) {
      console.error('Failed to save reading collection:', error)
      alert('Failed to save reading collection. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="space-y-8">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/liturgical-readings/${readingId}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Reading
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Reading Collection</h1>
            <p className="text-muted-foreground">
              Modify your liturgical reading collection
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href={`/liturgical-readings/${readingId}`}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  placeholder="e.g., Sunday Mass - 3rd Sunday of Advent"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Additional details about this reading collection..."
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="petitions"
                  checked={formData.includePetitions}
                  onCheckedChange={(checked) => updateFormData({ includePetitions: !!checked })}
                />
                <Label htmlFor="petitions" className="text-sm font-medium">
                  Include petitions in print layout
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Reading Selections */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Reading Selections</CardTitle>
                <Button onClick={addReading} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reading
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.readings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No readings selected. Click &quot;Add Reading&quot; to start.</p>
                  </div>
                ) : (
                  formData.readings.map((reading) => (
                    <div key={reading.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                          {/* Reading Type */}
                          <div>
                            <Label className="text-sm font-medium">Reading Type</Label>
                            <Select 
                              value={reading.type} 
                              onValueChange={(value: ReadingSelection['type']) => 
                                updateReading(reading.id, { type: value, readingId: undefined })
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="first">First Reading</SelectItem>
                                <SelectItem value="psalm">Responsorial Psalm</SelectItem>
                                <SelectItem value="second">Second Reading</SelectItem>
                                <SelectItem value="gospel">Gospel</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Reading Selection */}
                          <div>
                            <Label className="text-sm font-medium">Select Reading</Label>
                            <Select 
                              value={reading.readingId || ""} 
                              onValueChange={(value) => 
                                updateReading(reading.id, { readingId: value || undefined })
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Choose reading..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">No reading selected</SelectItem>
                                {getReadingsForType(reading.type).map((availableReading) => (
                                  <SelectItem key={availableReading.id} value={availableReading.id}>
                                    <div>
                                      <div className="font-medium">{availableReading.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {availableReading.pericope}
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Lector */}
                          <div>
                            <Label className="text-sm font-medium">Lector (Optional)</Label>
                            <Input
                              value={reading.lector || ''}
                              onChange={(e) => updateReading(reading.id, { lector: e.target.value })}
                              placeholder="Lector name"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeReading(reading.id)}
                          className="ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={reading.includeInPrint}
                          onCheckedChange={(checked) => 
                            updateReading(reading.id, { includeInPrint: !!checked })
                          }
                        />
                        <Label className="text-sm">Include in print version</Label>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Title</div>
                <div className="font-medium">{formData.title || 'Untitled Collection'}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Readings</div>
                <div className="font-medium">{formData.readings.length} selected</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">For Print</div>
                <div className="font-medium">
                  {formData.readings.filter(r => r.includeInPrint).length} included
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Include Petitions</div>
                <Badge variant={formData.includePetitions ? "default" : "secondary"}>
                  {formData.includePetitions ? "Yes" : "No"}
                </Badge>
              </div>
              
              {formData.readings.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Reading Types</div>
                  <div className="space-y-1">
                    {formData.readings.map((reading) => (
                      <div key={reading.id} className="text-sm flex justify-between">
                        <span className="capitalize">{reading.type}</span>
                        <Badge 
                          variant={reading.includeInPrint ? "outline" : "secondary"} 
                          className="text-xs"
                        >
                          {reading.includeInPrint ? "Print" : "Skip"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleSave} 
                disabled={saving || !formData.title.trim()}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full"
              >
                <Link href={`/liturgical-readings/${readingId}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Collection
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}