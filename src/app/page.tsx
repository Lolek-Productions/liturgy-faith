import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, FileText, Calendar } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to Petitions</h1>
        <p className="text-muted-foreground">
          Create and manage church petitions for your community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Petition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Start creating a new petition with guided questions about sacraments, deaths, sick members, and special requests.
            </p>
            <Button asChild className="w-full">
              <Link href="/create">Create Petition</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Petitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and manage all your created petitions. Edit, copy, or delete existing petitions.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/petitions">View Petitions</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              See your petitions organized by date to plan ahead for upcoming services.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/calendar">View Calendar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <h4 className="font-medium">Create Your First Petition</h4>
              <p className="text-sm text-muted-foreground">
                Click "Create Petition" and fill out the form with context about your community's needs
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <h4 className="font-medium">Review Generated Content</h4>
              <p className="text-sm text-muted-foreground">
                The app will generate formatted petitions based on your input
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <h4 className="font-medium">Use in Your Service</h4>
              <p className="text-sm text-muted-foreground">
                Copy the generated content for use in your church service
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
