import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Library, Edit, Eye, Calendar } from "lucide-react"
import { getReadingCollections } from "@/lib/actions/readings"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ReadingCollectionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const collections = await getReadingCollections()

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

  // Separate template collections from user collections
  const templateCollections = collections.filter(c => c.is_template)
  const userCollections = collections.filter(c => !c.is_template)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reading Collections</h1>
          <p className="text-muted-foreground">
            Manage pre-assembled sets of readings for different liturgical occasions.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/readings/library">
              <Library className="h-4 w-4 mr-2" />
              Reading Library
            </Link>
          </Button>
          <Button asChild>
            <Link href="/readings/create">
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Link>
          </Button>
        </div>
      </div>

      {/* Template Collections */}
      {templateCollections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Template Collections</h2>
            <Badge variant="secondary">Pre-made</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templateCollections.map((collection) => (
              <Card key={collection.id} className="hover:shadow-lg transition-shadow border-l-4 border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{collection.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getOccasionColor(collection.occasion_type)}>
                          {collection.occasion_type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Template
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/readings/${collection.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {collection.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      Added {new Date(collection.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/readings/${collection.id}/copy`}>
                          Copy to My Collections
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/readings/${collection.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* User Collections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Collections</h2>
          {userCollections.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {userCollections.length} collection{userCollections.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {userCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCollections.map((collection) => (
              <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{collection.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getOccasionColor(collection.occasion_type)}>
                          {collection.occasion_type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(collection.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/readings/${collection.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {collection.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      Updated {new Date(collection.updated_at).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/readings/${collection.id}`}>
                        View Collection
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Library className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No reading collections yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first reading collection to organize readings for different liturgical occasions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/readings/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Collection
                  </Link>
                </Button>
                {templateCollections.length > 0 && (
                  <Button variant="outline" asChild>
                    <Link href="#template-collections">
                      <Eye className="h-4 w-4 mr-2" />
                      Browse Templates
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      {(userCollections.length > 0 || templateCollections.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Collection Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{userCollections.length}</div>
                <div className="text-sm text-muted-foreground">My Collections</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{templateCollections.length}</div>
                <div className="text-sm text-muted-foreground">Templates Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {[...new Set(collections.map(c => c.occasion_type))].length}
                </div>
                <div className="text-sm text-muted-foreground">Occasion Types</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{collections.length}</div>
                <div className="text-sm text-muted-foreground">Total Collections</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}