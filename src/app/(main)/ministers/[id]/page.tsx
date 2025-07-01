import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Edit, Mail, Phone, User } from "lucide-react"
import { getMinister } from "@/lib/actions/ministers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MinisterDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const minister = await getMinister(id)
  
  if (!minister) {
    redirect('/ministers')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/ministers">
              <ArrowLeft className="h-4 w-4" />
              Back to Ministers
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{minister.name}</h1>
            <p className="text-muted-foreground">Minister Details</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/ministers/${minister.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Minister
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg font-medium">{minister.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-sm">
                      {minister.role}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {minister.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${minister.email}`} className="text-blue-600 hover:underline">
                        {minister.email}
                      </a>
                    </div>
                  </div>
                )}
                {minister.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${minister.phone}`} className="text-blue-600 hover:underline">
                        {minister.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${minister.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className={minister.is_active ? 'text-green-700' : 'text-gray-500'}>
                    {minister.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {minister.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{minister.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href={`/ministers/${minister.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Information
                </Link>
              </Button>
              {minister.email && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`mailto:${minister.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </a>
                </Button>
              )}
              {minister.phone && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`tel:${minister.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Record Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">{new Date(minister.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <span className="ml-2">{new Date(minister.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}