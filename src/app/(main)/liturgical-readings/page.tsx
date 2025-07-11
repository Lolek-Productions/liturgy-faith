'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from '@/components/page-container'
import { Loading } from '@/components/loading'
import Link from "next/link"
import { Plus, BookOpen, Edit, Eye, Calendar, Sparkles } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'

interface LiturgicalReading {
  id: string
  title: string
  description?: string
  created_at: string
  updated_at: string
  readings_count: number
  include_petitions: boolean
}

export default function LiturgicalReadingsPage() {
  const [readings, setReadings] = useState<LiturgicalReading[]>([])
  const [loading, setLoading] = useState(true)
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Liturgical Readings" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    // TODO: Load user's liturgical readings
    const loadReadings = async () => {
      try {
        // Simulated data for now
        setReadings([
          {
            id: '1',
            title: 'Sunday Mass - 3rd Sunday of Advent',
            description: 'Advent readings with special focus on preparation',
            created_at: '2024-12-01T10:00:00Z',
            updated_at: '2024-12-01T10:00:00Z',
            readings_count: 4,
            include_petitions: true
          },
          {
            id: '2', 
            title: 'Wedding Ceremony - Smith & Johnson',
            created_at: '2024-11-28T14:30:00Z',
            updated_at: '2024-11-28T14:30:00Z',
            readings_count: 3,
            include_petitions: false
          }
        ])
      } catch (error) {
        console.error('Failed to load readings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReadings()
  }, [])


  return (
    <PageContainer 
      title="My Liturgical Readings"
      description="Manage your liturgical reading collections created with the wizard or manual entry."
      maxWidth="7xl"
    >
      <div className="flex justify-end mb-6 gap-3">
        <Button asChild variant="outline">
          <Link href="/liturgical-readings/wizard">
            <Sparkles className="h-4 w-4 mr-2" />
            Readings Wizard
          </Link>
        </Button>
        <Button asChild>
          <Link href="/liturgical-readings/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Manually
          </Link>
        </Button>
      </div>

      {readings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readings.map((reading) => (
            <Card key={reading.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{reading.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        {reading.readings_count} reading{reading.readings_count !== 1 ? 's' : ''}
                      </Badge>
                      {reading.include_petitions && (
                        <Badge variant="outline">
                          + Petitions
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(reading.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/liturgical-readings/${reading.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {reading.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {reading.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    Updated {new Date(reading.updated_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/liturgical-readings/${reading.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No liturgical readings yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first liturgical reading collection using our wizard or manual entry.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/liturgical-readings/wizard">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start with Wizard
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/liturgical-readings/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Manually
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {loading && <Loading variant="skeleton-cards" />}
    </PageContainer>
  )
}