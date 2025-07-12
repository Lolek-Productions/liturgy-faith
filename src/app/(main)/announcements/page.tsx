import { Suspense } from 'react'
import { AnnouncementsContent } from './announcements-content'

export default function AnnouncementsPage() {
  return (
    <Suspense fallback={<div>Loading announcements...</div>}>
      <AnnouncementsContent />
    </Suspense>
  )
}