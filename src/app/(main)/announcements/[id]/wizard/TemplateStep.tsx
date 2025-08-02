'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FileText, Sparkles } from 'lucide-react'
import { Announcement, AnnouncementTemplate, getAnnouncementTemplates } from '@/lib/actions/announcements'
import { getCurrentParish } from '@/lib/auth/parish'
import { toast } from 'sonner'

interface TemplateStepProps {
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
}

export default function TemplateStep({ 
  announcement, 
  wizardData, 
  updateWizardData, 
  onNext 
}: TemplateStepProps) {
  const [templates, setTemplates] = useState<AnnouncementTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [customTemplate, setCustomTemplate] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>(wizardData.templateId || '')

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const parish = await getCurrentParish()
      if (parish) {
        const result = await getAnnouncementTemplates(parish.id)
        setTemplates(result.templates || [])
      }
    } catch (error) {
      console.error('Error loading templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = (template: AnnouncementTemplate) => {
    setSelectedTemplate(template.id.toString())
    updateWizardData({
      templateId: template.id.toString(),
      templateContent: template.text,
      content: template.text // Initialize content with template text
    })
  }

  const handleCustomTemplate = () => {
    setSelectedTemplate('custom')
    updateWizardData({
      templateId: 'custom',
      templateContent: customTemplate,
      content: customTemplate
    })
  }

  const handleContinue = () => {
    if (selectedTemplate === 'custom' && !customTemplate.trim()) {
      toast.error('Please enter custom template content')
      return
    }
    if (!selectedTemplate) {
      toast.error('Please select a template or create a custom one')
      return
    }
    onNext?.()
  }

  const canContinue = selectedTemplate && (selectedTemplate !== 'custom' || customTemplate.trim())

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Choose Announcement Template</h2>
        <p className="text-muted-foreground">
          Select from existing templates or create a custom announcement
        </p>
      </div>

      {/* Existing Templates */}
      {templates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Templates</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-colors hover:shadow-md ${
                  selectedTemplate === template.id.toString() 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : ''
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-medium line-clamp-2">
                      {template.title}
                    </CardTitle>
                    <Badge variant="secondary" className="ml-2">
                      <FileText className="h-3 w-3 mr-1" />
                      Template
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {template.text}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(template.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Custom Template Option */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Create Custom Announcement</h3>
        <Card 
          className={`cursor-pointer transition-colors hover:shadow-md ${
            selectedTemplate === 'custom' 
              ? 'ring-2 ring-primary bg-primary/5' 
              : ''
          }`}
          onClick={() => setSelectedTemplate('custom')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Custom Template
            </CardTitle>
            <CardDescription>
              Write your own announcement content from scratch
            </CardDescription>
          </CardHeader>
          {selectedTemplate === 'custom' && (
            <CardContent>
              <Textarea
                placeholder="Enter your announcement content here..."
                value={customTemplate}
                onChange={(e) => setCustomTemplate(e.target.value)}
                rows={6}
                className="min-h-32"
              />
            </CardContent>
          )}
        </Card>
      </div>

      {/* Selected Template Preview */}
      {selectedTemplate && selectedTemplate !== 'custom' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Selected Template Preview</h3>
          <Card>
            <CardContent className="p-4">
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md">
                {wizardData.templateContent}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
        >
          Continue to Details
        </Button>
      </div>
    </div>
  )
}