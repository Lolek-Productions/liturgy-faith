'use client'

import { useEffect, useState } from 'react'
import { getPetitionWithContext } from '@/lib/actions/petitions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/page-container'
import { Loading } from '@/components/loading'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Edit, Calendar, Printer } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { Petition, PetitionContext } from '@/lib/types'

interface PetitionDetailPageProps {
  params: Promise<{ id: string }>
}

export default function PetitionDetailPage({ params }: PetitionDetailPageProps) {
  const [petition, setPetition] = useState<Petition | null>(null)
  const [context, setContext] = useState<PetitionContext | null>(null)
  const [petitionId, setPetitionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { setBreadcrumbs } = useBreadcrumbs()

  const handlePrint = () => {
    if (petitionId) {
      const printUrl = `/print/petitions-print?id=${petitionId}&title=Petitions`
      window.open(printUrl, '_blank')
    }
  }

  useEffect(() => {
    const loadPetition = async () => {
      const { id } = await params
      setPetitionId(id)
      const result = await getPetitionWithContext(id)
      
      if (!result) {
        notFound()
        return
      }

      setPetition(result.petition)
      setContext(result.context)
      
      // Set breadcrumbs
      setBreadcrumbs([
        { label: "Dashboard", href: "/dashboard" },
        { label: "Petitions", href: "/petitions" },
        { label: result.petition.title }
      ])
      
      setLoading(false)
    }

    loadPetition()
  }, [params, setBreadcrumbs])

  if (loading) {
    return (
      <PageContainer 
        title="Petition Details"
        description="View petition content and context."
        maxWidth="4xl"
      >
        <Loading />
      </PageContainer>
    )
  }

  if (!petition || !context) {
    notFound()
    return null
  }

  return (
    <PageContainer 
      title={petition.title}
      description={`Petition for ${new Date(petition.date).toLocaleDateString()}`}
      maxWidth="4xl"
    >
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(petition.date).toLocaleDateString()}
          </div>
          <Badge variant="secondary">{petition.language}</Badge>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Petition</CardTitle>
                <CopyButton content={petition.generated_content || ''} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-md">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {petition.generated_content}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Context Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-medium mb-2">Community Information</h4>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {context.community_info}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/petitions/${petitionId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Petitions
                </Link>
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Petitions
              </Button>
              <CopyButton 
                content={petition.generated_content || ''} 
                className="w-full"
                variant="outline"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}