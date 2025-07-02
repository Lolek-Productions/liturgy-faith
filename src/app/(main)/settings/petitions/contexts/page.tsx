'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { 
  getPetitionContexts, 
  createPetitionContext, 
  updatePetitionContext, 
  deletePetitionContext,
  PetitionContextTemplate,
  CreateContextData,
  UpdateContextData,
  ensureDefaultContexts,
  cleanupInvalidContexts
} from '@/lib/actions/petition-contexts'
import { parseContextData } from '@/lib/petition-context-utils'

export default function PetitionContextsPage() {
  const [contexts, setContexts] = useState<PetitionContextTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContext, setEditingContext] = useState<PetitionContextTemplate | null>(null)
  const [formData, setFormData] = useState<CreateContextData>({
    title: '',
    description: '',
    context: {
      name: '',
      community_info: '',
      sacraments_received: [],
      deaths_this_week: [],
      sick_members: [],
      special_petitions: []
    }
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
      await cleanupInvalidContexts()
      await ensureDefaultContexts()
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
    const contextData = parseContextData(context.context)
    if (contextData) {
      setFormData({
        title: context.title,
        description: context.description || '',
        context: contextData as unknown as Record<string, unknown>
      })
      setDialogOpen(true)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      context: {
        name: '',
        community_info: '',
        sacraments_received: [],
        deaths_this_week: [],
        sick_members: [],
        special_petitions: []
      }
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <Label htmlFor="name">Context Name</Label>
                <Input
                  id="name"
                  value={(formData.context.name as string) || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    context: { ...formData.context, name: e.target.value }
                  })}
                  placeholder="Internal name for this context"
                />
              </div>
              <div>
                <Label htmlFor="community_info">Community Information</Label>
                <Textarea
                  id="community_info"
                  value={(formData.context.community_info as string) || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    context: { ...formData.context, community_info: e.target.value }
                  })}
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
        {contexts
          .filter(context => {
            // Filter out contexts with empty titles or invalid context data
            if (!context.title || context.title.trim() === '') return false
            const contextData = parseContextData(context.context)
            return contextData !== null
          })
          .map((context) => {
            const contextData = parseContextData(context.context)!
            return (
              <Card key={context.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{context.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(context)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteContext(context.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {context.description && (
                    <p className="text-sm text-muted-foreground">{context.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contextData.community_info && (
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">Community Info</Label>
                        <p className="text-sm mt-1">{contextData.community_info}</p>
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {contextData.sacraments_received?.length > 0 && (
                        <Badge variant="outline">
                          {contextData.sacraments_received.length} Sacraments
                        </Badge>
                      )}
                      {contextData.deaths_this_week?.length > 0 && (
                        <Badge variant="outline">
                          {contextData.deaths_this_week.length} Deaths
                        </Badge>
                      )}
                      {contextData.sick_members?.length > 0 && (
                        <Badge variant="outline">
                          {contextData.sick_members.length} Sick Members
                        </Badge>
                      )}
                      {contextData.special_petitions?.length > 0 && (
                        <Badge variant="outline">
                          {contextData.special_petitions.length} Special Petitions
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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