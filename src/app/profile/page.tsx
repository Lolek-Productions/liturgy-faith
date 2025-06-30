import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { User } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Profile Settings Coming Soon</h3>
          <p className="text-muted-foreground">
            User profile management will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}