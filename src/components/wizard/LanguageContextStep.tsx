'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Crown } from 'lucide-react'
import { getPetitionContexts, PetitionContextTemplate } from '@/lib/actions/petition-contexts'
import { updatePetitionLanguage } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'
import { useAppContext } from '@/contexts/AppContextProvider'

interface LanguageContextStepProps {
  petition: Petition
  wizardData: {
    language: string
    contextId: string
    contextData: any
    generatedContent: string
  }
  updateWizardData: (updates: any) => void
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
    updateWizardData({ 
      contextId,
      contextData: context ? {
        name: context.name,
        description: context.description,
        community_info: context.community_info,
        sacraments_received: context.sacraments_received,
        deaths_this_week: context.deaths_this_week,
        sick_members: context.sick_members,
        special_petitions: context.special_petitions
      } : null
    })
  }

  const handleNext = async () => {
    if (!wizardData.language) return

    setSaving(true)
    try {
      // Update petition with selected language
      await updatePetitionLanguage(petition.id, wizardData.language)
      onNext()
    } catch (error) {
      console.error('Failed to save language:', error)
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
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={wizardData.language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="latin">Latin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Context Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Context Template</CardTitle>
          <p className="text-muted-foreground">
            Choose a context template that matches your liturgical occasion. You'll be able to customize it in the next step.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p>Loading contexts...</p>
          ) : contexts.length === 0 ? (
            <p className="text-muted-foreground">No contexts available.</p>
          ) : (
            <div className="grid gap-3">
              {contexts.map((context) => (
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
                      <h3 className="font-medium">{context.name}</h3>
                      {context.is_default && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
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
                  {context.community_info && (
                    <p className="text-sm text-gray-600 mt-2">
                      {context.community_info}
                    </p>
                  )}
                </div>
              ))}
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