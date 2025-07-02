'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Crown } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { 
  getPetitionContexts, 
  createPetitionContext, 
  updatePetitionContext, 
  deletePetitionContext,
  PetitionContextTemplate,
  CreateContextData,
  UpdateContextData
} from '@/lib/actions/petition-contexts'

export default function PetitionContextsPage() {
  const [contexts, setContexts] = useState<PetitionContextTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContext, setEditingContext] = useState<PetitionContextTemplate | null>(null)
  const [formData, setFormData] = useState<CreateContextData>({
    name: '',
    description: '',
    community_info: '',
    sacraments_received: [],
    deaths_this_week: [],
    sick_members: [],
    special_petitions: []
  })
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings", href: "/settings" },
      { label: "Petition Settings", href: "/settings/petitions" },
      { label: "Contexts" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    loadContexts()
  }, [])

  const loadContexts = async () => {
    try {
      const data = await getPetitionContexts()
      setContexts(data)
    } catch (error) {
      console.error('Failed to load contexts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContext = async () => {
    try {
      await createPetitionContext(formData)
      setDialogOpen(false)
      resetForm()
      loadContexts()
    } catch (error) {
      console.error('Failed to create context:', error)
    }
  }

  const handleUpdateContext = async () => {
    if (!editingContext) return
    try {
      const updateData: UpdateContextData = {
        id: editingContext.id,
        ...formData
      }
      await updatePetitionContext(updateData)
      setDialogOpen(false)
      setEditingContext(null)
      resetForm()
      loadContexts()
    } catch (error) {
      console.error('Failed to update context:', error)
    }
  }

  const handleDeleteContext = async (contextId: string) => {
    if (!confirm('Are you sure you want to delete this context?')) return
    try {
      await deletePetitionContext(contextId)
      loadContexts()
    } catch (error) {
      console.error('Failed to delete context:', error)
    }
  }

  const openEditDialog = (context: PetitionContextTemplate) => {
    setEditingContext(context)
    setFormData({
      name: context.name,
      description: context.description || '',
      community_info: context.community_info,
      sacraments_received: context.sacraments_received,
      deaths_this_week: context.deaths_this_week,
      sick_members: context.sick_members,
      special_petitions: context.special_petitions
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      community_info: '',
      sacraments_received: [],
      deaths_this_week: [],
      sick_members: [],
      special_petitions: []
    })
    setEditingContext(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  if (loading) {
    return <div className="space-y-8">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Petition Contexts</h1>
          <p className="text-muted-foreground">
            Manage reusable contexts for different types of liturgical celebrations.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              New Context
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContext ? 'Edit Context' : 'Create New Context'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Christmas Mass, Easter Vigil"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of when to use this context"
                />
              </div>
              <div>
                <Label htmlFor="community_info">Community Information</Label>
                <Textarea
                  id="community_info"
                  value={formData.community_info}
                  onChange={(e) => setFormData({ ...formData, community_info: e.target.value })}
                  placeholder="General information about the community or occasion"
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={editingContext ? handleUpdateContext : handleCreateContext}
                  className="flex-1"
                >
                  {editingContext ? 'Update Context' : 'Create Context'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {contexts.map((context) => (
          <Card key={context.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{context.name}</CardTitle>
                  {context.is_default && (
                    <Badge variant="secondary" className="text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(context)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!context.is_default && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteContext(context.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {context.description && (
                <p className="text-sm text-muted-foreground">{context.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {context.community_info && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Community Info</Label>
                    <p className="text-sm mt-1">{context.community_info}</p>
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  {context.sacraments_received.length > 0 && (
                    <Badge variant="outline">
                      {context.sacraments_received.length} Sacraments
                    </Badge>
                  )}
                  {context.deaths_this_week.length > 0 && (
                    <Badge variant="outline">
                      {context.deaths_this_week.length} Deaths
                    </Badge>
                  )}
                  {context.sick_members.length > 0 && (
                    <Badge variant="outline">
                      {context.sick_members.length} Sick Members
                    </Badge>
                  )}
                  {context.special_petitions.length > 0 && (
                    <Badge variant="outline">
                      {context.special_petitions.length} Special Petitions
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contexts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No contexts found. Create your first context to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}