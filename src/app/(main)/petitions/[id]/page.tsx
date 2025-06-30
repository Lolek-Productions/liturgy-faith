import { getPetitionWithContext } from '@/lib/actions/petitions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit, Calendar } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'

interface PetitionDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PetitionDetailPage({ params }: PetitionDetailPageProps) {
  const { id } = await params
  const result = await getPetitionWithContext(id)
  
  if (!result) {
    notFound()
  }

  const { petition, context } = result

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/petitions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Petitions
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{petition.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(petition.date).toLocaleDateString()}
            </div>
            <Badge variant="secondary">{petition.language}</Badge>
          </div>
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
            <CardContent className="space-y-4">
              {context.sacraments_received.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Sacraments Received</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {context.sacraments_received.map((person, index) => (
                      <li key={index}>• {person}</li>
                    ))}
                  </ul>
                </div>
              )}

              {context.deaths_this_week.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Deaths This Week</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {context.deaths_this_week.map((person, index) => (
                      <li key={index}>• {person}</li>
                    ))}
                  </ul>
                </div>
              )}

              {context.sick_members.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Sick Members</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {context.sick_members.map((person, index) => (
                      <li key={index}>• {person}</li>
                    ))}
                  </ul>
                </div>
              )}

              {context.special_petitions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Special Petitions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {context.special_petitions.map((petition, index) => (
                      <li key={index}>• {petition}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Petition
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