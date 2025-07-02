'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react'
import { generatePetitionContent } from '@/lib/actions/petitions'
import { Petition } from '@/lib/types'

interface GenerationStepProps {
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

export default function GenerationStep({ 
  petition, 
  wizardData, 
  updateWizardData, 
  onNext,
  onPrevious 
}: GenerationStepProps) {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(!!wizardData.generatedContent)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const content = await generatePetitionContent({
        title: petition.title,
        date: petition.date,
        language: wizardData.language,
        community_info: wizardData.contextData?.community_info || '',
        contextId: wizardData.contextId
      })
      
      updateWizardData({ generatedContent: content })
      setGenerated(true)
    } catch (error) {
      console.error('Failed to generate petitions:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleRegenerate = () => {
    setGenerated(false)
    updateWizardData({ generatedContent: '' })
  }

  return (
    <div className="space-y-6">
      {/* Generation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Petitions
          </CardTitle>
          <p className="text-muted-foreground">
            Use AI to generate liturgical petitions based on your context and community information.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!generated ? (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Ready to Generate Petitions</h3>
              <p className="text-muted-foreground mb-6">
                We'll create liturgical petitions in {wizardData.language} based on your context "{wizardData.contextData?.name}".
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
              <div className="flex items-center justify-between">
                <div className="text-green-600 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">Petitions Generated Successfully</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRegenerate}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              
              {wizardData.generatedContent && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Generated Petitions Preview:</h4>
                  <div className="text-sm whitespace-pre-wrap font-mono">
                    {wizardData.generatedContent.slice(0, 500)}
                    {wizardData.generatedContent.length > 500 && '...'}
                  </div>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                You can review and edit these petitions in the next step.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Context Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Context Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Language:</span> {wizardData.language}
            </div>
            <div>
              <span className="font-medium">Context:</span> {wizardData.contextData?.name}
            </div>
            {wizardData.contextData?.community_info && (
              <div className="col-span-2">
                <span className="font-medium">Community Info:</span>
                <p className="text-muted-foreground mt-1">
                  {wizardData.contextData.community_info}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!generated}
        >
          Next: Review & Edit
        </Button>
      </div>
    </div>
  )
}