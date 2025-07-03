'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getPetitionContexts, PetitionContextTemplate, ensureDefaultContexts, cleanupInvalidContexts, createPetitionContext } from '@/lib/actions/petition-contexts'
import { parseContextData } from '@/lib/petition-context-utils'
import { updatePetitionLanguage, updatePetitionContext } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'
import { useAppContext } from '@/contexts/AppContextProvider'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newContextForm, setNewContextForm] = useState({
    title: '',
    description: '',
    context: ''
  })

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLanguageChange = (language: string) => {
    updateWizardData({ language })
  }

  const handleContextSelect = (contextId: string) => {
    const context = contexts.find(c => c.id === contextId)
    if (context) {
      const contextData = parseContextData(context.context)
      if (contextData) {
        // Legacy JSON format
        updateWizardData({ 
          contextId,
          contextData
        })
      } else {
        // Simple text format - create minimal context data structure
        const simpleContextData = {
          name: context.title,
          description: context.description || '',
          community_info: context.context || '',
          sacraments_received: [],
          deaths_this_week: [],
          sick_members: [],
          special_petitions: []
        }
        updateWizardData({ 
          contextId,
          contextData: simpleContextData
        })
      }
    }
  }

  const handleCreateContext = async () => {
    setCreating(true)
    try {
      // Try to parse as JSON first, otherwise use as plain text
      let contextData
      try {
        contextData = JSON.parse(newContextForm.context)
      } catch {
        // If not JSON, create a default structure with the text as community_info
        contextData = {
          name: newContextForm.title,
          description: newContextForm.description,
          community_info: newContextForm.context,
          sacraments_received: [],
          deaths_this_week: [],
          sick_members: [],
          special_petitions: []
        }
      }

      const newContext = await createPetitionContext({
        title: newContextForm.title,
        description: newContextForm.description,
        context: typeof contextData === 'string' ? newContextForm.context : JSON.stringify(contextData)
      })

      // Refresh contexts list
      const updatedContexts = await getPetitionContexts()
      setContexts(updatedContexts)

      // Auto-select the new context
      updateWizardData({ 
        contextId: newContext.id,
        contextData: contextData as unknown as Record<string, unknown>
      })

      // Reset form and close dialog
      setNewContextForm({
        title: '',
        description: '',
        context: ''
      })
      setDialogOpen(false)
      toast.success('New context created and selected')
    } catch (error) {
      console.error('Failed to create context:', error)
      toast.error('Failed to create new context')
    } finally {
      setCreating(false)
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
            inputType="select"
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Context Template</CardTitle>
              <p className="text-muted-foreground">
                Choose a context template that matches your liturgical occasion. You&apos;ll be able to customize it in the next step.
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Context Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <FormField
                    id="new-title"
                    label="Title"
                    value={newContextForm.title}
                    onChange={(value) => setNewContextForm({ ...newContextForm, title: value })}
                    placeholder="e.g., Easter Vigil, Funeral Mass"
                  />
                  <FormField
                    id="new-description"
                    label="Description"
                    value={newContextForm.description}
                    onChange={(value) => setNewContextForm({ ...newContextForm, description: value })}
                    placeholder="Brief description of when to use this context"
                  />
                  <FormField
                    id="new-context"
                    label="Context Information"
                    inputType="textarea"
                    value={newContextForm.context}
                    onChange={(value) => setNewContextForm({ ...newContextForm, context: value })}
                    placeholder="Describe the liturgical context and community needs for this template. Example: St. Mary's Parish - Sunday Mass with recent baptisms, wedding anniversaries, and prayers for the sick including John Smith recovering from surgery."
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                      disabled={creating}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateContext}
                      disabled={creating || !newContextForm.title}
                    >
                      {creating ? 'Creating...' : 'Create Context'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                  // Filter out contexts with empty titles
                  return context.title && context.title.trim() !== ''
                })
                .map((context) => {
                  // Try to parse as JSON first (legacy format), fallback to simple text
                  const contextData = parseContextData(context.context)
                  const isSimpleText = !contextData
                  
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
                      {isSimpleText ? (
                        context.context && (
                          <p className="text-sm text-gray-600 mt-2 font-mono bg-gray-50 p-2 rounded">
                            {context.context.slice(0, 100)}{context.context.length > 100 ? '...' : ''}
                          </p>
                        )
                      ) : (
                        contextData?.community_info && (
                          <p className="text-sm text-gray-600 mt-2">
                            {contextData.community_info}
                          </p>
                        )
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