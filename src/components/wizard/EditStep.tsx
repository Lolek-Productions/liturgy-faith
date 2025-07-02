'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { updatePetitionContent } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'

interface EditStepProps {
  petition: Petition
  wizardData: {
    language: string
    contextId: string
    contextData: any
    generatedContent: string
  }
  updateWizardData: (updates: any) => void
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

  useEffect(() => {
    setHasChanges(content !== wizardData.generatedContent)
  }, [content, wizardData.generatedContent])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePetitionContent(petition.id, content)
      updateWizardData({ generatedContent: content })
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to save content:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    if (hasChanges) {
      await handleSave()
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Edit Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Review & Edit Petitions</span>
            {hasChanges && (
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
          </CardTitle>
          <p className="text-muted-foreground">
            Review the generated petitions and make any necessary edits. Changes are automatically saved.
          </p>
        </CardHeader>
        <CardContent>
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
                <li>• Start with "For..." or "That..."</li>
                <li>• End with "...we pray to the Lord"</li>
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
        <Button onClick={handleNext} disabled={saving}>
          {saving ? 'Saving...' : 'Next: Print & Complete'}
        </Button>
      </div>
    </div>
  )
}