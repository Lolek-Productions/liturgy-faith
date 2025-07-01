"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { createReadingCollection } from "@/lib/actions/readings"
import { useRouter } from "next/navigation"

export default function CreateReadingCollectionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    occasion_type: "wedding"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const collection = await createReadingCollection(formData)
      router.push(`/readings/${collection.id}`)
    } catch {
      alert("Failed to create reading collection. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/readings">
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Reading Collection</h1>
          <p className="text-muted-foreground">
            Create a new collection to organize readings for a specific liturgical occasion.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Collection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Our Lady of Grace Wedding Readings"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occasion_type">Occasion Type *</Label>
              <Select value={formData.occasion_type} onValueChange={(value) => setFormData({...formData, occasion_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occasion type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="funeral">Funeral</SelectItem>
                  <SelectItem value="baptism">Baptism</SelectItem>
                  <SelectItem value="confirmation">Confirmation</SelectItem>
                  <SelectItem value="mass">Mass</SelectItem>
                  <SelectItem value="first_communion">First Communion</SelectItem>
                  <SelectItem value="ordination">Ordination</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe this collection and when it should be used..."
                rows={3}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">What&apos;s Next?</h3>
              <p className="text-sm text-muted-foreground">
                After creating this collection, you&apos;ll be able to add individual readings from your library 
                or create new readings specifically for this collection. You can also reorder readings and 
                add notes for each one.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create Collection"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/readings">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}