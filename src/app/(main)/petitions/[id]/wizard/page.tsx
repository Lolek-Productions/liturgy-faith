'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { getPetition } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'

// Import wizard steps
import LanguageContextStep from '@/components/wizard/LanguageContextStep'
import ContextEditStep from '@/components/wizard/ContextEditStep'
import EditStep from '@/components/wizard/EditStep'
import PrintStep from '@/components/wizard/PrintStep'

const STEPS = [
  { id: 1, title: 'Language & Context', description: 'Choose language and select context template' },
  { id: 2, title: 'Context Details', description: 'Customize context with specific names and details' },
  { id: 3, title: 'Edit & Review', description: 'Generate and edit petitions using AI' },
  { id: 4, title: 'Print & Complete', description: 'Print petitions and complete' }
]

export default function PetitionWizardPage() {
  const params = useParams()
  const router = useRouter()
  const { setBreadcrumbs } = useBreadcrumbs()
  const [petition, setPetition] = useState<Petition | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Wizard state
  const [wizardData, setWizardData] = useState({
    language: 'english',
    contextId: '',
    contextData: {} as Record<string, unknown>,
    generatedContent: '',
  })

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Petitions", href: "/petitions" },
      { label: "Petition Wizard" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    const loadPetition = async () => {
      try {
        const id = await params.id
        if (typeof id === 'string') {
          const petitionData = await getPetition(id)
          if (petitionData) {
            setPetition(petitionData)
            // Initialize wizard data from existing petition
            setWizardData(prev => ({
              ...prev,
              language: petitionData.language || 'english',
              generatedContent: petitionData.generated_content || '',
            }))
          } else {
            setError('Petition not found')
          }
        }
      } catch (err) {
        console.error('Failed to load petition:', err)
        setError('Failed to load petition')
      } finally {
        setLoading(false)
      }
    }

    loadPetition()
  }, [params])

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepId: number) => {
    // Allow navigation to previous steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId)
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
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading petition wizard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !petition) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600">{error || 'Petition not found'}</p>
            <Button onClick={() => router.push('/petitions')} className="mt-4">
              Back to Petitions
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <LanguageContextStep
            petition={petition}
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onNext={handleNext}
          />
        )
      case 2:
        return (
          <ContextEditStep
            petition={petition}
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 3:
        return (
          <EditStep
            petition={petition}
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 4:
        return (
          <PrintStep
            petition={petition}
            wizardData={wizardData}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Petition Wizard: {petition.title}</span>
            <Badge variant="outline">
              {new Date(petition.date).toLocaleDateString()}
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Follow the steps below to configure and generate your petitions.
          </p>
        </CardHeader>
      </Card>

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

      {/* Step Content */}
      {renderStepContent()}
    </div>
  )
}