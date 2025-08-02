'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/page-container'
import { Loading } from '@/components/loading'
import { 
  Edit, 
  Printer, 
  ArrowLeft, 
  Calendar,
  Megaphone,
  Copy,
  Trash2
} from 'lucide-react'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { Announcement, getAnnouncement, deleteAnnouncement, duplicateAnnouncement } from '@/lib/actions/announcements'
import { toast } from 'sonner'
import { DeleteRowDialog } from '@/components/delete-row-dialog'

export default function AnnouncementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { setBreadcrumbs } = useBreadcrumbs()
  
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const announcementId = parseInt(params.id as string)

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Announcements", href: "/announcements" },
      { label: "Announcement Details" }
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
    } catch (err) {
      console.error('Failed to load announcement:', err)
      setError('Failed to load announcement')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/announcements/${announcementId}/edit`)
  }

  const handlePrint = () => {
    window.open(`/print/announcements/${announcementId}`, '_blank')
  }

  const handleDuplicate = async () => {
    if (!announcement) return
    
    try {
      const duplicatedAnnouncement = await duplicateAnnouncement(announcement.id)
      toast.success('Announcement duplicated successfully!')
      router.push(`/announcements/${duplicatedAnnouncement.id}/edit`)
    } catch (error) {
      console.error('Failed to duplicate announcement:', error)
      toast.error('Failed to duplicate announcement')
    }
  }

  const handleDelete = async () => {
    if (!announcement) return
    
    try {
      await deleteAnnouncement(announcement.id)
      toast.success('Announcement deleted successfully')
      router.push('/announcements')
    } catch (error) {
      console.error('Failed to delete announcement:', error)
      toast.error('Failed to delete announcement')
      throw error
    }
  }

  const handleBack = () => {
    router.push('/announcements')
  }

  if (loading) {
    return (
      <PageContainer 
        title="Announcement Details" 
        description="View announcement information"
        maxWidth="4xl"
      >
        <Loading centered={false} />
      </PageContainer>
    )
  }

  if (error || !announcement) {
    return (
      <PageContainer 
        title="Announcement Details" 
        description="View announcement information"
        maxWidth="4xl"
      >
        <Card>
          <CardContent className="text-center py-12">
            <Megaphone className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Announcement Not Found</h3>
            <p className="text-muted-foreground mb-4">
              {error || 'The announcement you are looking for does not exist.'}
            </p>
            <Button onClick={handleBack}>
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
      title={announcement.title ? `Announcement: ${announcement.title}` : "Announcement Details"} 
      description="View and manage announcement"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDuplicate} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button 
            onClick={() => setDeleteDialogOpen(true)} 
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        {/* Announcement Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Announcement Details
                </CardTitle>
                {announcement.title && (
                  <h2 className="text-2xl font-semibold text-foreground">
                    {announcement.title}
                  </h2>
                )}
              </div>
              <Badge variant="secondary">
                <Megaphone className="h-3 w-3 mr-1" />
                Announcement
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-sm mb-1 text-muted-foreground">Date</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {announcement.date 
                      ? new Date(announcement.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'No date set'
                    }
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 text-muted-foreground">Created</h4>
                <span className="text-sm">
                  {new Date(announcement.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Content */}
            <div>
              <h4 className="font-medium text-sm mb-3 text-muted-foreground">Content</h4>
              <div className="bg-muted p-4 rounded-md">
                {announcement.text ? (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {announcement.text}
                  </div>
                ) : (
                  <div className="italic text-muted-foreground text-sm">
                    No content available
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteRowDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Announcement"
        itemName={announcement.title || announcement.text?.substring(0, 50) + '...'}
      />
    </PageContainer>
  )
}