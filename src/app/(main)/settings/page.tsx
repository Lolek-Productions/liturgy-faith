'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/page-container'
import { Settings, User, FileText, ChevronRight, BookOpen, Church } from 'lucide-react'
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import Link from 'next/link'

export default function SettingsPage() {
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings" }
    ])
  }, [setBreadcrumbs])
  return (
    <PageContainer
      title="Settings"
      description="Configure your application preferences and manage your account"
      maxWidth="6xl"
    >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              User Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Customize your language, liturgical preferences, and default settings.
            </p>
            <Button asChild className="w-full justify-between">
              <Link href="/settings/user">
                Configure Preferences
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              Petition Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Configure default petition templates for different liturgical occasions.
            </p>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/settings/petitions">
                Manage Petitions
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              Reading Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Import liturgical readings and manage your reading collections.
            </p>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/settings/readings">
                Manage Readings
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Church className="h-5 w-5 text-primary" />
              Parish Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage your current parish information and administrative settings.
            </p>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/settings/parish">
                Manage Parish
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Settings className="h-5 w-5" />
            Additional Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-2">Account Management</h4>
              <p className="text-sm text-muted-foreground mb-3">
                View account information, export data, or manage your subscription.
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-2">Integration Settings</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Connect with external liturgical calendars and planning tools.
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}