'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, ArrowLeft } from 'lucide-react'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { PageContainer } from '@/components/page-container'
import { getPetition } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'

// Import wizard steps
import LanguageTemplateStep from './LanguageTemplateStep'
import DetailsEditStep from './DetailsEditStep'
import EditStep from './EditStep'
import PrintStep from './PrintStep'

const STEPS = [
  { id: 1, title: 'Language & Template', description: 'Choose language and select petition template' },
  { id: 2, title: 'Petition Details', description: 'Add specific names and community information for this liturgy' },
  { id: 3, title: 'Edit & Review', description: 'Generate and edit petitions using AI' },
  { id: 4, title: 'Print & Complete', description: 'Print petitions and complete' }
]

export default function PetitionWizardPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setBreadcrumbs } = useBreadcrumbs()
  const [petition, setPetition] = useState<Petition | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Wizard state
  const [wizardData, setWizardData] = useState({
    language: 'english',
    templateId: '',
    templateContent: '', // Stores the actual template text
    generatedContent: '',
  })

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Petitions", href: "/petitions" },
      { label: "Petition Wizard" }
    ])
  }, [setBreadcrumbs])

  const updateStepInUrl = (step: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set('step', step.toString())
    router.replace(url.pathname + url.search, { scroll: false })
  }

  // Initialize step from URL params
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10)
      if (stepNumber >= 1 && stepNumber <= STEPS.length) {
        setCurrentStep(stepNumber)
      }
    } else {
      // If no step in URL, set step 1 in URL
      updateStepInUrl(1)
    }
  }, [searchParams])

  useEffect(() => {
    const loadPetition = async () => {
      try {
        setLoading(true)
        setError('')
        const resolvedParams = await params
        const id = resolvedParams.id
        if (typeof id === 'string') {
          const petitionData = await getPetition(id)
          if (petitionData) {
            setPetition(petitionData)
            // Initialize wizard data from existing petition
            setWizardData(prev => ({
              ...prev,
              language: petitionData.language || 'english',
              templateContent: petitionData.template || '', // Initialize from existing template
              generatedContent: petitionData.text || '', // Use text field, not generated_content
            }))
          } else {
            setError('Petition not found')
          }
        } else {
          setError('Invalid petition ID')
        }
      } catch (err) {
        console.error('Failed to load petition:', err)
        setError('Failed to load petition')
      } finally {
        setLoading(false)
      }
    }

    loadPetition()
  }, [])

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      updateStepInUrl(newStep)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      updateStepInUrl(newStep)
    }
  }

  const handleStepClick = (stepId: number) => {
    // Allow navigation to previous steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId)
      updateStepInUrl(stepId)
    }
  }

  const updateWizardData = (updates: Partial<typeof wizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }))
  }

  const handleComplete = () => {
    router.push(`/petitions/${petition?.id}`)
  }

  if (loading) {
    return (
      <PageContainer
        title="Petition Wizard"
        description="Configure and generate your petitions"
        maxWidth="4xl"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading petition wizard...</p>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  if (error || !petition) {
    return (
      <PageContainer
        title="Petition Wizard"
        description="Configure and generate your petitions"
        maxWidth="4xl"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600">{error || 'Petition not found'}</p>
            <Button onClick={() => router.push('/petitions')} className="mt-4">
              Back to Petitions
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  const renderStepContent = () => {
    if (!petition) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading step content...</p>
          </CardContent>
        </Card>
      )
    }

    switch (currentStep) {
      case 1:
        return (
          <LanguageTemplateStep
            petition={petition}
            wizardData={wizardData}
            updateWizardData={updateWizardData}
          />
        )
      case 2:
        return (
          <DetailsEditStep
            petition={petition}
            wizardData={wizardData}
            updateWizardData={updateWizardData}
          />
        )
      case 3:
        return (
          <EditStep
            petition={petition}
            wizardData={wizardData}
            updateWizardData={updateWizardData}
          />
        )
      case 4:
        return (
          <PrintStep
            petition={petition}
            wizardData={wizardData}
          />
        )
      default:
        return null
    }
  }

  return (
    <PageContainer
      title={petition ? `Petition Wizard: ${petition.title}` : "Petition Wizard"}
      description="Follow the steps below to configure and generate your petitions"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleStepClick(step.id)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        step.id < currentStep
                          ? 'bg-green-500 border-green-500 text-white'
                          : step.id === currentStep
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'border-gray-300 text-gray-500'
                      } ${step.id <= currentStep ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                    >
                      {step.id < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </button>
                  </div>
                  
                  {index < STEPS.length - 1 && (
                    <div 
                      className={`w-16 h-0.5 mx-4 ${
                        step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="font-medium">{STEPS[currentStep - 1]?.title}</h3>
              <p className="text-sm text-muted-foreground">
                {STEPS[currentStep - 1]?.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext}>
              Next: {STEPS[currentStep]?.title}
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              Complete & View Petition
            </Button>
          )}
        </div>

        {/* Step Content */}
        {renderStepContent()}
      </div>
    </PageContainer>
  )
}