'use client'

import { useEffect, useState } from 'react'
import { getPetitions } from '@/lib/actions/petitions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/page-container'
import { Loading } from '@/components/loading'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Plus, Calendar, Eye } from 'lucide-react'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { Petition } from '@/lib/types'

export default function PetitionsPage() {
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [loading, setLoading] = useState(true)
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Petitions" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    const loadPetitions = async () => {
      try {
        const data = await getPetitions()
        setPetitions(data)
      } catch (error) {
        console.error('Failed to load petitions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPetitions()
  }, [])

  if (loading) {
    return (
      <PageContainer 
        title="My Petitions" 
        description="Manage your created petitions"
        maxWidth="4xl"
      >
        <Loading variant="skeleton-list" />
      </PageContainer>
    )
  }

  return (
    <PageContainer 
      title="My Petitions" 
      description="Manage your created petitions"
      maxWidth="4xl"
    >
      <div className="flex justify-end mb-6">
        <Button asChild>
          <Link href="/petitions/create">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Link>
        </Button>
      </div>

      {petitions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No petitions yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first petition
            </p>
            <Button asChild>
              <Link href="/petitions/create">Create Petition</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {petitions.map((petition) => (
            <Card key={petition.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{petition.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(petition.date).toLocaleDateString()}
                      </div>
                      <div>
                        Language: {petition.language}
                      </div>
                      <div>
                        Created {formatDistanceToNow(new Date(petition.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/petitions/${petition.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              {petition.generated_content && (
                <CardContent>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm whitespace-pre-line line-clamp-3">
                      {petition.generated_content.slice(0, 200)}...
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  )
}