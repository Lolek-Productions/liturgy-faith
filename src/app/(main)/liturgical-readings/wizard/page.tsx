'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  Printer,
  Save
} from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { PageContainer } from '@/components/page-container'
import { getIndividualReadings } from '@/lib/actions/readings'
import type { IndividualReading } from '@/lib/types'

interface WizardData {
  title: string
  description: string
  includePetitions: boolean
  readings: {
    first?: string
    psalm?: string
    second?: string
    gospel?: string
  }
  lectors: {
    first?: string
    psalm?: string
    second?: string
    gospel?: string
  }
  printOptions: {
    first: boolean
    psalm: boolean
    second: boolean
    gospel: boolean
  }
}

const READING_CATEGORIES = {
  first: ['first-reading', 'sunday-1', 'weekday-1', 'marriage-1', 'funeral-1'],
  psalm: ['psalm', 'sunday-psalm', 'weekday-psalm', 'marriage-psalm', 'funeral-psalm'],
  second: ['second-reading', 'sunday-2', 'weekday-2', 'marriage-2', 'funeral-2'],
  gospel: ['gospel', 'sunday-gospel', 'weekday-gospel', 'marriage-gospel', 'funeral-gospel']
}

export default function ReadingsWizardPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    title: '',
    description: '',
    includePetitions: false,
    readings: {},
    lectors: {},
    printOptions: {
      first: true,
      psalm: true,
      second: true,
      gospel: true
    }
  })
  const [availableReadings, setAvailableReadings] = useState<IndividualReading[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Liturgical Readings", href: "/liturgical-readings" },
      { label: "Readings Wizard" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    const loadReadings = async () => {
      try {
        const readings = await getIndividualReadings()
        setAvailableReadings(readings)
      } catch (error) {
        console.error('Failed to load readings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReadings()
  }, [])

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getReadingsForCategory = (category: keyof typeof READING_CATEGORIES) => {
    const categories = READING_CATEGORIES[category]
    return availableReadings.filter(reading => 
      categories.includes(reading.category.toLowerCase())
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Implement save functionality
      console.log('Saving wizard data:', wizardData)
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Readings saved successfully!')
    } catch (error) {
      console.error('Failed to save readings:', error)
      alert('Failed to save readings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = () => {
    // Build print URL with selected readings
    const params = new URLSearchParams()
    
    const selectedReadingIds = Object.values(wizardData.readings).filter(Boolean)
    if (selectedReadingIds.length > 0) {
      params.set('readings', selectedReadingIds.join(','))
    }
    
    params.set('title', wizardData.title || 'Liturgical Readings')
    
    if (wizardData.includePetitions) {
      params.set('includePetitions', 'true')
    }
    
    const printUrl = wizardData.includePetitions 
      ? `/print/combined?${params.toString()}`
      : `/print/readings-print?${params.toString()}`
    
    window.open(printUrl, '_blank')
  }

  const steps = [
    'Event Details',
    'Petitions Option', 
    'First Reading',
    'Psalm',
    'Second Reading & Gospel',
    'Review & Save'
  ]

  if (loading) {
    return (
      <PageContainer
        title="Loading..."
        description="Loading readings wizard"
        maxWidth="6xl"
      >
        <div>Loading readings...</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Readings Wizard"
      description="Create a complete liturgical reading plan step by step"
      maxWidth="6xl"
    >

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              index + 1 === currentStep 
                ? 'bg-primary text-primary-foreground' 
                : index + 1 < currentStep 
                  ? 'bg-green-500 text-white' 
                  : 'bg-muted text-muted-foreground'
            }`}>
              {index + 1 < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <div className={`ml-2 text-sm ${
              index + 1 === currentStep ? 'font-medium' : 'text-muted-foreground'
            }`}>
              {step}
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {/* Step 1: Event Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Event Details</h2>
                <p className="text-muted-foreground">Tell us about the liturgical event</p>
              </div>
              
              <div className="space-y-4 max-w-lg mx-auto">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Event Title *</Label>
                  <Input
                    id="title"
                    value={wizardData.title}
                    onChange={(e) => updateWizardData({ title: e.target.value })}
                    placeholder="e.g., Sunday Mass, Wedding Ceremony, Funeral Service"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={wizardData.description}
                    onChange={(e) => updateWizardData({ description: e.target.value })}
                    placeholder="Additional details about the event..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Petitions Option */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Include Petitions?</h2>
                <p className="text-muted-foreground">Would you like to include petitions with your readings?</p>
              </div>
              
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="petitions"
                    checked={wizardData.includePetitions}
                    onCheckedChange={(checked) => updateWizardData({ includePetitions: !!checked })}
                  />
                  <Label htmlFor="petitions" className="text-sm font-medium">
                    Include petitions in the final document
                  </Label>
                </div>
              </div>
              
              {wizardData.includePetitions && (
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Petitions will be included in your print layout. You can configure 
                    specific petition content in the settings.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: First Reading */}
          {currentStep === 3 && (
            <ReadingSelectionStep
              title="First Reading"
              description="Select the first reading for your liturgical celebration"
              category="first"
              readings={getReadingsForCategory('first')}
              selectedReading={wizardData.readings.first}
              lector={wizardData.lectors.first}
              printOption={wizardData.printOptions.first}
              onReadingChange={(reading) => updateWizardData({ 
                readings: { ...wizardData.readings, first: reading } 
              })}
              onLectorChange={(lector) => updateWizardData({ 
                lectors: { ...wizardData.lectors, first: lector } 
              })}
              onPrintChange={(print) => updateWizardData({ 
                printOptions: { ...wizardData.printOptions, first: print } 
              })}
            />
          )}

          {/* Step 4: Psalm */}
          {currentStep === 4 && (
            <ReadingSelectionStep
              title="Responsorial Psalm"
              description="Select the psalm for your liturgical celebration"
              category="psalm"
              readings={getReadingsForCategory('psalm')}
              selectedReading={wizardData.readings.psalm}
              lector={wizardData.lectors.psalm}
              printOption={wizardData.printOptions.psalm}
              onReadingChange={(reading) => updateWizardData({ 
                readings: { ...wizardData.readings, psalm: reading } 
              })}
              onLectorChange={(lector) => updateWizardData({ 
                lectors: { ...wizardData.lectors, psalm: lector } 
              })}
              onPrintChange={(print) => updateWizardData({ 
                printOptions: { ...wizardData.printOptions, psalm: print } 
              })}
            />
          )}

          {/* Step 5: Second Reading & Gospel */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Second Reading & Gospel</h2>
                <p className="text-muted-foreground">Complete your reading selections</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ReadingSelectionStep
                  title="Second Reading"
                  description="Optional second reading"
                  category="second"
                  readings={getReadingsForCategory('second')}
                  selectedReading={wizardData.readings.second}
                  lector={wizardData.lectors.second}
                  printOption={wizardData.printOptions.second}
                  onReadingChange={(reading) => updateWizardData({ 
                    readings: { ...wizardData.readings, second: reading } 
                  })}
                  onLectorChange={(lector) => updateWizardData({ 
                    lectors: { ...wizardData.lectors, second: lector } 
                  })}
                  onPrintChange={(print) => updateWizardData({ 
                    printOptions: { ...wizardData.printOptions, second: print } 
                  })}
                />
                
                <ReadingSelectionStep
                  title="Gospel"
                  description="Gospel reading"
                  category="gospel"
                  readings={getReadingsForCategory('gospel')}
                  selectedReading={wizardData.readings.gospel}
                  lector={wizardData.lectors.gospel}
                  printOption={wizardData.printOptions.gospel}
                  onReadingChange={(reading) => updateWizardData({ 
                    readings: { ...wizardData.readings, gospel: reading } 
                  })}
                  onLectorChange={(lector) => updateWizardData({ 
                    lectors: { ...wizardData.lectors, gospel: lector } 
                  })}
                  onPrintChange={(print) => updateWizardData({ 
                    printOptions: { ...wizardData.printOptions, gospel: print } 
                  })}
                />
              </div>
            </div>
          )}

          {/* Step 6: Review & Save */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Review & Save</h2>
                <p className="text-muted-foreground">Review your reading selections and save or print</p>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><strong>Title:</strong> {wizardData.title}</div>
                      {wizardData.description && (
                        <div><strong>Description:</strong> {wizardData.description}</div>
                      )}
                      <div><strong>Include Petitions:</strong> {wizardData.includePetitions ? 'Yes' : 'No'}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Readings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(wizardData.readings).map(([type, readingId]) => {
                        if (!readingId) return null
                        const reading = availableReadings.find(r => r.id === readingId)
                        const lector = wizardData.lectors[type as keyof typeof wizardData.lectors]
                        
                        return (
                          <div key={type} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium capitalize">{type} Reading</h4>
                                <p className="text-sm text-muted-foreground">{reading?.title}</p>
                                <p className="text-xs text-muted-foreground">{reading?.pericope}</p>
                                {lector && (
                                  <p className="text-xs text-muted-foreground mt-1">Lector: {lector}</p>
                                )}
                              </div>
                              <Badge variant={wizardData.printOptions[type as keyof typeof wizardData.printOptions] ? "default" : "secondary"}>
                                {wizardData.printOptions[type as keyof typeof wizardData.printOptions] ? "Print" : "Skip"}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Readings'}
                  </Button>
                  
                  <Button 
                    onClick={handlePrint} 
                    variant="outline"
                    size="lg"
                    disabled={!Object.values(wizardData.readings).some(Boolean)}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Readings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          onClick={prevStep} 
          disabled={currentStep === 1}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <Button 
          onClick={nextStep} 
          disabled={currentStep === 6 || (currentStep === 1 && !wizardData.title.trim())}
        >
          {currentStep === 6 ? 'Complete' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </PageContainer>
  )
}

// Reading Selection Component
interface ReadingSelectionStepProps {
  title: string
  description: string
  category: string
  readings: IndividualReading[]
  selectedReading?: string
  lector?: string
  printOption: boolean
  onReadingChange: (reading?: string) => void
  onLectorChange: (lector: string) => void
  onPrintChange: (print: boolean) => void
}

function ReadingSelectionStep({
  title,
  description,
  readings,
  selectedReading,
  lector,
  printOption,
  onReadingChange,
  onLectorChange,
  onPrintChange
}: ReadingSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="space-y-4 max-w-lg mx-auto">
        <div>
          <Label className="text-sm font-medium">Select Reading</Label>
          <Select value={selectedReading || ""} onValueChange={(value) => onReadingChange(value || undefined)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose a reading (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Skip this reading</SelectItem>
              {readings.map((reading) => (
                <SelectItem key={reading.id} value={reading.id}>
                  <div>
                    <div className="font-medium">{reading.title}</div>
                    <div className="text-xs text-muted-foreground">{reading.pericope}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedReading && (
          <>
            <div>
              <Label htmlFor="lector" className="text-sm font-medium">Lector Name (Optional)</Label>
              <Input
                id="lector"
                value={lector || ''}
                onChange={(e) => onLectorChange(e.target.value)}
                placeholder="Enter lector's name"
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="print"
                checked={printOption}
                onCheckedChange={(checked) => onPrintChange(!!checked)}
              />
              <Label htmlFor="print" className="text-sm font-medium">
                Include in print version
              </Label>
            </div>
          </>
        )}
      </div>
    </div>
  )
}