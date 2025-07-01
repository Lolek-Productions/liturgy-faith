'use client'

import { useEffect, useState } from 'react'
import { getPetitionWithContext } from '@/lib/actions/petitions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Edit, Calendar } from 'lucide-react'
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
    return <div className="max-w-4xl mx-auto space-y-6">Loading...</div>
  }

  if (!petition || !context) {
    notFound()
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{petition.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(petition.date).toLocaleDateString()}
          </div>
          <Badge variant="secondary">{petition.language}</Badge>
        </div>
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
              <CopyButton 
                content={petition.generated_content || ''} 
                className="w-full"
                variant="outline"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}