'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Announcement, updateAnnouncement } from '@/lib/actions/announcements'
import { toast } from 'sonner'

interface DetailsStepProps {
  announcement: Announcement
  wizardData: {
    templateId: string
    templateContent: string
    content: string
  }
  updateWizardData: (updates: Partial<{
    templateId: string
    templateContent: string
    content: string
  }>) => void
  onNext?: () => void
  onPrevious?: () => void
}

export default function DetailsStep({ 
  announcement, 
  wizardData, 
  updateWizardData, 
  onNext,
  onPrevious 
}: DetailsStepProps) {
  const [content, setContent] = useState(wizardData.content || '')
  const [saving, setSaving] = useState(false)

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    updateWizardData({ content: newContent })
  }

  const handleSaveAndContinue = async () => {
    if (!content.trim()) {
      toast.error('Please enter announcement content')
      return
    }

    try {
      setSaving(true)
      
      // Save the announcement with the updated content
      await updateAnnouncement(announcement.id, {
        text: content.trim(),
        liturgical_event_id: announcement.liturgical_event_id
      })

      toast.success('Announcement saved successfully!')
      onNext?.()
    } catch (error) {
      console.error('Error saving announcement:', error)
      toast.error('Failed to save announcement. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const canContinue = content.trim().length > 0

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Customize Your Announcement</h2>
        <p className="text-muted-foreground">
          Edit and personalize your announcement content below
        </p>
      </div>

      {/* Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Announcement Content</CardTitle>
          <CardDescription>
            Enter your announcement text. You can edit the template or write completely new content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Enter your announcement content here..."
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={10}
              className="min-h-48 resize-y"
            />
            <p className="text-sm text-muted-foreground">
              {content.length} characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {content && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              This is how your announcement will appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md">
              <div className="space-y-2">
                {announcement.title && (
                  <h3 className="font-semibold text-lg">{announcement.title}</h3>
                )}
                {announcement.date && (
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(announcement.date).toLocaleDateString()}
                  </p>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed pt-2">
                  {content}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline"
          onClick={onPrevious}
          size="lg"
        >
          Previous
        </Button>
        <Button 
          onClick={handleSaveAndContinue}
          disabled={!canContinue || saving}
          size="lg"
        >
          {saving ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  )
}