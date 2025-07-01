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
import { createIndividualReading } from "@/lib/actions/readings"
import { useRouter } from "next/navigation"

export default function CreateIndividualReadingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    pericope: "",
    title: "",
    category: "marriage-1",
    translation_id: 1,
    sort_order: 1,
    introduction: "",
    reading_text: "",
    conclusion: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const reading = await createIndividualReading({
        ...formData
      })
      router.push(`/readings/library/${reading.id}`)
    } catch {
      alert("Failed to create reading. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const categoryOptions = [
    { value: "marriage-1", label: "Marriage - First Reading" },
    { value: "marriage-psalm", label: "Marriage - Psalm" },
    { value: "marriage-2", label: "Marriage - Second Reading" },
    { value: "marriage-gospel", label: "Marriage - Gospel" },
    { value: "funeral-1", label: "Funeral - First Reading" },
    { value: "funeral-psalm", label: "Funeral - Psalm" },
    { value: "funeral-gospel", label: "Funeral - Gospel" },
    { value: "baptism-1", label: "Baptism - First Reading" },
    { value: "baptism-psalm", label: "Baptism - Psalm" },
    { value: "baptism-2", label: "Baptism - Second Reading" },
    { value: "baptism-gospel", label: "Baptism - Gospel" },
    { value: "mass-1", label: "Mass - First Reading" },
    { value: "mass-psalm", label: "Mass - Psalm" },
    { value: "mass-2", label: "Mass - Second Reading" },
    { value: "mass-gospel", label: "Mass - Gospel" },
    { value: "other", label: "Other" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/readings/library">
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Reading</h1>
          <p className="text-muted-foreground">
            Add a new individual reading to your library.
          </p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Reading Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pericope">Biblical Pericope *</Label>
                <Input
                  id="pericope"
                  value={formData.pericope}
                  onChange={(e) => setFormData({...formData, pericope: e.target.value})}
                  placeholder="e.g., Genesis 1:26-28, 31a"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., The Creation of Man and Woman"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Liturgical Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select liturgical category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 1})}
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="introduction">Liturgical Introduction</Label>
              <Input
                id="introduction"
                value={formData.introduction}
                onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                placeholder="e.g., A reading from the Book of Genesis."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reading_text">Reading Text *</Label>
              <Textarea
                id="reading_text"
                value={formData.reading_text}
                onChange={(e) => setFormData({...formData, reading_text: e.target.value})}
                placeholder="Enter the full text of the reading..."
                rows={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conclusion">Liturgical Conclusion</Label>
              <Input
                id="conclusion"
                value={formData.conclusion}
                onChange={(e) => setFormData({...formData, conclusion: e.target.value})}
                placeholder="e.g., The word of the Lord., The Gospel of the Lord."
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Tips for Adding Liturgical Readings</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use proper biblical pericope format (e.g., &quot;Genesis 1:26-28, 31a&quot;)</li>
                <li>• Include liturgical introductions and conclusions for complete readings</li>
                <li>• Choose the appropriate liturgical category for easy organization</li>
                <li>• Set sort order to control ordering within the same category</li>
                <li>• Enter the complete reading text for use in liturgy planning</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Reading"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/readings/library">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}