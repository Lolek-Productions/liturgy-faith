'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getPetitionContexts, PetitionContextTemplate, ensureDefaultContexts, cleanupInvalidContexts } from '@/lib/actions/petition-contexts'
import { parseContextData } from '@/lib/petition-context-utils'
import { updatePetitionLanguage, updatePetitionContext } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'
import { useAppContext } from '@/contexts/AppContextProvider'
import { toast } from 'sonner'

interface LanguageContextStepProps {
  petition: Petition
  wizardData: {
    language: string
    contextId: string
    contextData: Record<string, unknown>
    generatedContent: string
  }
  updateWizardData: (updates: Record<string, unknown>) => void
  onNext: () => void
}

export default function LanguageContextStep({ 
  petition, 
  wizardData, 
  updateWizardData, 
  onNext 
}: LanguageContextStepProps) {
  const { userSettings } = useAppContext()
  const [contexts, setContexts] = useState<PetitionContextTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadContexts = async () => {
      try {
        // Clean up invalid contexts first
        await cleanupInvalidContexts()
        // Ensure user has default contexts
        await ensureDefaultContexts()
        
        const data = await getPetitionContexts()
        setContexts(data)
        
        // Initialize with user's preferred language if not set
        if (!wizardData.language && userSettings?.language) {
          const mappedLanguage = {
            'en': 'english',
            'es': 'spanish',
            'fr': 'french',
            'la': 'latin'
          }[userSettings.language] || 'english'
          
          updateWizardData({ language: mappedLanguage })
        }
      } catch (error) {
        console.error('Failed to load contexts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContexts()
  }, [])

  const handleLanguageChange = (language: string) => {
    updateWizardData({ language })
  }

  const handleContextSelect = (contextId: string) => {
    const context = contexts.find(c => c.id === contextId)
    if (context) {
      const contextData = parseContextData(context.context)
      if (contextData) {
        updateWizardData({ 
          contextId,
          contextData
        })
      }
    }
  }

  const handleNext = async () => {
    if (!wizardData.language || !wizardData.contextData) return

    setSaving(true)
    try {
      // Update petition with selected language and context
      await updatePetitionLanguage(petition.id, wizardData.language)
      await updatePetitionContext(petition.id, JSON.stringify(wizardData.contextData))
      toast.success('Language and context saved successfully')
      onNext()
    } catch (error) {
      console.error('Failed to save language:', error)
      toast.error('Failed to save language and context')
    } finally {
      setSaving(false)
    }
  }

  const canProceed = wizardData.language && wizardData.contextId

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Language</CardTitle>
          <p className="text-muted-foreground">
            Choose the language in which the petitions should be generated.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            id="language"
            label="Language"
            description="The language in which the petitions should be generated"
            type="select"
            value={wizardData.language}
            onChange={handleLanguageChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="latin">Latin</SelectItem>
            </SelectContent>
          </FormField>
        </CardContent>
      </Card>

      {/* Context Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Context Template</CardTitle>
          <p className="text-muted-foreground">
            Choose a context template that matches your liturgical occasion. You&apos;ll be able to customize it in the next step.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p>Loading contexts...</p>
          ) : contexts.length === 0 ? (
            <p className="text-muted-foreground">No contexts available.</p>
          ) : (
            <div className="grid gap-3">
              {contexts
                .filter(context => {
                  // Filter out contexts with empty titles or invalid context data
                  if (!context.title || context.title.trim() === '') return false
                  const contextData = parseContextData(context.context)
                  return contextData !== null
                })
                .map((context) => {
                  const contextData = parseContextData(context.context)!
                  return (
                    <div
                      key={context.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        wizardData.contextId === context.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleContextSelect(context.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{context.title}</h3>
                        </div>
                        {wizardData.contextId === context.id && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      {context.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {context.description}
                        </p>
                      )}
                      {contextData.community_info && (
                        <p className="text-sm text-gray-600 mt-2">
                          {contextData.community_info}
                        </p>
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!canProceed || saving}
        >
          {saving ? 'Saving...' : 'Next: Customize Context'}
        </Button>
      </div>
    </div>
  )
}