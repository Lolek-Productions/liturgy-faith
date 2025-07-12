import { Suspense } from 'react'
import { AnnouncementsContent } from './announcements-content'
import { PageContainer } from '@/components/page-container'

export default function AnnouncementsPage() {
  return (
    <Suspense fallback={
      <PageContainer
        title="Announcements"
        description="Manage parish announcements and templates"
        maxWidth="6xl"
      >
        <div className="space-y-6">Loading announcements...</div>
      </PageContainer>
    }>
      <AnnouncementsContent />
    </Suspense>
  )
}