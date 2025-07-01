'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getPetitionWithContext, updatePetition } from '@/lib/actions/petitions'
import { useBreadcrumbs } from '@/components/breadcrumb-context'

interface EditPetitionPageProps {
  params: Promise<{ id: string }>
}

export default function EditPetitionPage({ params }: EditPetitionPageProps) {
  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [language, setLanguage] = useState('english')
  const [communityInfo, setCommunityInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    const loadPetition = async () => {
      try {
        const resolvedParams = await params
        setId(resolvedParams.id)
        
        const result = await getPetitionWithContext(resolvedParams.id)
        if (result) {
          const { petition, context } = result
          setTitle(petition.title)
          setDate(petition.date)
          setLanguage(petition.language)
          setCommunityInfo(context.community_info)
          
          // Set breadcrumbs with petition title
          setBreadcrumbs([
            { label: "Dashboard", href: "/dashboard" },
            { label: "Petitions", href: "/petitions" },
            { label: petition.title, href: `/petitions/${resolvedParams.id}` },
            { label: "Edit" }
          ])
        }
      } catch {
        setError('Failed to load petition')
      } finally {
        setLoadingData(false)
      }
    }

    loadPetition()
  }, [params, setBreadcrumbs])

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

      await updatePetition(id, petitionData)
      router.push(`/petitions/${id}`)
    } catch {
      setError('Failed to update petition. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/petitions/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Petition
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Petitions</CardTitle>
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
                  placeholder="Enter title for these petitions"
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

            <div className="space-y-3">
              <Label htmlFor="communityInfo">Community Information</Label>
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
                  Include any relevant details. This information will be used to regenerate appropriate liturgical petitions.
                </p>
              </div>
              <Textarea
                id="communityInfo"
                value={communityInfo}
                onChange={(e) => setCommunityInfo(e.target.value)}
                placeholder="Enter your community information here..."
                rows={8}
                className="resize-none"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Petitions'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}