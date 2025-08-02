'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { getAnnouncement } from '@/lib/actions/announcements'
import { Announcement } from '@/lib/actions/announcements'
import { Wizard, type WizardStep } from '@/components/wizard'

// Import wizard steps
import TemplateStep from './TemplateStep'
import DetailsStep from './DetailsStep'
import PrintStep from './PrintStep'

const STEPS: WizardStep[] = [
  { id: 1, title: 'Template Selection', description: 'Choose from available announcement templates' },
  { id: 2, title: 'Content Details', description: 'Enter and customize your announcement content' },
  { id: 3, title: 'Print & Complete', description: 'Review, print and complete your announcement' }
]

export default function AnnouncementWizardPage() {
  const params = useParams()
  const router = useRouter()
  const { setBreadcrumbs } = useBreadcrumbs()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Get the ID directly from params
  const announcementId = parseInt(params.id as string)

  // Wizard state
  const [wizardData, setWizardData] = useState({
    templateId: '',
    templateContent: '',
    content: '',
  })

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Announcements", href: "/announcements" },
      { label: "Announcement Wizard" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    let mounted = true
    
    const loadAnnouncement = async () => {
      try {
        if (!announcementId || isNaN(announcementId)) {
          if (mounted) {
            setError('No announcement ID provided')
            setLoading(false)
          }
          return
        }
        
        if (mounted) {
          setLoading(true)
          setError('')
        }
        
        const announcementData = await getAnnouncement(announcementId)
        
        if (announcementData && mounted) {
          setAnnouncement(announcementData)
          // Initialize wizard data from existing announcement
          setWizardData(prev => ({
            ...prev,
            content: announcementData.text || '',
          }))
        } else if (mounted) {
          setError('Announcement not found')
        }
      } catch (err) {
        console.error('Failed to load announcement:', err)
        if (mounted) {
          setError('Failed to load announcement')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Load announcement data on mount
    loadAnnouncement()

    return () => {
      mounted = false
    }
  }, [announcementId]) // Re-run when announcementId changes


  const updateWizardData = (updates: Partial<typeof wizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }))
  }

  const handleComplete = () => {
    router.push(`/announcements/${announcement?.id}`)
  }

  const renderStepContent = (currentStep: number) => {
    if (!announcement) return null

    switch (currentStep) {
      case 1:
        return (
          <TemplateStep
            announcement={announcement}
            wizardData={wizardData}
            updateWizardData={updateWizardData}
          />
        )
      case 2:
        return (
          <DetailsStep
            announcement={announcement}
            wizardData={wizardData}
            updateWizardData={updateWizardData}
          />
        )
      case 3:
        return (
          <PrintStep
            announcement={announcement}
            wizardData={wizardData}
          />
        )
      default:
        return null
    }
  }

  return (
    <Wizard
      title={announcement ? `Announcement Wizard: ${announcement.title}` : "Announcement Wizard"}
      description="Follow the steps below to configure and create your announcement"
      steps={STEPS}
      maxWidth="4xl"
      loading={loading}
      error={error || (!announcement ? 'Announcement not found' : null)}
      loadingMessage="Loading announcement wizard..."
      onComplete={handleComplete}
      completeButtonText="Complete & View Announcement"
      showStepPreview={true}
      allowPreviousNavigation={true}
      renderStepContent={renderStepContent}
    />
  )
}