'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/page-container'
import { FormField } from '@/components/ui/form-field'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/loading'
import { ArrowLeft, Save } from 'lucide-react'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { Announcement, getAnnouncement, updateAnnouncement } from '@/lib/actions/announcements'
import { toast } from 'sonner'

export default function EditAnnouncementPage() {
  const params = useParams()
  const router = useRouter()
  const { setBreadcrumbs } = useBreadcrumbs()
  
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [text, setText] = useState('')
  
  const announcementId = parseInt(params.id as string)

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Announcements", href: "/announcements" },
      { label: "Edit Announcement" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    loadAnnouncement()
  }, [announcementId])

  const loadAnnouncement = async () => {
    if (!announcementId || isNaN(announcementId)) {
      setError('Invalid announcement ID')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const announcementData = await getAnnouncement(announcementId)
      setAnnouncement(announcementData)
      
      // Set form values
      setTitle(announcementData.title || '')
      setDate(announcementData.date || '')
      setText(announcementData.text || '')
    } catch (err) {
      console.error('Failed to load announcement:', err)
      setError('Failed to load announcement')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      toast.error('Please enter announcement content')
      return
    }

    try {
      setSaving(true)
      
      await updateAnnouncement(announcementId, {
        text: text.trim(),
        liturgical_event_id: announcement?.liturgical_event_id || null
      })

      toast.success('Announcement updated successfully!')
      router.push(`/announcements/${announcementId}`)
    } catch (error) {
      console.error('Failed to update announcement:', error)
      toast.error('Failed to update announcement')
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    router.push(`/announcements/${announcementId}`)
  }

  if (loading) {
    return (
      <PageContainer 
        title="Edit Announcement" 
        description="Modify announcement details"
        maxWidth="4xl"
      >
        <Loading centered={false} />
      </PageContainer>
    )
  }

  if (error || !announcement) {
    return (
      <PageContainer 
        title="Edit Announcement" 
        description="Modify announcement details"
        maxWidth="4xl"
      >
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Announcement Not Found</h3>
            <p className="text-muted-foreground mb-4">
              {error || 'The announcement you are trying to edit does not exist.'}
            </p>
            <Button onClick={() => router.push('/announcements')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Announcements
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer 
      title="Edit Announcement" 
      description="Modify announcement details and content"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update the title and date for this announcement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                id="title"
                label="Title"
                description="A descriptive name for this announcement"
                value={title}
                onChange={setTitle}
                placeholder="Enter announcement title"
              />
              <FormField
                id="date"
                label="Date"
                description="The date when this announcement will be published or used"
                inputType="date"
                value={date}
                onChange={setDate}
              />
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Edit the announcement text and content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="text" className="text-sm font-medium">
                  Announcement Text *
                </label>
                <Textarea
                  id="text"
                  placeholder="Enter your announcement content here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={12}
                  className="min-h-48 resize-y"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {text.length} characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {text && (
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
                    {title && (
                      <h3 className="font-semibold text-lg">{title}</h3>
                    )}
                    {date && (
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(date).toLocaleDateString()}
                      </p>
                    )}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed pt-2">
                      {text}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving || !text.trim()}
                  size="lg"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </PageContainer>
  )
}