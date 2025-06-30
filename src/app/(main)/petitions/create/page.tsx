'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X } from 'lucide-react'
import { createPetition } from '@/lib/actions/petitions'
import { useRouter } from 'next/navigation'

export default function CreatePetitionPage() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [language, setLanguage] = useState('english')
  const [sacramentsReceived, setSacramentsReceived] = useState<string[]>([''])
  const [deathsThisWeek, setDeathsThisWeek] = useState<string[]>([''])
  const [sickMembers, setSickMembers] = useState<string[]>([''])
  const [specialPetitions, setSpecialPetitions] = useState<string[]>([''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const addField = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    fields: string[]
  ) => {
    setter([...fields, ''])
  }

  const removeField = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    fields: string[],
    index: number
  ) => {
    setter(fields.filter((_, i) => i !== index))
  }

  const updateField = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    fields: string[],
    index: number,
    value: string
  ) => {
    const updated = [...fields]
    updated[index] = value
    setter(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const petitionData = {
        title,
        date,
        language,
        sacraments_received: sacramentsReceived.filter(s => s.trim() !== ''),
        deaths_this_week: deathsThisWeek.filter(d => d.trim() !== ''),
        sick_members: sickMembers.filter(s => s.trim() !== ''),
        special_petitions: specialPetitions.filter(p => p.trim() !== ''),
      }

      await createPetition(petitionData)
      router.push('/petitions')
    } catch {
      setError('Failed to create petition. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderFieldList = (
    fields: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    label: string,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {fields.map((field, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={field}
            onChange={(e) => updateField(setter, fields, index, e.target.value)}
            placeholder={placeholder}
          />
          {fields.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeField(setter, fields, index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addField(setter, fields)}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label.toLowerCase()}
      </Button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Petition</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Petitions - June 28/29, 2025"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="latin">Latin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {renderFieldList(
              sacramentsReceived,
              setSacramentsReceived,
              'Sacraments Received This Week',
              'Name of person who received sacrament'
            )}

            {renderFieldList(
              deathsThisWeek,
              setDeathsThisWeek,
              'Deaths This Week',
              'Name of deceased person'
            )}

            {renderFieldList(
              sickMembers,
              setSickMembers,
              'Sick Members',
              'Name of sick person'
            )}

            {renderFieldList(
              specialPetitions,
              setSpecialPetitions,
              'Special Petitions',
              'Special prayer request'
            )}

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Petition'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}