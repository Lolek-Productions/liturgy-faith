'use client'

import { useEffect, useState, Suspense } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Save, Printer, BookOpen, Plus } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { PageContainer } from '@/components/page-container'
import { useRouter, useSearchParams } from 'next/navigation'
import { getIndividualReadings } from '@/lib/actions/readings'
import { getLiturgicalReading, updateLiturgicalReading } from '@/lib/actions/liturgical-readings'
import type { IndividualReading } from '@/lib/actions/readings'
import { WizardNavigation, WizardContainer } from '@/components/liturgical-readings-wizard'
import { ReadingPickerModal } from '@/components/reading-picker-modal'
import { toast } from 'sonner'

interface WizardData {
  id: string
  title: string
  description?: string
  date?: Date
  first_reading?: string
  first_reading_lector?: string
  responsorial_psalm?: string
  psalm_lector?: string
  second_reading?: string
  second_reading_lector?: string
  gospel_reading?: string
  gospel_lector?: string
}

interface WizardStep {
  id: number
  title: string
  description: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

function EditLiturgicalReadingWizard({ params }: PageProps) {
  const searchParams = useSearchParams()
  const initialStep = parseInt(searchParams.get('step') || '1') - 1 // Convert to 0-based index
  const [currentStep, setCurrentStep] = useState(Math.max(0, Math.min(5, initialStep)))
  const [wizardData, setWizardData] = useState<WizardData>({
    id: '',
    title: '',
    description: '',
    date: undefined
  })
  const [availableReadings, setAvailableReadings] = useState<IndividualReading[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [readingId, setReadingId] = useState<string>('')
  const [openModal, setOpenModal] = useState<'first' | 'psalm' | 'second' | 'gospel' | null>(null)
  const { setBreadcrumbs } = useBreadcrumbs()
  const router = useRouter()

  const wizardSteps: WizardStep[] = [
    { id: 1, title: "Basic Info", description: "Name, description, and date" },
    { id: 2, title: "First Reading", description: "Select first reading and lector" },
    { id: 3, title: "Psalm", description: "Select responsorial psalm and lector" },
    { id: 4, title: "Second Reading", description: "Select second reading and lector" },
    { id: 5, title: "Gospel", description: "Select gospel reading and lector" },
    { id: 6, title: "Review", description: "Final review and print" }
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = await params
        setReadingId(id)
        
        // Load available readings
        const readings = await getIndividualReadings()
        setAvailableReadings(readings)
        
        // Load actual liturgical reading data
        try {
          const liturgicalReading = await getLiturgicalReading(id)
          if (liturgicalReading) {
            setWizardData({
              id: liturgicalReading.id,
              title: liturgicalReading.title || '',
              description: liturgicalReading.description || '',
              date: liturgicalReading.date ? new Date(liturgicalReading.date) : undefined,
              first_reading: liturgicalReading.first_reading || undefined,
              first_reading_lector: liturgicalReading.first_reading_lector || undefined,
              responsorial_psalm: liturgicalReading.responsorial_psalm || undefined,
              psalm_lector: liturgicalReading.psalm_lector || undefined,
              second_reading: liturgicalReading.second_reading || undefined,
              second_reading_lector: liturgicalReading.second_reading_lector || undefined,
              gospel_reading: liturgicalReading.gospel_reading || undefined,
              gospel_lector: liturgicalReading.gospel_lector || undefined
            })
            
            setBreadcrumbs([
              { label: "Dashboard", href: "/dashboard" },
              { label: "Liturgical Readings", href: "/liturgical-readings" },
              { label: liturgicalReading.title || 'Untitled', href: `/liturgical-readings/${id}` },
              { label: "Wizard" }
            ])
          } else {
            // New reading - set basic data
            setWizardData(prev => ({ ...prev, id }))
            setBreadcrumbs([
              { label: "Dashboard", href: "/dashboard" },
              { label: "Liturgical Readings", href: "/liturgical-readings" },
              { label: "New Reading", href: `/liturgical-readings/${id}` },
              { label: "Wizard" }
            ])
          }
        } catch (error) {
          console.error('Failed to load liturgical reading:', error)
          // Continue with empty data for new reading
          setWizardData(prev => ({ ...prev, id }))
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        router.push('/liturgical-readings')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params, setBreadcrumbs, router])

  // Update URL when wizard is first loaded with initial step
  useEffect(() => {
    if (!loading) {
      updateStepInURL(currentStep)
    }
  }, [loading, currentStep])

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }))
  }

  const getSelectedReading = (readingId?: string): IndividualReading | null => {
    if (!readingId) return null
    return availableReadings.find(r => r.id === readingId) || null
  }

  const handleReadingSelect = (type: 'first' | 'psalm' | 'second' | 'gospel', reading: IndividualReading | null) => {
    const fieldMap = {
      first: 'first_reading',
      psalm: 'responsorial_psalm',
      second: 'second_reading',
      gospel: 'gospel_reading'
    } as const

    updateWizardData({ [fieldMap[type]]: reading?.id })
    setOpenModal(null)
  }

  const handleSave = async () => {
    if (!wizardData.title.trim()) {
      toast.error('Please enter a title for your reading collection.')
      return
    }

    setSaving(true)
    try {
      await updateLiturgicalReading(wizardData.id, {
        title: wizardData.title,
        description: wizardData.description,
        date: wizardData.date ? wizardData.date.toISOString().split('T')[0] : undefined,
        first_reading: wizardData.first_reading,
        first_reading_lector: wizardData.first_reading_lector,
        responsorial_psalm: wizardData.responsorial_psalm,
        psalm_lector: wizardData.psalm_lector,
        second_reading: wizardData.second_reading,
        second_reading_lector: wizardData.second_reading_lector,
        gospel_reading: wizardData.gospel_reading,
        gospel_lector: wizardData.gospel_lector
      })
      
      toast.success('Reading collection saved successfully!')
      router.push(`/liturgical-readings/${readingId}`)
    } catch (error) {
      console.error('Failed to save reading collection:', error)
      toast.error('Failed to save reading collection. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Info
        return wizardData.title.trim().length > 0
      case 1: // First Reading
      case 2: // Psalm
      case 3: // Second Reading
      case 4: // Gospel
        return true // These steps are optional
      case 5: // Review
        return true
      default:
        return false
    }
  }

  const updateStepInURL = (step: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set('step', (step + 1).toString()) // Convert back to 1-based for URL
    window.history.replaceState({}, '', url.toString())
  }

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1 && canProceedFromStep(currentStep)) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      updateStepInURL(nextStep)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      updateStepInURL(prevStep)
    }
  }

  const handleStepChange = (step: number) => {
    if (step <= currentStep || canProceedFromStep(currentStep)) {
      setCurrentStep(step)
      updateStepInURL(step)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the basic details for your liturgical reading collection
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                <Input
                  id="title"
                  value={wizardData.title}
                  onChange={(e) => updateWizardData({ title: e.target.value })}
                  placeholder="e.g., Sunday Mass - 3rd Sunday of Advent"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={wizardData.description || ''}
                  onChange={(e) => updateWizardData({ description: e.target.value })}
                  placeholder="Additional details about this reading collection..."
                  rows={4}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !wizardData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {wizardData.date ? format(wizardData.date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={wizardData.date}
                      onSelect={(date) => updateWizardData({ date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        )

      case 1: // First Reading
        return (
          <Card>
            <CardHeader>
              <CardTitle>First Reading</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose a first reading and optionally assign a lector
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Select First Reading</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateWizardData({ first_reading: undefined })
                      handleNext()
                    }}
                    className="text-muted-foreground hover:text-foreground border-dashed"
                  >
                    Skip this reading
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => setOpenModal('first')}
                >
                  <div className="flex items-center gap-3 w-full">
                    <BookOpen className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      {wizardData.first_reading ? (
                        <div>
                          <div className="font-medium">
                            {getSelectedReading(wizardData.first_reading)?.pericope || 'Unknown Reading'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getSelectedReading(wizardData.first_reading)?.category}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">Choose a first reading...</div>
                      )}
                    </div>
                    <Plus className="h-4 w-4 flex-shrink-0" />
                  </div>
                </Button>
              </div>
              
              <div>
                <Label htmlFor="first-lector" className="text-sm font-medium">Lector Name (Optional)</Label>
                <Input
                  id="first-lector"
                  value={wizardData.first_reading_lector || ''}
                  onChange={(e) => updateWizardData({ first_reading_lector: e.target.value })}
                  placeholder="Enter lector name"
                  className="mt-1"
                />
              </div>
              
              {wizardData.first_reading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Reading</h4>
                  <div className="text-sm text-blue-800">
                    {(() => {
                      const reading = getSelectedReading(wizardData.first_reading)
                      return reading ? (
                        <div>
                          <div className="font-medium">{reading.pericope}</div>
                          <div className="mt-1 text-xs">{reading.introduction || reading.reading_text?.substring(0, 100) + '...'}</div>
                        </div>
                      ) : 'Reading not found'
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 2: // Psalm
        return (
          <Card>
            <CardHeader>
              <CardTitle>Responsorial Psalm</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose a responsorial psalm and optionally assign a lector
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Select Responsorial Psalm</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateWizardData({ responsorial_psalm: undefined })
                      handleNext()
                    }}
                    className="text-muted-foreground hover:text-foreground border-dashed"
                  >
                    Skip this reading
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => setOpenModal('psalm')}
                >
                  <div className="flex items-center gap-3 w-full">
                    <BookOpen className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      {wizardData.responsorial_psalm ? (
                        <div>
                          <div className="font-medium">
                            {getSelectedReading(wizardData.responsorial_psalm)?.pericope || 'Unknown Psalm'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getSelectedReading(wizardData.responsorial_psalm)?.category}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">Choose a psalm...</div>
                      )}
                    </div>
                    <Plus className="h-4 w-4 flex-shrink-0" />
                  </div>
                </Button>
              </div>
              
              <div>
                <Label htmlFor="psalm-lector" className="text-sm font-medium">Lector Name (Optional)</Label>
                <Input
                  id="psalm-lector"
                  value={wizardData.psalm_lector || ''}
                  onChange={(e) => updateWizardData({ psalm_lector: e.target.value })}
                  placeholder="Enter lector name"
                  className="mt-1"
                />
              </div>
              
              {wizardData.responsorial_psalm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Psalm</h4>
                  <div className="text-sm text-blue-800">
                    {(() => {
                      const reading = getSelectedReading(wizardData.responsorial_psalm)
                      return reading ? (
                        <div>
                          <div className="font-medium">{reading.pericope}</div>
                          <div className="mt-1 text-xs">{reading.introduction || reading.reading_text?.substring(0, 100) + '...'}</div>
                        </div>
                      ) : 'Psalm not found'
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 3: // Second Reading
        return (
          <Card>
            <CardHeader>
              <CardTitle>Second Reading</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose a second reading and optionally assign a lector
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Select Second Reading</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateWizardData({ second_reading: undefined })
                      handleNext()
                    }}
                    className="text-muted-foreground hover:text-foreground border-dashed"
                  >
                    Skip this reading
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => setOpenModal('second')}
                >
                  <div className="flex items-center gap-3 w-full">
                    <BookOpen className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      {wizardData.second_reading ? (
                        <div>
                          <div className="font-medium">
                            {getSelectedReading(wizardData.second_reading)?.pericope || 'Unknown Reading'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getSelectedReading(wizardData.second_reading)?.category}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">Choose a second reading...</div>
                      )}
                    </div>
                    <Plus className="h-4 w-4 flex-shrink-0" />
                  </div>
                </Button>
              </div>
              
              <div>
                <Label htmlFor="second-lector" className="text-sm font-medium">Lector Name (Optional)</Label>
                <Input
                  id="second-lector"
                  value={wizardData.second_reading_lector || ''}
                  onChange={(e) => updateWizardData({ second_reading_lector: e.target.value })}
                  placeholder="Enter lector name"
                  className="mt-1"
                />
              </div>
              
              {wizardData.second_reading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Reading</h4>
                  <div className="text-sm text-blue-800">
                    {(() => {
                      const reading = getSelectedReading(wizardData.second_reading)
                      return reading ? (
                        <div>
                          <div className="font-medium">{reading.pericope}</div>
                          <div className="mt-1 text-xs">{reading.introduction || reading.reading_text?.substring(0, 100) + '...'}</div>
                        </div>
                      ) : 'Reading not found'
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 4: // Gospel
        return (
          <Card>
            <CardHeader>
              <CardTitle>Gospel Reading</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose the gospel reading and optionally assign a lector
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Select Gospel Reading</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateWizardData({ gospel_reading: undefined })
                      handleNext()
                    }}
                    className="text-muted-foreground hover:text-foreground border-dashed"
                  >
                    Skip this reading
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => setOpenModal('gospel')}
                >
                  <div className="flex items-center gap-3 w-full">
                    <BookOpen className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      {wizardData.gospel_reading ? (
                        <div>
                          <div className="font-medium">
                            {getSelectedReading(wizardData.gospel_reading)?.pericope || 'Unknown Gospel'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getSelectedReading(wizardData.gospel_reading)?.category}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">Choose a gospel reading...</div>
                      )}
                    </div>
                    <Plus className="h-4 w-4 flex-shrink-0" />
                  </div>
                </Button>
              </div>
              
              <div>
                <Label htmlFor="gospel-lector" className="text-sm font-medium">Lector Name (Optional)</Label>
                <Input
                  id="gospel-lector"
                  value={wizardData.gospel_lector || ''}
                  onChange={(e) => updateWizardData({ gospel_lector: e.target.value })}
                  placeholder="Enter lector name"
                  className="mt-1"
                />
              </div>
              
              {wizardData.gospel_reading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Gospel</h4>
                  <div className="text-sm text-blue-800">
                    {(() => {
                      const reading = getSelectedReading(wizardData.gospel_reading)
                      return reading ? (
                        <div>
                          <div className="font-medium">{reading.pericope}</div>
                          <div className="mt-1 text-xs">{reading.introduction || reading.reading_text?.substring(0, 100) + '...'}</div>
                        </div>
                      ) : 'Gospel not found'
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 5: // Review
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review & Finalize</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review your liturgical reading collection and make final edits
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="review-title" className="text-sm font-medium">Title</Label>
                    <Input
                      id="review-title"
                      value={wizardData.title}
                      onChange={(e) => updateWizardData({ title: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !wizardData.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {wizardData.date ? format(wizardData.date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={wizardData.date}
                          onSelect={(date) => updateWizardData({ date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="review-description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="review-description"
                    value={wizardData.description || ''}
                    onChange={(e) => updateWizardData({ description: e.target.value })}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'First Reading', field: 'first_reading', lectorField: 'first_reading_lector' },
                    { label: 'Responsorial Psalm', field: 'responsorial_psalm', lectorField: 'psalm_lector' },
                    { label: 'Second Reading', field: 'second_reading', lectorField: 'second_reading_lector' },
                    { label: 'Gospel Reading', field: 'gospel_reading', lectorField: 'gospel_lector' }
                  ].map(({ label, field, lectorField }) => {
                    const readingId = wizardData[field as keyof WizardData] as string
                    const lector = wizardData[lectorField as keyof WizardData] as string
                    const reading = readingId ? availableReadings.find(r => r.id === readingId) : null
                    
                    return (
                      <div key={field} className="space-y-2">
                        <Label className="text-sm font-medium">{label}</Label>
                        <div className="border rounded-lg p-3 bg-gray-50">
                          {reading ? (
                            <div>
                              <div className="font-medium text-sm">{reading.pericope}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {reading.category}
                              </div>
                              {lector && (
                                <div className="text-xs text-blue-600 mt-1">Lector: {lector}</div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No reading selected</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving || !wizardData.title.trim()}
                    className="flex-1"
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Reading Collection'}
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                  >
                    <Link href={`/liturgical-readings/${readingId}/print`}>
                      <Printer className="h-4 w-4 mr-2" />
                      Preview & Print
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return <div>Invalid step</div>
    }
  }

  if (loading) {
    return (
      <PageContainer
        title="Loading..."
        description="Loading liturgical readings wizard"
        maxWidth="4xl"
      >
        <div>Loading...</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Liturgical Readings Wizard"
      description="Create your liturgical reading collection step by step"
      maxWidth="4xl"
    >
      
      <WizardContainer
        navigation={
          <WizardNavigation
            steps={wizardSteps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            canProceed={canProceedFromStep(currentStep)}
            canGoBack={currentStep > 0}
            onNext={handleNext}
            onPrevious={handlePrevious}
            nextLabel={currentStep === wizardSteps.length - 1 ? "Complete" : "Next Step"}
          />
        }
      >
        {renderStepContent()}
      </WizardContainer>

      {/* Reading Selection Modals */}
      <ReadingPickerModal
        isOpen={openModal === 'first'}
        onClose={() => setOpenModal(null)}
        onSelect={(reading) => handleReadingSelect('first', reading)}
        selectedReading={getSelectedReading(wizardData.first_reading)}
        readings={availableReadings}
        title="Select First Reading"
        readingType="first"
      />

      <ReadingPickerModal
        isOpen={openModal === 'psalm'}
        onClose={() => setOpenModal(null)}
        onSelect={(reading) => handleReadingSelect('psalm', reading)}
        selectedReading={getSelectedReading(wizardData.responsorial_psalm)}
        readings={availableReadings}
        title="Select Responsorial Psalm"
        readingType="psalm"
      />

      <ReadingPickerModal
        isOpen={openModal === 'second'}
        onClose={() => setOpenModal(null)}
        onSelect={(reading) => handleReadingSelect('second', reading)}
        selectedReading={getSelectedReading(wizardData.second_reading)}
        readings={availableReadings}
        title="Select Second Reading"
        readingType="second"
      />

      <ReadingPickerModal
        isOpen={openModal === 'gospel'}
        onClose={() => setOpenModal(null)}
        onSelect={(reading) => handleReadingSelect('gospel', reading)}
        selectedReading={getSelectedReading(wizardData.gospel_reading)}
        readings={availableReadings}
        title="Select Gospel Reading"
        readingType="gospel"
      />
    </PageContainer>
  )
}

export default function EditLiturgicalReadingPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="space-y-8">Loading wizard...</div>}>
      <EditLiturgicalReadingWizard params={params} />
    </Suspense>
  )
}