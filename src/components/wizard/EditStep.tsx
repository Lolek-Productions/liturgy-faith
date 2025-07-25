'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Sparkles, RefreshCw } from 'lucide-react'
import { updatePetitionContent, generatePetitionContent } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'
import { toast } from 'sonner'

interface EditStepProps {
  petition: Petition
  wizardData: {
    language: string
    contextId: string
    contextData: Record<string, unknown>
    generatedContent: string
  }
  updateWizardData: (updates: Record<string, unknown>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function EditStep({ 
  petition, 
  wizardData, 
  updateWizardData, 
  onNext,
  onPrevious 
}: EditStepProps) {
  const [content, setContent] = useState(wizardData.generatedContent || '')
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(!!wizardData.generatedContent)

  useEffect(() => {
    setContent(wizardData.generatedContent || '')
    setHasGenerated(!!wizardData.generatedContent)
  }, [wizardData.generatedContent])

  useEffect(() => {
    setHasChanges(content !== wizardData.generatedContent)
  }, [content, wizardData.generatedContent])

  // Auto-save with debouncing
  useEffect(() => {
    if (hasChanges && !saving && content.trim() !== '') {
      const timer = setTimeout(async () => {
        if (hasChanges) { // Check again in case it changed
          setSaving(true)
          try {
            await updatePetitionContent(petition.id, content)
            updateWizardData({ generatedContent: content })
            setHasChanges(false)
            toast.success('Petition changes saved automatically')
          } catch (error) {
            console.error('Failed to auto-save content:', error)
            toast.error('Failed to auto-save petition changes')
          } finally {
            setSaving(false)
          }
        }
      }, 2000) // Auto-save after 2 seconds of no changes
      
      return () => clearTimeout(timer)
    }
  }, [content, hasChanges, saving, petition.id, updateWizardData])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      toast.loading('Generating petitions...')
      const generatedContent = await generatePetitionContent({
        title: petition.title,
        date: petition.date,
        language: wizardData.language,
        community_info: (wizardData.contextData?.community_info as string) || '',
        contextId: wizardData.contextId
      })
      
      // Save generated content to database
      await updatePetitionContent(petition.id, generatedContent)
      
      updateWizardData({ generatedContent })
      setContent(generatedContent)
      setHasGenerated(true)
      toast.success('Petitions generated and saved successfully')
    } catch (error) {
      console.error('Failed to generate petitions:', error)
      toast.error('Failed to generate petitions')
    } finally {
      setGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    await handleGenerate()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePetitionContent(petition.id, content)
      updateWizardData({ generatedContent: content })
      setHasChanges(false)
      toast.success('Petition changes saved successfully')
    } catch (error) {
      console.error('Failed to save content:', error)
      toast.error('Failed to save petition changes')
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    if (hasChanges) {
      await handleSave()
    } else {
      toast.success('Petition review completed')
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Generation/Edit Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>Edit & Review Petitions</span>
            </div>
            <div className="flex gap-2">
              {hasGenerated && hasChanges && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
              {hasGenerated && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={generating}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              )}
            </div>
          </CardTitle>
          <p className="text-muted-foreground">
            {!hasGenerated 
              ? 'Generate AI-powered liturgical petitions based on your context and community information.'
              : 'Review the generated petitions and make any necessary edits. Changes are automatically saved.'
            }
          </p>
        </CardHeader>
        <CardContent>
          {!hasGenerated ? (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Ready to Generate Petitions</h3>
              <p className="text-muted-foreground mb-6">
                We&apos;ll create liturgical petitions in {wizardData.language} based on your context &quot;{(wizardData.contextData?.name as string) || 'Unknown'}&quot;.
              </p>
              <Button 
                onClick={handleGenerate} 
                disabled={generating}
                size="lg"
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Petitions
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your petition content will appear here..."
                className="min-h-[400px] font-mono text-sm"
              />
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{content.length} characters</span>
                {hasChanges && (
                  <span className="text-orange-600">Unsaved changes</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formatting Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Formatting Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Structure</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Each petition on a separate line</li>
                <li>• Start with &quot;For...&quot; or &quot;That...&quot;</li>
                <li>• End with &quot;...we pray to the Lord&quot;</li>
                <li>• Use appropriate liturgical language</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Content</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Include universal Church petitions</li>
                <li>• Add local community needs</li>
                <li>• Remember the deceased</li>
                <li>• Pray for the sick and suffering</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!hasGenerated || saving}>
          {saving ? 'Saving...' : 'Next: Print & Complete'}
        </Button>
      </div>
    </div>
  )
}