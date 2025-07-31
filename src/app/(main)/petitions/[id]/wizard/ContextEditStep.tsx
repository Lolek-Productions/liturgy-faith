'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { updatePetitionContext } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'
import { ContextData } from '@/lib/petition-context-utils'
import { toast } from 'sonner'

interface TemplateEditStepProps {
  petition: Petition
  wizardData: {
    language: string
    templateId: string
    templateData: Record<string, unknown>
    generatedContent: string
  }
  updateWizardData: (updates: Record<string, unknown>) => void
}

export default function TemplateEditStep({ 
  petition, 
  wizardData, 
  updateWizardData
}: TemplateEditStepProps) {
  const [templateData, setTemplateData] = useState<ContextData>({
    name: 'Custom Template',
    description: '',
    community_info: (wizardData.templateData?.community_info as string) || '',
    sacraments_received: [],
    deaths_this_week: [],
    sick_members: [],
    special_petitions: []
  })
  const [saving, setSaving] = useState(false)

  const updateCommunityInfo = (value: string) => {
    setTemplateData(prev => ({ ...prev, community_info: value }))
  }

  // Auto-save when community info changes
  useEffect(() => {
    const saveData = async () => {
      setSaving(true)
      try {
        await updatePetitionContext(petition.id, JSON.stringify(templateData))
        updateWizardData({ templateData })
      } catch (error) {
        console.error('Failed to save template:', error)
      } finally {
        setSaving(false)
      }
    }

    if (templateData.community_info?.trim()) {
      const debounceTimer = setTimeout(saveData, 1000)
      return () => clearTimeout(debounceTimer)
    }
  }, [templateData, petition.id, updateWizardData])

  return (
    <div className="space-y-6">
      {/* Template Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customize Template Details</CardTitle>
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
              value={templateData.community_info || ''}
              onChange={(e) => updateCommunityInfo(e.target.value)}
              placeholder="Enter all community information that should be included in the petitions..."
              className="min-h-[200px]"
            />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}