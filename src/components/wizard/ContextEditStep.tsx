'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Plus, X, ArrowLeft } from 'lucide-react'
import { updatePetitionContext } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'

interface ContextEditStepProps {
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

export default function ContextEditStep({ 
  petition, 
  wizardData, 
  updateWizardData, 
  onNext,
  onPrevious 
}: ContextEditStepProps) {
  const [contextData, setContextData] = useState(wizardData.contextData || {
    name: 'Custom Context',
    description: '',
    community_info: '',
    sacraments_received: [],
    deaths_this_week: [],
    sick_members: [],
    special_petitions: []
  })
  const [saving, setSaving] = useState(false)

  const updateContextField = (field: string, value: any) => {
    setContextData((prev: any) => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: string) => {
    setContextData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), { name: '', details: '' }]
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setContextData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }))
  }

  const updateArrayItem = (field: string, index: number, key: string, value: string) => {
    setContextData((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) => 
        i === index ? { ...item, [key]: value } : item
      )
    }))
  }

  const handleNext = async () => {
    setSaving(true)
    try {
      // Update petition with context data
      await updatePetitionContext(petition.id, JSON.stringify(contextData))
      updateWizardData({ contextData })
      onNext()
    } catch (error) {
      console.error('Failed to save context:', error)
    } finally {
      setSaving(false)
    }
  }

  const renderArraySection = (title: string, field: string, placeholder: string) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">{title}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem(field)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      
      {contextData[field]?.map((item: any, index: number) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Name"
              value={item.name || ''}
              onChange={(e) => updateArrayItem(field, index, 'name', e.target.value)}
            />
            <Input
              placeholder="Details (optional)"
              value={item.details || ''}
              onChange={(e) => updateArrayItem(field, index, 'details', e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeArrayItem(field, index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      {(!contextData[field] || contextData[field].length === 0) && (
        <p className="text-sm text-muted-foreground">{placeholder}</p>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Context Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customize Context Details</CardTitle>
          <p className="text-muted-foreground">
            Add specific names, details, and information relevant to this liturgical celebration.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Community Information */}
          <div className="space-y-2">
            <Label htmlFor="community_info">Community Information</Label>
            <Textarea
              id="community_info"
              value={contextData.community_info || ''}
              onChange={(e) => updateContextField('community_info', e.target.value)}
              placeholder="General information about the community or occasion..."
              className="min-h-[100px]"
            />
          </div>

          {/* Sacraments Received */}
          {renderArraySection(
            'Sacraments Received',
            'sacraments_received',
            'No sacraments to include. Click "Add" to add baptisms, confirmations, marriages, etc.'
          )}

          {/* Deaths This Week */}
          {renderArraySection(
            'Deaths This Week',
            'deaths_this_week',
            'No deaths to include. Click "Add" to add names of the deceased.'
          )}

          {/* Sick Members */}
          {renderArraySection(
            'Sick Members',
            'sick_members',
            'No sick members to include. Click "Add" to add names of those needing prayers.'
          )}

          {/* Special Petitions */}
          {renderArraySection(
            'Special Petitions',
            'special_petitions',
            'No special petitions. Click "Add" to add specific prayer requests.'
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext} disabled={saving}>
          {saving ? 'Saving...' : 'Next: Generate Petitions'}
        </Button>
      </div>
    </div>
  )
}