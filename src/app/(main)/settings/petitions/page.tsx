'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Save } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { 
  getPetitionContexts, 
  createPetitionContext, 
  updatePetitionContext, 
  deletePetitionContext,
  PetitionContextTemplate,
  CreateContextData,
  UpdateContextData,
} from '@/lib/actions/petition-contexts'
import { getPetitionTextFromContext } from '@/lib/petition-context-utils'
import { 
  getPetitionContextSettings, 
  updateAllPetitionContextSettings,
  deletePetitionContextSetting
} from '@/lib/actions/petition-settings'

interface PetitionContextSettings {
  [key: string]: string
}

export default function PetitionSettingsPage() {
  const [contexts, setContexts] = useState<PetitionContextTemplate[]>([])
  const [contextSettings, setContextSettings] = useState<PetitionContextSettings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContext, setEditingContext] = useState<PetitionContextTemplate | null>(null)
  const [formData, setFormData] = useState<CreateContextData>({
    title: '',
    description: '',
    context: ''
  })
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings", href: "/settings" },
      { label: "Petition Settings" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    loadContexts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadContexts = async () => {
    try {
      await ensureInitialContexts()
      const data = await getPetitionContexts()
      setContexts(data)
      
      // Load saved petition settings from database
      const savedSettings = await getPetitionContextSettings()
      
      // Initialize context settings with saved data or defaults from context data
      const initialSettings: PetitionContextSettings = {}
      data.forEach(context => {
        initialSettings[context.id] = savedSettings[context.id] || getPetitionTextFromContext(context.context) || getDefaultPetitionsForContext(context.title)
      })
      setContextSettings(initialSettings)
      
      // Save defaults for new contexts that don't have saved settings
      const hasNewDefaults = data.some(context => !savedSettings[context.id])
      if (hasNewDefaults) {
        await updateAllPetitionContextSettings(initialSettings)
      }
    } catch (error) {
      console.error('Failed to load contexts:', error)
    } finally {
      setLoading(false)
    }
  }

  const ensureInitialContexts = async () => {
    const existingContexts = await getPetitionContexts()
    
    if (existingContexts.length === 0) {
      // Create the 4 initial contexts with simple text
      const initialContexts = [
        {
          title: 'Sunday Mass',
          description: 'Standard Sunday Mass petitions',
          context: getDefaultPetitionsForContext('Sunday Mass')
        },
        {
          title: 'Daily Mass',
          description: 'Weekday Mass petitions',
          context: getDefaultPetitionsForContext('Daily Mass')
        },
        {
          title: 'Wedding',
          description: 'Wedding ceremony petitions',
          context: getDefaultPetitionsForContext('Wedding')
        },
        {
          title: 'Funeral',
          description: 'Funeral Mass petitions',
          context: getDefaultPetitionsForContext('Funeral')
        }
      ]

      for (const contextData of initialContexts) {
        await createPetitionContext(contextData)
      }
    }
  }

  const getDefaultPetitionsForContext = (title: string): string => {
    const defaults: { [key: string]: string } = {
      'Sunday Mass': `For our Holy Father, Pope Francis, our Bishop, and all the clergy.
For our nation's leaders and all who serve in public office.
For peace in our world and protection of the innocent.
For the unemployed and those struggling with financial hardship.
For the sick and those who minister to them.
For our young people and all who guide them.
For our deceased parishioners and all who have gone before us.
For our parish community and all our special intentions.`,
      
      'Daily Mass': `For our Holy Father, Pope Francis, our Bishop, and all the clergy.
For peace in our world and an end to all violence and hatred.
For the sick, the suffering, and those who care for them.
For our deceased brothers and sisters, especially those who have recently died.
For our community and all our intentions.`,
      
      'Wedding': `For [Bride's Name] and [Groom's Name], that their love may grow stronger each day.
For their families, that they may be united in joy and support.
For all married couples, that they may be examples of faithful love.
For engaged couples preparing for marriage.
For the Church, that we may be a community of love and welcome.
For all who are seeking their life partners.
For our deceased family members who would have rejoiced in this celebration.`,
      
      'Funeral': `For [Name of Deceased], that they may rest in eternal peace.
For the family and friends who mourn, that they may find comfort in God's love.
For all the faithful departed, especially those who have no one to pray for them.
For those who minister to the grieving and dying.
For our community, that we may support one another in times of loss.
For all who are sick and approaching death.
For ourselves, that we may be prepared for our own journey to eternal life.`
    }
    
    return defaults[title] || `For our community and all our intentions.
For peace in our world.
For the sick and suffering.
For our deceased brothers and sisters.`
  }

  const handleCreateContext = async () => {
    try {
      const defaultPetitionText = formData.context || getDefaultPetitionsForContext(formData.title)
      const contextDataWithDefaults = {
        ...formData,
        context: defaultPetitionText
      }
      const newContext = await createPetitionContext(contextDataWithDefaults)
      setContextSettings(prev => ({
        ...prev,
        [newContext.id]: defaultPetitionText
      }))
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
      await deletePetitionContextSetting()
      setContextSettings(prev => {
        const newSettings = { ...prev }
        delete newSettings[contextId]
        return newSettings
      })
      loadContexts()
    } catch (error) {
      console.error('Failed to delete context:', error)
    }
  }

  const handleSaveAllSettings = async () => {
    setSaving(true)
    try {
      await updateAllPetitionContextSettings(contextSettings)
      // TODO: Add success notification
    } catch (error) {
      console.error('Failed to save petition settings:', error)
      // TODO: Add error notification
    } finally {
      setSaving(false)
    }
  }

  const openEditDialog = (context: PetitionContextTemplate) => {
    setEditingContext(context)
    setFormData({
      title: context.title,
      description: context.description || '',
      context: getPetitionTextFromContext(context.context)
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      context: ''
    })
    setEditingContext(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const handlePetitionTextChange = (contextId: string, value: string) => {
    setContextSettings(prev => ({
      ...prev,
      [contextId]: value
    }))
  }

  if (loading) {
    return <div className="space-y-8">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Petition Settings</h1>
          <p className="text-muted-foreground">
            Configure petition templates for your liturgical celebrations. Create custom contexts as needed.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveAllSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={openCreateDialog}>
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
                  <Label htmlFor="context">Default Petition Text</Label>
                  <Textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      context: e.target.value
                    })}
                    placeholder="Enter the default petition text for this context..."
                    className="min-h-[200px] font-mono text-sm"
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
      </div>

      <div className="grid gap-6">
        {contexts.map((context) => {
          return (
            <Card key={context.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{context.title}</CardTitle>
                    {context.description && (
                      <p className="text-sm text-muted-foreground mt-1">{context.description}</p>
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteContext(context.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Default Petitions</Label>
                  <Textarea
                    value={contextSettings[context.id] || ''}
                    onChange={(e) => handlePetitionTextChange(context.id, e.target.value)}
                    placeholder={`Enter ${context.title.toLowerCase()} petitions...`}
                    className="min-h-[200px] font-mono text-sm mt-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {(contextSettings[context.id] || '').split('\n').filter(line => line.trim()).length} petitions
                  </Badge>
                  <Badge variant="outline">
                    {(contextSettings[context.id] || '').length} characters
                  </Badge>
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