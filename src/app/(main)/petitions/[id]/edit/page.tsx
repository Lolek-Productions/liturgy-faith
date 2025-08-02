'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { PageContainer } from '@/components/page-container'
import { Loading } from '@/components/loading'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, RefreshCw, Sparkles, Printer } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getPetitionWithContext, updatePetitionFullDetails, regeneratePetitionContent } from '@/lib/actions/petitions'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { toast } from 'sonner'

interface EditPetitionPageProps {
  params: Promise<{ id: string }>
}

export default function EditPetitionPage({ params }: EditPetitionPageProps) {
  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [language, setLanguage] = useState('english')
  const [petitionText, setPetitionText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [showRegenerateModal, setShowRegenerateModal] = useState(false)
  const [details, setDetails] = useState('')
  const [regenerating, setRegenerating] = useState(false)
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
          setPetitionText(petition.text || petition.generated_content || '')
          setDetails(petition.details || '') // Load existing details
          
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
        text: petitionText.trim(),
      }

      await updatePetitionFullDetails(id, petitionData)
      toast.success('Petition updated successfully!')
      setError('')
    } catch {
      setError('Failed to update petition. Please try again.')
      toast.error('Failed to update petition')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {

    setRegenerating(true)
    try {
      const regenerationData = {
        title,
        date,
        language,
        details: details.trim()
      }

      console.log('[DEBUG EditPage] Regenerating petition with data:', regenerationData)
      const updatedPetition = await regeneratePetitionContent(id, regenerationData)
      setPetitionText(updatedPetition.text || updatedPetition.generated_content || '')
      setShowRegenerateModal(false)
      setDetails('')
      toast.success('Petition content regenerated successfully!')
    } catch (error) {
      console.error('Failed to regenerate petition:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to regenerate petition content: ${errorMessage}`)
    } finally {
      setRegenerating(false)
    }
  }

  const handlePrint = () => {
    if (id) {
      const printUrl = `/print/petitions/${id}`
      window.open(printUrl, '_blank')
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
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Petition Content</label>
                  <p className="text-xs text-muted-foreground">Edit the petition content directly</p>
                </div>
                <Dialog open={showRegenerateModal} onOpenChange={setShowRegenerateModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Regenerate Petition Content</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <FormField
                        id="details"
                        label="Details (Optional)"
                        description="Additional context about your community this week"
                        inputType="textarea"
                        value={details}
                        onChange={setDetails}
                        placeholder="Enter details..."
                        rows={4}
                      />

                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setShowRegenerateModal(false)}
                          disabled={regenerating}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleRegenerate}
                          disabled={regenerating}
                        >
                          {regenerating ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Regenerate
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <textarea
                id="petitionText"
                value={petitionText}
                onChange={(e) => setPetitionText(e.target.value)}
                placeholder="Enter your petition content here..."
                rows={12}
                className="min-h-0 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Updating...' : 'Update Petitions'}
              </Button>
              <Button type="button" variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  )
}