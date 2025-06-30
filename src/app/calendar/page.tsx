import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">
          View your petitions organized by date
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Calendar View Coming Soon</h3>
          <p className="text-muted-foreground">
            A calendar interface to organize your petitions by date will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}