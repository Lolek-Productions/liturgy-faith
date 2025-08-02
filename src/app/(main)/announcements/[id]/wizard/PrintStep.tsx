'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Printer, FileText, CheckCircle } from 'lucide-react'
import { Announcement } from '@/lib/actions/announcements'

interface PrintStepProps {
  announcement: Announcement
  wizardData: {
    templateId: string
    templateContent: string
    content: string
  }
  onPrevious?: () => void
  onComplete?: () => void
}

export default function PrintStep({ 
  announcement, 
  wizardData, 
  onPrevious,
  onComplete 
}: PrintStepProps) {

  const handlePrint = () => {
    window.open(`/print/announcements/${announcement.id}`, '_blank')
  }

  const handleComplete = () => {
    onComplete?.()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Announcement Complete!</h2>
        <p className="text-muted-foreground">
          Your announcement has been created and saved. You can now print it or view the final result.
        </p>
      </div>

      {/* Announcement Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Announcement Summary
          </CardTitle>
          <CardDescription>
            Review your completed announcement details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-sm mb-1">Title</h4>
              <p className="text-sm text-muted-foreground">
                {announcement.title || 'No title set'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Date</h4>
              <p className="text-sm text-muted-foreground">
                {announcement.date 
                  ? new Date(announcement.date).toLocaleDateString()
                  : 'No date set'
                }
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Template Used</h4>
            <Badge variant="secondary">
              {wizardData.templateId === 'custom' ? 'Custom Template' : 'Template'}
            </Badge>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Content</h4>
            <div className="bg-muted p-3 rounded-md text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {wizardData.content || announcement.text}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handlePrint}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Printer className="h-5 w-5" />
              Print Announcement
            </CardTitle>
            <CardDescription>
              Open a print-friendly version of your announcement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Printer className="h-4 w-4 mr-2" />
              Print Now
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleComplete}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5" />
              View Announcement
            </CardTitle>
            <CardDescription>
              Go to the announcement detail page to view or edit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline"
          onClick={onPrevious}
          size="lg"
        >
          Previous Step
        </Button>
        <Button 
          onClick={handleComplete}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          Complete & View Announcement
        </Button>
      </div>
    </div>
  )
}