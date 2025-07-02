'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField } from '@/components/ui/form-field'
import { createPetition, getSavedContexts } from '@/lib/actions/petitions'
import { useRouter } from 'next/navigation'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { useAppContext } from '@/contexts/AppContextProvider'

export default function CreatePetitionPage() {
  const { userSettings } = useAppContext()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => {
    // Get the next Sunday
    const today = new Date()
    const daysUntilSunday = (7 - today.getDay()) % 7
    const nextSunday = new Date(today)
    nextSunday.setDate(today.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday))
    return nextSunday.toISOString().split('T')[0]
  })
  
  // Use user's preferred language from settings, fallback to 'english'
  const [language, setLanguage] = useState(() => {
    if (userSettings?.language) {
      switch (userSettings.language) {
        case 'en': return 'english'
        case 'es': return 'spanish'
        case 'fr': return 'french'
        case 'la': return 'latin'
        default: return 'english'
      }
    }
    return 'english'
  })
  const [communityInfo, setCommunityInfo] = useState('')
  const [selectedContext, setSelectedContext] = useState('')
  const [savedContexts, setSavedContexts] = useState<Array<{id: string, name: string, community_info: string}>>([])
  const [loading, setLoading] = useState(false)
  const [loadingContexts, setLoadingContexts] = useState(true)
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

  useEffect(() => {
    const loadSavedContexts = async () => {
      try {
        const contexts = await getSavedContexts()
        setSavedContexts(contexts)
      } catch (err) {
        console.error('Failed to load saved contexts:', err)
      } finally {
        setLoadingContexts(false)
      }
    }

    loadSavedContexts()
  }, [])

  const handleContextSelect = (contextId: string) => {
    setSelectedContext(contextId)
    if (contextId === 'new') {
      setCommunityInfo('')
    } else {
      const context = savedContexts.find(c => c.id === contextId)
      if (context) {
        setCommunityInfo(context.community_info)
      }
    }
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
        community_info: communityInfo.trim(),
      }

      const petition = await createPetition(petitionData)
      router.push(`/petitions/${petition.id}`)
    } catch {
      setError('Failed to create petition. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Petitions</CardTitle>
        </CardHeader>
        <CardContent>
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

            <FormField
              id="language"
              label="Language"
              description="The language in which the petitions should be generated"
              type="select"
              value={language}
              onChange={setLanguage}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="latin">Latin</SelectItem>
              </SelectContent>
            </FormField>

            <div className="space-y-3">
              <Label htmlFor="contextSelect" className="text-lg">Community Information</Label>
              <p className="text-xs text-muted-foreground">Information about your community this week that will be used to generate specific petitions</p>
              
              {!loadingContexts && savedContexts.length > 0 && (
                <div>
                  <Label htmlFor="contextSelect" className="text-lg">Use Previous Context</Label>
                  <p className="text-xs text-muted-foreground mb-1">Optionally select a previously saved community context to reuse</p>
                  <Select value={selectedContext} onValueChange={handleContextSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a previous context or create new" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Create New Context</SelectItem>
                      {savedContexts.map((context) => (
                        <SelectItem key={context.id} value={context.id}>
                          {context.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="bg-muted p-4 rounded-md text-sm">
                <p className="font-medium mb-2">Please provide information about your community this week:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Who died this week? (include names if appropriate)</li>
                  <li>• Who received sacraments this week? (baptisms, confirmations, marriages, etc.)</li>
                  <li>• Who is sick and needs prayers?</li>
                  <li>• Any special petitions or prayer requests?</li>
                  <li>• Other community needs or celebrations?</li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  Include any relevant details. This information will be used to generate appropriate liturgical petitions.
                </p>
              </div>
              <FormField
                id="communityInfo"
                label=""
                type="textarea"
                value={communityInfo}
                onChange={setCommunityInfo}
                placeholder="Enter your community information here..."
                rows={12}
                resize={true}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Petitions'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}