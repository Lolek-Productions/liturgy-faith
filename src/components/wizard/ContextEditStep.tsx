'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { updatePetitionContext } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'
import { ContextData } from '@/lib/petition-context-utils'
import { toast } from 'sonner'

interface ContextEditStepProps {
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

export default function ContextEditStep({ 
  petition, 
  wizardData, 
  updateWizardData, 
  onNext,
  onPrevious 
}: ContextEditStepProps) {
  const [contextData, setContextData] = useState<ContextData>({
    name: 'Custom Context',
    description: '',
    community_info: (wizardData.contextData?.community_info as string) || '',
    sacraments_received: [],
    deaths_this_week: [],
    sick_members: [],
    special_petitions: []
  })
  const [saving, setSaving] = useState(false)

  const updateCommunityInfo = (value: string) => {
    setContextData(prev => ({ ...prev, community_info: value }))
  }

  const handleNext = async () => {
    setSaving(true)
    try {
      // Update petition with context data
      await updatePetitionContext(petition.id, JSON.stringify(contextData))
      updateWizardData({ contextData })
      toast.success('Context details saved successfully')
      onNext()
    } catch (error) {
      console.error('Failed to save context:', error)
      toast.error('Failed to save context details')
    } finally {
      setSaving(false)
    }
  }

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
          <div className="space-y-3">
            <Label htmlFor="community_info">Community Information</Label>
            <p className="text-sm text-muted-foreground">
              Include all relevant information about your community and this liturgical celebration. This information will be used by AI to generate appropriate petitions.
            </p>
            
            {/* Helper guidance */}
            <div className="bg-muted p-4 rounded-md text-sm">
              <p className="font-medium mb-2">Please include information about:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Sacraments received:</strong> Baptisms, confirmations, marriages, ordinations, etc.</li>
                <li>• <strong>Deaths this week:</strong> Names of the deceased who need prayers</li>
                <li>• <strong>Sick members:</strong> Those in need of healing prayers</li>
                <li>• <strong>Special petitions:</strong> Specific prayer requests or community needs</li>
                <li>• <strong>Celebrations:</strong> Anniversaries, milestones, or special events</li>
                <li>• <strong>Community concerns:</strong> Local, national, or global issues needing prayer</li>
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                Example: &quot;This week we celebrate the marriage of John and Mary Smith. We pray for the deceased: Robert Johnson and Maria Garcia. For healing: Father Thomas (surgery recovery), the Wilson family during illness. Special petition for peace in our community and successful fundraising for the parish building project.&quot;
              </p>
            </div>
            
            <Textarea
              id="community_info"
              value={contextData.community_info || ''}
              onChange={(e) => updateCommunityInfo(e.target.value)}
              placeholder="Enter all community information that should be included in the petitions..."
              className="min-h-[200px]"
            />
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
          {saving ? 'Saving...' : 'Next: Edit & Review'}
        </Button>
      </div>
    </div>
  )
}