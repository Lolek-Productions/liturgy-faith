'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RotateCcw } from "lucide-react"
import { useBreadcrumbs } from '@/components/breadcrumb-context'
import { getPetitionSettings, updatePetitionSettings } from '@/lib/actions/petition-settings'

interface PetitionSettings {
  daily_mass: string
  sunday_mass: string
  wedding: string
  funeral: string
}

const defaultSettings: PetitionSettings = {
  daily_mass: `For our Holy Father, Pope Francis, our Bishop, and all the clergy.
For peace in our world and an end to all violence and hatred.
For the sick, the suffering, and those who care for them.
For our deceased brothers and sisters, especially those who have recently died.
For our community and all our intentions.`,
  
  sunday_mass: `For our Holy Father, Pope Francis, our Bishop, and all the clergy.
For our nation's leaders and all who serve in public office.
For peace in our world and protection of the innocent.
For the unemployed and those struggling with financial hardship.
For the sick and those who minister to them.
For our young people and all who guide them.
For our deceased parishioners and all who have gone before us.
For our parish community and all our special intentions.`,
  
  wedding: `For [Bride's Name] and [Groom's Name], that their love may grow stronger each day.
For their families, that they may be united in joy and support.
For all married couples, that they may be examples of faithful love.
For engaged couples preparing for marriage.
For the Church, that we may be a community of love and welcome.
For all who are seeking their life partners.
For our deceased family members who would have rejoiced in this celebration.`,
  
  funeral: `For [Name of Deceased], that they may rest in eternal peace.
For the family and friends who mourn, that they may find comfort in God's love.
For all the faithful departed, especially those who have no one to pray for them.
For those who minister to the grieving and dying.
For our community, that we may support one another in times of loss.
For all who are sick and approaching death.
For ourselves, that we may be prepared for our own journey to eternal life.`
}

export default function PetitionSettingsPage() {
  const [settings, setSettings] = useState<PetitionSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('daily_mass')
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings", href: "/settings" },
      { label: "Petition Settings" }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getPetitionSettings()
        if (data) {
          setSettings(data)
        }
      } catch (error) {
        console.error('Failed to load petition settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePetitionSettings(settings)
      // TODO: Add success notification
    } catch (error) {
      console.error('Failed to save petition settings:', error)
      // TODO: Add error notification
    } finally {
      setSaving(false)
    }
  }

  const handleReset = (type: keyof PetitionSettings) => {
    setSettings(prev => ({
      ...prev,
      [type]: defaultSettings[type]
    }))
  }

  const handleTextChange = (type: keyof PetitionSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [type]: value
    }))
  }

  if (loading) {
    return <div className="space-y-8">Loading...</div>
  }

  const tabs = [
    { id: 'daily_mass', label: 'Daily Mass', description: 'Standard petitions for weekday liturgies' },
    { id: 'sunday_mass', label: 'Sunday Mass', description: 'Enhanced petitions for Sunday celebrations' },
    { id: 'wedding', label: 'Wedding', description: 'Special petitions for wedding ceremonies' },
    { id: 'funeral', label: 'Funeral', description: 'Consoling petitions for funeral liturgies' }
  ] as const

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Petition Settings</h1>
          <p className="text-muted-foreground">
            Configure default petition templates for different types of liturgical celebrations.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Petition Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                These templates will be used as defaults when creating new petitions. You can customize them for your parish&apos;s specific needs.
              </p>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{tab.label} Petitions</h3>
                        <p className="text-sm text-muted-foreground">{tab.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReset(tab.id as keyof PetitionSettings)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Default
                      </Button>
                    </div>
                    
                    <Textarea
                      value={settings[tab.id as keyof PetitionSettings]}
                      onChange={(e) => handleTextChange(tab.id as keyof PetitionSettings, e.target.value)}
                      placeholder={`Enter ${tab.label.toLowerCase()} petitions...`}
                      className="min-h-[300px] font-mono text-sm"
                    />
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {settings[tab.id as keyof PetitionSettings].split('\n').filter(line => line.trim()).length} petitions
                      </Badge>
                      <Badge variant="outline">
                        {settings[tab.id as keyof PetitionSettings].length} characters
                      </Badge>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Formatting Tips</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Each line represents one petition</li>
                  <li>• Use placeholder text like [Name] for customization</li>
                  <li>• Keep petitions concise and clear</li>
                  <li>• Follow traditional liturgical language</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Wedding Placeholders</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• [Bride&apos;s Name] - Bride&apos;s first name</li>
                  <li>• [Groom&apos;s Name] - Groom&apos;s first name</li>
                  <li>• [Couple&apos;s Names] - Both names</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Funeral Placeholders</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• [Name of Deceased] - Full name</li>
                  <li>• [First Name] - First name only</li>
                  <li>• [He/She] - Gender pronoun</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tabs.map((tab) => (
                <div key={tab.id} className="flex justify-between items-center">
                  <span className="text-sm">{tab.label}</span>
                  <Badge variant="secondary">
                    {settings[tab.id as keyof PetitionSettings].split('\n').filter(line => line.trim()).length}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}