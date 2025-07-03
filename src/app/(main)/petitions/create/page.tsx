'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CenteredFormCard } from '@/components/centered-form-card'
import { FormField } from '@/components/ui/form-field'
import { createBasicPetition } from '@/lib/actions/petitions'
import { useRouter } from 'next/navigation'
import { useBreadcrumbs } from '@/components/breadcrumb-context'

export default function CreatePetitionPage() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => {
    // Get the next Sunday
    const today = new Date()
    const daysUntilSunday = (7 - today.getDay()) % 7
    const nextSunday = new Date(today)
    nextSunday.setDate(today.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday))
    return nextSunday.toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Petitions", href: "/petitions" },
      { label: "Create Petition" }
    ])
  }, [setBreadcrumbs])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const petition = await createBasicPetition({ title, date })
      router.push(`/petitions/${petition.id}/wizard`)
    } catch {
      setError('Failed to create petition. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CenteredFormCard 
      title="Create New Petitions" 
      maxWidth="2xl"
    >
      <p className="text-muted-foreground mb-6">
        Start by providing basic information. You&apos;ll configure language and context details in the next step.
      </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="title"
                label="Title"
                description='A descriptive name for this set of petitions (e.g., "Sunday Mass - December 15, 2024")'
                value={title}
                onChange={setTitle}
                placeholder="Enter title for these petitions"
                required
              />
              <FormField
                id="date"
                label="Date"
                description="The date when these petitions will be used during Mass"
                inputType="date"
                value={date}
                onChange={setDate}
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <Button 
              type="submit" 
              disabled={loading || !title.trim() || !date}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Continue to Petition Wizard'}
            </Button>
          </form>
    </CenteredFormCard>
  )
}