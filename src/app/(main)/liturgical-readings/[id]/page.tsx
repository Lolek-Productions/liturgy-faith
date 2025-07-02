'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Edit, Printer, Calendar, BookOpen, User } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { useRouter } from 'next/navigation'
import type { IndividualReading } from '@/lib/types'

interface LiturgicalReadingDetail {
  id: string
  title: string
  description?: string
  created_at: string
  updated_at: string
  include_petitions: boolean
  readings: Array<{
    id: string
    type: 'first' | 'psalm' | 'second' | 'gospel'
    reading: IndividualReading
    lector?: string
    include_in_print: boolean
  }>
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function LiturgicalReadingDetailPage({ params }: PageProps) {
  const [readingCollection, setReadingCollection] = useState<LiturgicalReadingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [readingId, setReadingId] = useState<string>('')
  const { setBreadcrumbs } = useBreadcrumbs()
  const router = useRouter()

  useEffect(() => {
    const loadReading = async () => {
      try {
        const { id } = await params
        setReadingId(id)
        
        // TODO: Load actual reading collection data
        // For now, simulate data
        const mockData: LiturgicalReadingDetail = {
          id: id,
          title: 'Sunday Mass - 3rd Sunday of Advent',
          description: 'Advent readings with special focus on preparation and joy',
          created_at: '2024-12-01T10:00:00Z',
          updated_at: '2024-12-01T10:00:00Z',
          include_petitions: true,
          readings: [
            {
              id: '1',
              type: 'first',
              reading: {
                id: 'reading-1',
                title: 'Isaiah 61:1-2a, 10-11',
                pericope: 'Isaiah 61:1-2a, 10-11',
                category: 'sunday-1',
                translation_id: 1,
                sort_order: 1,
                introduction: 'A reading from the Book of the Prophet Isaiah',
                reading_text: 'The spirit of the Lord GOD is upon me, because the LORD has anointed me; he has sent me to bring glad tidings to the poor, to heal the brokenhearted, to proclaim liberty to the captives and release to the prisoners, to announce a year of favor from the LORD and a day of vindication by our God.\n\nI rejoice heartily in the LORD, in my God is the joy of my soul; for he has clothed me with a robe of salvation and wrapped me in a mantle of justice, like a bridegroom adorned with a diadem, like a bride bedecked with her jewels.\n\nAs the earth brings forth its plants, and a garden makes its growth spring up, so will the Lord GOD make justice and praise spring up before all the nations.',
                conclusion: 'The word of the Lord.',
                is_template: true,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
              },
              lector: 'John Smith',
              include_in_print: true
            },
            {
              id: '2',
              type: 'psalm',
              reading: {
                id: 'psalm-1',
                title: 'Luke 1:46-48, 49-50, 53-54',
                pericope: 'Luke 1:46-48, 49-50, 53-54',
                category: 'sunday-psalm',
                translation_id: 1,
                sort_order: 2,
                introduction: 'Responsorial Psalm',
                reading_text: 'R. My soul rejoices in my God.\n\nMy soul proclaims the greatness of the Lord, my spirit rejoices in God my Savior for he has looked with favor on his lowly servant. R.\n\nThe Almighty has done great things for me, and holy is his Name. He has mercy on those who fear him in every generation. R.\n\nHe has filled the hungry with good things, and the rich he has sent away empty. He has come to the help of his servant Israel for he has remembered his promise of mercy. R.',
                conclusion: '',
                is_template: true,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
              },
              lector: 'Mary Johnson',
              include_in_print: true
            },
            {
              id: '3',
              type: 'second',
              reading: {
                id: 'reading-2',
                title: '1 Thessalonians 5:16-24',
                pericope: '1 Thessalonians 5:16-24',
                category: 'sunday-2',
                translation_id: 1,
                sort_order: 3,
                introduction: 'A reading from the first Letter of Saint Paul to the Thessalonians',
                reading_text: 'Brothers and sisters: Rejoice always. Pray without ceasing. In all circumstances give thanks, for this is the will of God for you in Christ Jesus. Do not quench the Spirit. Do not despise prophetic utterances. Test everything; retain what is good. Refrain from every kind of evil.\n\nMay the God of peace make you perfectly holy and may you entirely, spirit, soul, and body, be preserved blameless for the coming of our Lord Jesus Christ. The one who calls you is faithful, and he will also accomplish it.',
                conclusion: 'The word of the Lord.',
                is_template: true,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
              },
              lector: 'David Wilson',
              include_in_print: true
            },
            {
              id: '4',
              type: 'gospel',
              reading: {
                id: 'gospel-1',
                title: 'John 1:6-8, 19-28',
                pericope: 'John 1:6-8, 19-28',
                category: 'sunday-gospel',
                translation_id: 1,
                sort_order: 4,
                introduction: 'A reading from the holy Gospel according to John',
                reading_text: 'A man named John was sent from God. He came for testimony, to testify to the light, so that all might believe through him. He was not the light, but came to testify to the light.\n\nAnd this is the testimony of John. When the Jews from Jerusalem sent priests and Levites to him to ask him, "Who are you?" He admitted and did not deny it, but admitted, "I am not the Christ." So they asked him, "What are you then? Are you Elijah?" And he said, "I am not." "Are you the Prophet?" He answered, "No." So they said to him, "Who are you, so we can give an answer to those who sent us? What do you say about yourself?" He said: "I am the voice of one crying out in the desert, \'make straight the way of the Lord,\'" as Isaiah the prophet said.\n\nSome Pharisees were also sent. They asked him, "Why then do you baptize if you are not the Christ or Elijah or the Prophet?" John answered them, "I baptize with water; but there is one among you whom you do not recognize, the one who is coming after me, whose sandal strap I am not worthy to untie." This happened in Bethany across the Jordan, where John was baptizing.',
                conclusion: 'The Gospel of the Lord.',
                is_template: true,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
              },
              include_in_print: true
            }
          ]
        }
        
        setReadingCollection(mockData)
        setBreadcrumbs([
          { label: "Dashboard", href: "/dashboard" },
          { label: "Liturgical Readings", href: "/liturgical-readings" },
          { label: mockData.title }
        ])
      } catch (error) {
        console.error('Failed to load reading collection:', error)
        router.push('/liturgical-readings')
      } finally {
        setLoading(false)
      }
    }

    loadReading()
  }, [params, setBreadcrumbs, router])

  const handlePrint = () => {
    if (!readingCollection) return
    
    const params = new URLSearchParams()
    
    const readingIds = readingCollection.readings
      .filter(r => r.include_in_print)
      .map(r => r.reading.id)
    
    if (readingIds.length > 0) {
      params.set('readings', readingIds.join(','))
    }
    
    params.set('title', readingCollection.title)
    
    if (readingCollection.include_petitions) {
      params.set('includePetitions', 'true')
    }
    
    const printUrl = readingCollection.include_petitions 
      ? `/print/combined?${params.toString()}`
      : `/print/readings-print?${params.toString()}`
    
    window.open(printUrl, '_blank')
  }

  const getReadingTypeLabel = (type: string) => {
    switch (type) {
      case 'first': return 'First Reading'
      case 'psalm': return 'Responsorial Psalm'
      case 'second': return 'Second Reading'
      case 'gospel': return 'Gospel'
      default: return type
    }
  }

  const getReadingTypeColor = (type: string) => {
    switch (type) {
      case 'first': return 'bg-blue-100 text-blue-800'
      case 'psalm': return 'bg-purple-100 text-purple-800'
      case 'second': return 'bg-green-100 text-green-800'
      case 'gospel': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="space-y-6">Loading...</div>
  }

  if (!readingCollection) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reading Collection Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The reading collection you&apos;re looking for could not be found.
          </p>
          <Button asChild className="mt-4">
            <Link href="/liturgical-readings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Readings
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/liturgical-readings">
              <ArrowLeft className="h-4 w-4" />
              Back to My Readings
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{readingCollection.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(readingCollection.created_at).toLocaleDateString()}
              </div>
              <Badge variant={readingCollection.include_petitions ? "default" : "secondary"}>
                {readingCollection.include_petitions ? "With Petitions" : "Readings Only"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button asChild>
            <Link href={`/liturgical-readings/${readingId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {readingCollection.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{readingCollection.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {readingCollection.readings.map((readingItem) => (
            <Card key={readingItem.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <Badge className={getReadingTypeColor(readingItem.type)}>
                        {getReadingTypeLabel(readingItem.type)}
                      </Badge>
                      {readingItem.reading.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {readingItem.reading.pericope}
                    </p>
                    {readingItem.lector && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        Lector: {readingItem.lector}
                      </div>
                    )}
                  </div>
                  <Badge variant={readingItem.include_in_print ? "default" : "secondary"}>
                    {readingItem.include_in_print ? "Print" : "Skip"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {readingItem.reading.introduction && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground italic">
                      {readingItem.reading.introduction}
                    </p>
                  </div>
                )}
                
                <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary/30">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {readingItem.reading.reading_text}
                  </div>
                </div>
                
                {readingItem.reading.conclusion && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground italic text-right">
                      — {readingItem.reading.conclusion}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collection Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Readings</div>
                <div className="font-medium">{readingCollection.readings.length}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Readings for Print</div>
                <div className="font-medium">
                  {readingCollection.readings.filter(r => r.include_in_print).length}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Include Petitions</div>
                <Badge variant={readingCollection.include_petitions ? "default" : "secondary"}>
                  {readingCollection.include_petitions ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Reading Types</div>
                <div className="space-y-1 mt-1">
                  {readingCollection.readings.map((reading) => (
                    <div key={reading.id} className="text-sm">
                      {getReadingTypeLabel(reading.type)}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href={`/liturgical-readings/${readingId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Collection
                </Link>
              </Button>
              
              <Button 
                onClick={handlePrint} 
                variant="outline" 
                className="w-full justify-start"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Document
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                asChild
              >
                <Link href="/liturgical-readings">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Back to My Readings
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">{new Date(readingCollection.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <span className="ml-2">{new Date(readingCollection.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}