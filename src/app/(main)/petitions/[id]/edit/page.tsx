'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { PageContainer } from '@/components/page-container'
import { Loading } from '@/components/loading'
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
      <PageContainer 
        title="Edit Petition"
        description="Loading petition information..."
        maxWidth="2xl"
      >
        <Loading />
      </PageContainer>
    )
  }

  return (
    <PageContainer 
      title="Edit Petition"
      description="Modify petition details and content"
      maxWidth="2xl"
    >
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
              <FormField
                id="title"
                label="Title"
                description="A descriptive name for this set of petitions"
                value={title}
                onChange={setTitle}
                placeholder="Enter title for these petitions"
                required
              />
              <FormField
                id="date"
                label="Date"
                description="The date when these petitions will be used"
                inputType="date"
                value={date}
                onChange={setDate}
                required
              />
            </div>

            <FormField
              id="language"
              label="Language"
              description="Select the language for the petitions"
              inputType="select"
              value={language}
              onChange={setLanguage}
              options={[
                { value: 'english', label: 'English' },
                { value: 'spanish', label: 'Spanish' },
                { value: 'french', label: 'French' },
                { value: 'latin', label: 'Latin' }
              ]}
            />

            <div className="space-y-3">
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
              <FormField
                id="communityInfo"
                label="Community Information"
                description="Enter your community information below"
                inputType="textarea"
                value={communityInfo}
                onChange={setCommunityInfo}
                placeholder="Enter your community information here..."
                rows={8}
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
    </PageContainer>
  )
}