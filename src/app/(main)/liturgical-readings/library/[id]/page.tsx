'use client'

import { useEffect, useState } from 'react'
import type { IndividualReading } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Copy, BookOpen } from "lucide-react"
import { getIndividualReading } from "@/lib/actions/readings"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function LibraryReadingDetailPage({ params }: PageProps) {
  const [reading, setReading] = useState<IndividualReading | null>(null)
  const [loading, setLoading] = useState(true)
  const { setBreadcrumbs } = useBreadcrumbs()
  const router = useRouter()

  useEffect(() => {
    const loadReading = async () => {
      try {
        const { id } = await params
        const readingData = await getIndividualReading(id)
        
        if (!readingData) {
          router.push('/liturgical-readings/library')
          return
        }

        setReading(readingData)
        setBreadcrumbs([
          { label: "Dashboard", href: "/dashboard" },
          { label: "Liturgical Readings", href: "/liturgical-readings" },
          { label: "Readings Library", href: "/liturgical-readings/library" },
          { label: readingData.title }
        ])
      } catch (error) {
        console.error('Failed to load reading:', error)
        router.push('/liturgical-readings/library')
      } finally {
        setLoading(false)
      }
    }

    loadReading()
  }, [params, setBreadcrumbs, router])

  const handleCopyToCollection = () => {
    if (!reading) return
    // TODO: Implement copy to user's collection
    console.log('Copy reading to collection:', reading.id)
    alert(`Reading "${reading.title}" copied to your collection!`)
  }

  if (loading) {
    return <div className="space-y-6">Loading reading...</div>
  }

  if (!reading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reading Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The reading you&apos;re looking for could not be found.
          </p>
          <Button asChild className="mt-4">
            <Link href="/liturgical-readings/library">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const getReadingTypeColor = (category: string) => {
    if (category.includes('first') || category.includes('-1')) return 'bg-blue-100 text-blue-800'
    if (category.includes('psalm')) return 'bg-purple-100 text-purple-800'  
    if (category.includes('second') || category.includes('-2')) return 'bg-green-100 text-green-800'
    if (category.includes('gospel')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/liturgical-readings/library">
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{reading.title}</h1>
            <p className="text-muted-foreground">{reading.pericope}</p>
          </div>
        </div>
        <Button onClick={handleCopyToCollection} variant="outline">
          <Copy className="h-4 w-4 mr-2" />
          Add to Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Reading Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reading.introduction && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground italic">
                    {reading.introduction}
                  </p>
                </div>
              )}
              
              <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-primary/30">
                <div className="whitespace-pre-wrap text-base leading-relaxed">
                  {reading.reading_text}
                </div>
              </div>
              
              {reading.conclusion && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground italic text-right">
                    — {reading.conclusion}
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigator.clipboard.writeText(reading.reading_text)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(`${reading.pericope}\n\n${reading.reading_text}\n\n— ${reading.conclusion || reading.pericope}`)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy with Citation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reading Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <div className="mt-1">
                  <Badge className={getReadingTypeColor(reading.category)}>
                    {reading.category.replace('-', ' ').replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Pericope</label>
                <p className="mt-1 font-medium">{reading.pericope}</p>
              </div>

              {reading.introduction && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Introduction</label>
                  <p className="mt-1 text-sm">{reading.introduction}</p>
                </div>
              )}

              {reading.conclusion && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Conclusion</label>
                  <p className="mt-1 text-sm">{reading.conclusion}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Source</label>
                <div className="mt-1">
                  <Badge variant={reading.is_template ? "secondary" : "default"}>
                    {reading.is_template ? "Template" : "Personal"}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Liturgical Category</label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs">
                    {reading.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleCopyToCollection}
                className="w-full justify-start"
              >
                <Copy className="h-4 w-4 mr-2" />
                Add to My Collection
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/liturgical-readings/library">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Library
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Record Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">{new Date(reading.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <span className="ml-2">{new Date(reading.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}