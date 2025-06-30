import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, FileText, TrendingUp, Clock } from "lucide-react"
import { getPetitions } from "@/lib/actions/petitions"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const recentPetitions = await getPetitions()
  const recentPetitionsCount = recentPetitions.slice(0, 3)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your petition management.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Petitions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentPetitions.length}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime petitions created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentPetitions.filter(p => {
                const petitionDate = new Date(p.created_at)
                const now = new Date()
                return petitionDate.getMonth() === now.getMonth() && 
                       petitionDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Petitions this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 min</div>
            <p className="text-xs text-muted-foreground">
              Per petition created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/petitions/create">
                <Plus className="h-4 w-4 mr-2" />
                Create New Petition
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/petitions">
                <FileText className="h-4 w-4 mr-2" />
                View All Petitions
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Petitions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPetitionsCount.length > 0 ? (
              <div className="space-y-4">
                {recentPetitionsCount.map((petition) => (
                  <div key={petition.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{petition.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(petition.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/petitions/${petition.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
                {recentPetitions.length > 3 && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/petitions">
                      View All {recentPetitions.length} Petitions
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No petitions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first petition to get started.
                </p>
                <Button asChild>
                  <Link href="/petitions/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Petition
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">📝 Creating Petitions</h4>
              <p className="text-sm text-muted-foreground">
                Use the guided form to input community context. The system will generate 
                properly formatted liturgical petitions following traditional Catholic prayers.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🌍 Multiple Languages</h4>
              <p className="text-sm text-muted-foreground">
                Generate petitions in English, Spanish, French, or Latin while maintaining 
                authentic liturgical traditions and proper formatting.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">📋 Managing Petitions</h4>
              <p className="text-sm text-muted-foreground">
                View all your petitions, copy content with one click, and organize them 
                by date for easy reference during services.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🔒 Privacy & Security</h4>
              <p className="text-sm text-muted-foreground">
                Your data is protected with enterprise-grade security. Only you can access 
                your petitions and community information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}