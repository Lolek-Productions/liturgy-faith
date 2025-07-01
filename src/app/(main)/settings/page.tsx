'use client'

import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Settings } from 'lucide-react'
import { useBreadcrumbs } from '@/components/breadcrumb-context'

export default function SettingsPage() {
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings" }
    ])
  }, [setBreadcrumbs])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application preferences
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Settings Coming Soon</h3>
          <p className="text-muted-foreground">
            Application settings and preferences will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}