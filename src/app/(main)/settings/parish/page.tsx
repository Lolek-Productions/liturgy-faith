'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PageContainer } from '@/components/page-container'
import { Save, Church, RefreshCw } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { getCurrentParish } from '@/lib/auth/parish'
import { updateParish } from '@/lib/actions/setup'
import { Parish } from '@/lib/types'
import { toast } from 'sonner'

export default function ParishSettingsPage() {
  const [currentParish, setCurrentParish] = useState<Parish | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings", href: "/settings" },
      { label: "Parish Settings" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    loadParishData()
  }, [])

  async function loadParishData() {
    try {
      setLoading(true)
      const parish = await getCurrentParish()
      if (parish) {
        setCurrentParish(parish)
        setFormData({
          name: parish.name,
          city: parish.city,
          state: parish.state
        })
      }
    } catch (error) {
      console.error('Error loading parish data:', error)
      toast.error('Failed to load parish data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!currentParish) {
      toast.error('No parish selected')
      return
    }

    if (!formData.name.trim() || !formData.city.trim() || !formData.state.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setSaving(true)
    try {
      await updateParish(currentParish.id, formData)
      toast.success('Parish settings saved successfully!')
      
      // Refresh parish data
      await loadParishData()
    } catch (error) {
      console.error('Error saving parish settings:', error)
      toast.error('Failed to save parish settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRefresh = () => {
    loadParishData()
  }

  if (loading) {
    return (
      <PageContainer
        title="Parish Settings"
        description="Manage your parish information and administrative settings"
        maxWidth="4xl"
      >
        <div className="space-y-6">Loading parish settings...</div>
      </PageContainer>
    )
  }

  if (!currentParish) {
    return (
      <PageContainer
        title="Parish Settings"
        description="Manage your parish information and administrative settings"
        maxWidth="4xl"
      >
        <Card>
          <CardContent className="text-center py-12">
            <Church className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Parish Selected</h3>
            <p className="text-muted-foreground">
              Please select a parish to manage its settings.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Parish Settings"
      description="Manage your parish information and administrative settings"
      maxWidth="4xl"
    >
      <div className="flex justify-end mb-6 gap-3">
        <Button onClick={handleRefresh} variant="outline" disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Church className="h-5 w-5" />
              Parish Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Parish Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="St. Mary's Catholic Church"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-sm font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="New York"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-sm font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="NY"
                  maxLength={2}
                  className="mt-1"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parish Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Parish ID</Label>
              <p className="mt-1 text-sm font-mono text-muted-foreground">{currentParish.id}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <p className="mt-1 text-sm">{new Date(currentParish.created_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}