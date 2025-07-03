'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { createLiturgicalReading } from '@/lib/actions/liturgical-readings'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CreateLiturgicalReadingsPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const { setBreadcrumbs } = useBreadcrumbs()
  const router = useRouter()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Liturgical Readings", href: "/liturgical-readings" },
      { label: "Create Reading Collection" }
    ])
  }, [setBreadcrumbs])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your reading collection.')
      return
    }

    setSaving(true)
    try {
      const liturgicalReading = await createLiturgicalReading({
        title: title.trim(),
        description: description.trim() || undefined
      })
      
      toast.success('Reading collection created successfully!')
      // Redirect to edit page to continue building the liturgical reading
      router.push(`/liturgical-readings/${liturgicalReading.id}/edit`)
    } catch (error) {
      console.error('Failed to create liturgical reading:', error)
      toast.error('Failed to create reading collection. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/liturgical-readings">
          <ArrowLeft className="h-4 w-4" />
          Back to Liturgical Readings
        </Link>
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold">Create Reading Collection</h1>
        <p className="text-muted-foreground">
          Create a new liturgical reading collection. You&apos;ll be able to add readings in the next step.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sunday Mass - 3rd Sunday of Advent"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground">
              Give your reading collection a descriptive name
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details about this reading collection..."
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground">
              Provide additional context or notes about this collection
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
            <p className="text-sm text-blue-800">
              After creating your collection, you&apos;ll be taken to the liturgical readings wizard where you can:
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Select first reading, psalm, second reading, and gospel</li>
              <li>• Choose from our curated reading library</li>
              <li>• Set lector assignments</li>
              <li>• Configure print settings</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleSave} 
              disabled={saving || !title.trim()}
              className="flex-1"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Creating...' : 'Create & Continue'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/liturgical-readings">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}