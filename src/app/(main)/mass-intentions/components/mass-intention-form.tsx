'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/page-container'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { Church, Save, X, Calendar, User, DollarSign, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { 
  getMassIntentionById,
  createMassIntention,
  updateMassIntention,
  getAvailableLiturgicalEvents,
  getPeople,
  getMinistersByRole,
  type MassIntentionWithDetails 
} from '@/lib/actions/mass-intentions'

interface MassIntentionFormProps {
  intentionId?: string
}

interface Person {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface Minister {
  id: string
  name: string
  role: string
}

interface LiturgicalEvent {
  id: string
  name: string
  event_date: string
  start_time: string
  end_time: string
  available: boolean
}

export function MassIntentionForm({ intentionId }: MassIntentionFormProps) {
  const router = useRouter()
  const { setBreadcrumbs } = useBreadcrumbs()
  const [, setIntention] = useState<MassIntentionWithDetails | null>(null)
  const [people, setPeople] = useState<Person[]>([])
  const [ministers, setMinisters] = useState<Minister[]>([])
  const [liturgicalEvents, setLiturgicalEvents] = useState<LiturgicalEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    mass_offered_for: '',
    donor_id: '',
    offered_by_id: '',
    date_requested: '',
    scheduled_at: '',
    liturgical_event_id: '',
    amount_donated: '',
    note: '',
    status: 'unscheduled'
  })

  const isEditing = Boolean(intentionId)

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Mass Intentions", href: "/mass-intentions" },
      { label: isEditing ? "Edit" : "Create" }
    ])
  }, [setBreadcrumbs, isEditing])

  useEffect(() => {
    loadInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intentionId])

  async function loadInitialData() {
    try {
      setLoading(true)
      
      // Load people and ministers in parallel
      const [peopleResult, ministersResult] = await Promise.all([
        getPeople(),
        getMinistersByRole('priest')
      ])

      setPeople(peopleResult)
      setMinisters(ministersResult)

      // Load liturgical events for next 3 months
      const today = new Date()
      const threeMonthsLater = new Date(today)
      threeMonthsLater.setMonth(today.getMonth() + 3)
      
      const events = await getAvailableLiturgicalEvents(
        today.toISOString().split('T')[0],
        threeMonthsLater.toISOString().split('T')[0]
      )
      setLiturgicalEvents(events)

      // If editing, load the intention data
      if (intentionId) {
        const intentionData = await getMassIntentionById(intentionId)
        if (intentionData) {
          setIntention(intentionData)
          setFormData({
            mass_offered_for: intentionData.mass_offered_for || '',
            donor_id: intentionData.donor_id || '',
            offered_by_id: intentionData.offered_by_id || '',
            date_requested: intentionData.date_requested || '',
            scheduled_at: intentionData.scheduled_at || '',
            liturgical_event_id: intentionData.liturgical_event_id || '',
            amount_donated: intentionData.amount_donated ? (intentionData.amount_donated / 100).toString() : '',
            note: intentionData.note || '',
            status: intentionData.status || 'unscheduled'
          })
        }
      } else {
        // Set default date_requested to today for new intentions
        setFormData(prev => ({
          ...prev,
          date_requested: new Date().toISOString().split('T')[0]
        }))
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Failed to load form data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-update status based on liturgical event selection
    if (field === 'liturgical_event_id') {
      if (value) {
        setFormData(prev => ({ ...prev, status: 'scheduled' }))
      } else {
        setFormData(prev => ({ ...prev, status: 'unscheduled' }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.mass_offered_for.trim()) {
      toast.error('Please enter what the Mass is offered for')
      return
    }

    try {
      setSaving(true)
      
      const submitData = new FormData()
      submitData.append('mass_offered_for', formData.mass_offered_for)
      submitData.append('donor_id', formData.donor_id)
      submitData.append('offered_by_id', formData.offered_by_id)
      submitData.append('date_requested', formData.date_requested)
      submitData.append('scheduled_at', formData.scheduled_at)
      submitData.append('liturgical_event_id', formData.liturgical_event_id)
      submitData.append('amount_donated', formData.amount_donated ? (parseFloat(formData.amount_donated) * 100).toString() : '0')
      submitData.append('note', formData.note)
      submitData.append('status', formData.status)
      
      if (isEditing && intentionId) {
        submitData.append('id', intentionId)
        await updateMassIntention(submitData)
        toast.success('Mass intention updated successfully')
      } else {
        await createMassIntention(submitData)
        toast.success('Mass intention created successfully')
      }
      
      // The server actions will handle the redirect
    } catch (error) {
      console.error('Error saving Mass intention:', error)
      toast.error('Failed to save Mass intention')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/mass-intentions')
  }

  const getEventDisplayName = (event: LiturgicalEvent) => {
    const date = new Date(event.event_date).toLocaleDateString()
    const time = new Date(`2000-01-01T${event.start_time}`).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit' 
    })
    return `${event.name} - ${date} at ${time}`
  }

  const getPersonDisplayName = (person: Person) => {
    return `${person.first_name} ${person.last_name}`.trim()
  }

  if (loading) {
    return (
      <PageContainer
        title={isEditing ? "Edit Mass Intention" : "Create Mass Intention"}
        description={isEditing ? "Update Mass intention details" : "Add a new Mass intention"}
        maxWidth="2xl"
      >
        <div className="space-y-6">Loading form...</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={isEditing ? "Edit Mass Intention" : "Create Mass Intention"}
      description={isEditing ? "Update Mass intention details" : "Add a new Mass intention"}
      maxWidth="2xl"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="h-5 w-5" />
            {isEditing ? "Edit Mass Intention" : "New Mass Intention"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mass Offered For */}
            <div className="space-y-2">
              <Label htmlFor="mass_offered_for" className="text-sm font-medium">
                Mass Offered For *
              </Label>
              <Textarea
                id="mass_offered_for"
                placeholder="e.g., In memory of John Smith, For the health of Mary Johnson..."
                value={formData.mass_offered_for}
                onChange={(e) => handleInputChange('mass_offered_for', e.target.value)}
                rows={3}
                required
              />
            </div>

            {/* Donor */}
            <div className="space-y-2">
              <Label htmlFor="donor_id" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Donor/Requestor
              </Label>
              <Select value={formData.donor_id} onValueChange={(value) => handleInputChange('donor_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select donor (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {getPersonDisplayName(person)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Requested */}
            <div className="space-y-2">
              <Label htmlFor="date_requested" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Requested
              </Label>
              <Input
                id="date_requested"
                type="date"
                value={formData.date_requested}
                onChange={(e) => handleInputChange('date_requested', e.target.value)}
              />
            </div>

            {/* Liturgical Event */}
            <div className="space-y-2">
              <Label htmlFor="liturgical_event_id" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Scheduled Mass
              </Label>
              <Select value={formData.liturgical_event_id} onValueChange={(value) => handleInputChange('liturgical_event_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mass time (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {liturgicalEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id} disabled={!event.available}>
                      <div className="flex items-center gap-2">
                        {getEventDisplayName(event)}
                        {!event.available && (
                          <Badge variant="destructive" className="text-xs">
                            Taken
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Celebrant */}
            <div className="space-y-2">
              <Label htmlFor="offered_by_id" className="text-sm font-medium">
                Celebrant
              </Label>
              <Select value={formData.offered_by_id} onValueChange={(value) => handleInputChange('offered_by_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select celebrant (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {ministers.map((minister) => (
                    <SelectItem key={minister.id} value={minister.id}>
                      {minister.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount Donated */}
            <div className="space-y-2">
              <Label htmlFor="amount_donated" className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Offering Amount
              </Label>
              <Input
                id="amount_donated"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount_donated}
                onChange={(e) => handleInputChange('amount_donated', e.target.value)}
              />
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium">
                Additional Notes
              </Label>
              <Textarea
                id="note"
                placeholder="Any additional notes or special instructions..."
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                rows={2}
              />
            </div>

            {/* Status (read-only display) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex items-center gap-2">
                {formData.status === 'scheduled' && (
                  <Badge className="bg-green-500">Scheduled</Badge>
                )}
                {formData.status === 'unscheduled' && (
                  <Badge variant="secondary">Unscheduled</Badge>
                )}
                {formData.status === 'conflicted' && (
                  <Badge variant="destructive">Conflicted</Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  )
}