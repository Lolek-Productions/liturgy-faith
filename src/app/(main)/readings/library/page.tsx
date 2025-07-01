import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, BookOpen, Edit, Filter } from "lucide-react"
import { getIndividualReadings } from "@/lib/actions/readings"
import type { IndividualReading } from "@/lib/types"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ReadingLibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const readings = await getIndividualReadings()

  const getReadingTypeColor = (category: string) => {
    if (category.includes('-1') || category.includes('first')) return 'bg-blue-100 text-blue-800'
    if (category.includes('psalm')) return 'bg-purple-100 text-purple-800'  
    if (category.includes('-2') || category.includes('second')) return 'bg-green-100 text-green-800'
    if (category.includes('gospel')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  // Separate template readings from user readings
  const templateReadings = readings.filter(r => r.is_template)
  const userReadings = readings.filter(r => !r.is_template)

  // Group readings by category
  const readingsByCategory = readings.reduce((acc, reading) => {
    if (!acc[reading.category]) {
      acc[reading.category] = []
    }
    acc[reading.category].push(reading)
    return acc
  }, {} as Record<string, IndividualReading[]>)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reading Library</h1>
          <p className="text-muted-foreground">
            Manage individual readings that can be assembled into collections.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/readings">
              <BookOpen className="h-4 w-4 mr-2" />
              Collections
            </Link>
          </Button>
          <Button asChild>
            <Link href="/readings/library/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Reading
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {readings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Library Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{userReadings.length}</div>
                <div className="text-sm text-muted-foreground">My Readings</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{templateReadings.length}</div>
                <div className="text-sm text-muted-foreground">Templates</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{Object.keys(readingsByCategory).filter(cat => cat.includes('gospel')).reduce((sum, cat) => sum + readingsByCategory[cat].length, 0)}</div>
                <div className="text-sm text-muted-foreground">Gospels</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{Object.keys(readingsByCategory).filter(cat => cat.includes('psalm')).reduce((sum, cat) => sum + readingsByCategory[cat].length, 0)}</div>
                <div className="text-sm text-muted-foreground">Psalms</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{readings.length}</div>
                <div className="text-sm text-muted-foreground">Total Readings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reading Categories Sections */}
      {Object.keys(readingsByCategory).map((category) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold capitalize">
                {category.replace('-', ' ').replace('_', ' ')}
              </h2>
              <Badge className={getReadingTypeColor(category)}>
                {readingsByCategory[category].length} reading{readingsByCategory[category].length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readingsByCategory[category].map((reading) => (
              <Card key={reading.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{reading.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{reading.pericope}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getReadingTypeColor(reading.category)}>
                          {reading.category.replace('-', ' ').replace('_', ' ')}
                        </Badge>
                        {reading.is_template && (
                          <Badge variant="outline" className="text-xs">
                            Template
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!reading.is_template && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/readings/library/${reading.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm line-clamp-3">
                    {reading.reading_text}
                  </p>
                  
                  {reading.introduction && (
                    <p className="text-xs text-muted-foreground italic">
                      Introduction: {reading.introduction}
                    </p>
                  )}
                  
                  {reading.conclusion && (
                    <p className="text-xs text-muted-foreground italic">
                      Conclusion: {reading.conclusion}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      Added {new Date(reading.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/readings/library/${reading.id}`}>
                        View Full Text
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {readings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No readings in library yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building your reading library by adding individual readings that can be used in collections.
            </p>
            <Button asChild>
              <Link href="/readings/library/create">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Reading
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}