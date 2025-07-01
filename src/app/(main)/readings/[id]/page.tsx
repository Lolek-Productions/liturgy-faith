import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Edit, Plus, BookOpen, Copy, GripVertical } from "lucide-react"
import { getReadingCollectionWithItems } from "@/lib/actions/readings"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ReadingCollectionDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const collection = await getReadingCollectionWithItems(id)
  
  if (!collection) {
    redirect('/readings')
  }

  const getOccasionColor = (occasion: string) => {
    switch (occasion.toLowerCase()) {
      case 'wedding': return 'bg-pink-100 text-pink-800'
      case 'funeral': return 'bg-gray-100 text-gray-800'
      case 'baptism': return 'bg-blue-100 text-blue-800'
      case 'confirmation': return 'bg-purple-100 text-purple-800'
      case 'mass': return 'bg-green-100 text-green-800'
      default: return 'bg-orange-100 text-orange-800'
    }
  }

  const getReadingTypeColor = (category: string) => {
    if (category.includes('-1') || category.includes('first')) return 'bg-blue-100 text-blue-800'
    if (category.includes('psalm')) return 'bg-purple-100 text-purple-800'  
    if (category.includes('-2') || category.includes('second')) return 'bg-green-100 text-green-800'
    if (category.includes('gospel')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/readings">
              <ArrowLeft className="h-4 w-4" />
              Back to Collections
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{collection.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getOccasionColor(collection.occasion_type)}>
                {collection.occasion_type}
              </Badge>
              {collection.is_template && (
                <Badge variant="secondary">Template</Badge>
              )}
              <span className="text-muted-foreground">
                {collection.items.length} reading{collection.items.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!collection.is_template && (
            <>
              <Button variant="outline" asChild>
                <Link href={`/readings/${collection.id}/add-reading`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reading
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/readings/${collection.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Collection
                </Link>
              </Button>
            </>
          )}
          {collection.is_template && (
            <Button asChild>
              <Link href={`/readings/${collection.id}/copy`}>
                <Copy className="h-4 w-4 mr-2" />
                Copy to My Collections
              </Link>
            </Button>
          )}
        </div>
      </div>

      {collection.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{collection.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Readings List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Readings in this Collection</h2>
          {collection.items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => {
                const fullText = collection.items
                  .map(item => `${item.reading.pericope}\n${item.reading.title}\n\n${item.reading.reading_text}\n\n${item.reading.conclusion || ''}`)
                  .join('\n\n---\n\n')
                navigator.clipboard.writeText(fullText)
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All Readings
            </Button>
          )}
        </div>

        {collection.items.length > 0 ? (
          <div className="space-y-4">
            {collection.items.map((item, index) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mt-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.reading.title}</CardTitle>
                          <p className="text-muted-foreground mt-1">{item.reading.pericope}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getReadingTypeColor(item.reading.category)}>
                              {item.reading.category.replace('-', ' ').replace('_', ' ')}
                            </Badge>
                            {item.reading.is_template && (
                              <Badge variant="outline" className="text-xs">
                                Template
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(item.reading.reading_text)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/readings/library/${item.reading.id}`}>
                              <BookOpen className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm line-clamp-3 whitespace-pre-wrap">
                      {item.reading.reading_text}
                    </p>
                  </div>
                  {item.notes && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>Note:</strong> {item.notes}
                      </p>
                    </div>
                  )}
                  {item.reading.conclusion && (
                    <p className="text-xs text-muted-foreground italic mt-2">
                      {item.reading.conclusion}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No readings in this collection yet</h3>
              <p className="text-muted-foreground mb-6">
                Add readings from your library or create new ones to build this collection.
              </p>
              {!collection.is_template && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href={`/readings/${collection.id}/add-reading`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Reading from Library
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/readings/library/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Reading
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Collection Info */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2">{new Date(collection.created_at).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Updated:</span>
              <span className="ml-2">{new Date(collection.updated_at).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Readings:</span>
              <span className="ml-2">{collection.items.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-2">{collection.is_template ? 'Template' : 'Personal'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}