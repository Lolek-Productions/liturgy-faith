'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FormField } from '@/components/ui/form-field'
import { Info, Save, RotateCcw } from 'lucide-react'
import { savePromptTemplate, getPromptTemplate } from '@/lib/actions/definitions'
import { getDefaultPromptTemplate } from '@/lib/template-utils'

const TEMPLATE_VARIABLES = [
  { name: '{{TITLE}}', description: 'The title of the petition set' },
  { name: '{{LANGUAGE}}', description: 'The language for the petitions (English, Spanish, French, Latin)' },
  { name: '{{COMMUNITY_CONTEXT}}', description: 'The community information provided by the user' },
]

export default function DefinitionsPage() {
  const [promptTemplate, setPromptTemplate] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Load saved template from server
    const loadTemplate = async () => {
      try {
        const template = await getPromptTemplate()
        setPromptTemplate(template)
      } catch (err) {
        console.error('Failed to load template:', err)
        setPromptTemplate(getDefaultPromptTemplate())
      } finally {
        setInitialLoading(false)
      }
    }
    loadTemplate()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await savePromptTemplate(promptTemplate)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save template. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPromptTemplate(getDefaultPromptTemplate())
    setSuccess(false)
    setError('')
  }

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Petition Definitions</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Petition Definitions</h1>
        <p className="text-muted-foreground mt-2">
          Customize the AI prompt template used to generate liturgical petitions.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Template Variables:</strong> Use the following placeholders in your template:
          <ul className="mt-2 space-y-1">
            {TEMPLATE_VARIABLES.map((variable) => (
              <li key={variable.name} className="text-sm">
                <code className="bg-muted px-1 rounded">{variable.name}</code> - {variable.description}
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Prompt Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            id="promptTemplate"
            label="AI Prompt Template"
            type="textarea"
            value={promptTemplate}
            onChange={setPromptTemplate}
            rows={25}
            placeholder="Enter your prompt template here..."
            className="font-mono text-sm"
            resize={true}
          />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>Template saved successfully!</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Template'}
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}