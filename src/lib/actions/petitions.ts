'use server'

import { createClient } from '@/lib/supabase/server'
import { CreatePetitionData, Petition, PetitionContext } from '@/lib/types'
import { redirect } from 'next/navigation'
import { getPromptTemplate } from '@/lib/actions/definitions'
import { replaceTemplateVariables, getTemplateVariables } from '@/lib/template-utils'
import { getPetitionContext } from './petition-contexts'
import { requireSelectedParish } from '@/lib/auth/parish'

export async function createBasicPetition(data: { title: string; date: string }) {
  const supabase = await createClient()
  
  const selectedParishId = await requireSelectedParish()

  const { data: petition, error: petitionError } = await supabase
    .from('petitions')
    .insert([
      {
        parish_id: selectedParishId,
        title: data.title,
        date: data.date,
        language: 'english', // Default, will be set in wizard
        generated_content: null, // Will be generated in wizard
        context: null, // Will be set in wizard
      },
    ])
    .select()
    .single()

  if (petitionError) {
    throw new Error('Failed to create petition')
  }

  return petition
}

export async function createPetition(data: CreatePetitionData) {
  const supabase = await createClient()
  
  const selectedParishId = await requireSelectedParish()

  // If a context ID is provided, get the full context data
  let contextData = null
  if (data.contextId) {
    const template = await getPetitionContext(data.contextId)
    if (template) {
      try {
        const parsedContext = JSON.parse(template.context)
        contextData = {
          name: parsedContext.name || template.title,
          description: template.description,
          community_info: data.community_info, // Use the custom community info from the form
          sacraments_received: parsedContext.sacraments_received || [],
          deaths_this_week: parsedContext.deaths_this_week || [],
          sick_members: parsedContext.sick_members || [],
          special_petitions: parsedContext.special_petitions || []
        }
      } catch {
        // Fallback if parsing fails
        contextData = {
          name: template.title,
          description: template.description,
          community_info: data.community_info,
          sacraments_received: [],
          deaths_this_week: [],
          sick_members: [],
          special_petitions: []
        }
      }
    }
  } else {
    // Create a basic context with just community info
    contextData = {
      name: 'Custom Context',
      community_info: data.community_info,
      sacraments_received: [],
      deaths_this_week: [],
      sick_members: [],
      special_petitions: []
    }
  }

  const generatedContent = await generatePetitionContent(data)

  const { data: petition, error: petitionError } = await supabase
    .from('petitions')
    .insert([
      {
        parish_id: selectedParishId,
        title: data.title,
        date: data.date,
        language: data.language,
        generated_content: generatedContent,
        context: contextData ? JSON.stringify(contextData) : null,
      },
    ])
    .select()
    .single()

  if (petitionError) {
    throw new Error('Failed to create petition')
  }

  return petition
}

export async function getPetitions(): Promise<Petition[]> {
  const supabase = await createClient()
  
  await requireSelectedParish()

  const { data, error } = await supabase
    .from('petitions')
    .select('*')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch petitions')
  }

  return data || []
}

export async function getPetition(id: string): Promise<Petition | null> {
  const supabase = await createClient()
  
  await requireSelectedParish()

  const { data, error } = await supabase
    .from('petitions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function getSavedContexts(): Promise<Array<{id: string, name: string, community_info: string}>> {
  const supabase = await createClient()
  
  await requireSelectedParish()

  const { data, error } = await supabase
    .from('petition_contexts')
    .select(`
      id,
      community_info,
      petition_id,
      petitions (
        title,
        date
      )
    `)
    .neq('community_info', '')
    .not('petitions', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch saved contexts')
  }

  return (data || []).map(item => {
    const typedItem = item as unknown as { 
      id: string; 
      community_info: string; 
      petitions: { title: string; date: string } | null 
    }
    
    if (!typedItem.petitions) {
      return null
    }
    
    return {
      id: typedItem.id,
      name: `${typedItem.petitions.title} - ${new Date(typedItem.petitions.date).toLocaleDateString()}`,
      community_info: typedItem.community_info
    }
  }).filter(Boolean) as Array<{id: string, name: string, community_info: string}>
}

export async function getPetitionWithContext(id: string): Promise<{ petition: Petition; context: PetitionContext } | null> {
  const supabase = await createClient()
  
  await requireSelectedParish()

  const { data: petition, error: petitionError } = await supabase
    .from('petitions')
    .select('*')
    .eq('id', id)
    .single()

  if (petitionError || !petition) {
    return null
  }

  const { data: context, error: contextError } = await supabase
    .from('petition_contexts')
    .select('*')
    .eq('petition_id', id)
    .single()

  if (contextError || !context) {
    return null
  }

  return { petition, context }
}

export async function updatePetition(id: string, data: CreatePetitionData) {
  const supabase = await createClient()
  
  await requireSelectedParish()

  const generatedContent = await generatePetitionContent(data)

  const { data: petition, error: petitionError } = await supabase
    .from('petitions')
    .update({
      title: data.title,
      date: data.date,
      language: data.language,
      generated_content: generatedContent,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (petitionError) {
    throw new Error('Failed to update petition')
  }

  const { error: contextError } = await supabase
    .from('petition_contexts')
    .update({
      community_info: data.community_info,
      updated_at: new Date().toISOString(),
    })
    .eq('petition_id', id)

  if (contextError) {
    throw new Error('Failed to update petition context')
  }

  return petition
}

export async function generatePetitionContent(data: CreatePetitionData): Promise<string> {
  // Get the user's custom prompt template
  const template = await getPromptTemplate()
  
  // Replace template variables with actual values
  const variables = getTemplateVariables(data)
  const prompt = replaceTemplateVariables(template, variables)
  

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      console.warn('Claude API Error:', response.status, response.statusText, '- Using fallback template')
      // Fall through to fallback template instead of throwing
    } else {
      const result = await response.json()
      return result.content[0].text
    }
  } catch (error) {
    console.warn('Error generating petitions:', error instanceof Error ? error.message : 'Unknown error', '- Using fallback template')
    // Fall through to fallback template instead of throwing
  }

  // Fallback template when API fails
  return `${data.title}\n\nFor all bishops, the successors of the Apostles, may the Holy Spirit protect and guide them, let us pray to the Lord.\n\nFor government leaders, may God give them wisdom to work for justice and to protect the lives of the innocent, let us pray to the Lord.\n\nFor those who do not know Christ, may the Holy Spirit bring them to recognize his love and goodness, let us pray to the Lord.\n\nFor this community gathered here, may Christ grant us strength to proclaim him boldly, let us pray to the Lord.\n\nFor the intentions that we hold in the silence of our hearts (PAUSE 2-3 seconds), and for those written in our book of intentions, let us pray to the Lord.`
}

export async function updatePetitionLanguage(petitionId: string, language: string) {
  const supabase = await createClient()
  
  await requireSelectedParish()

  const { error } = await supabase
    .from('petitions')
    .update({ language })
    .eq('id', petitionId)

  if (error) {
    throw new Error('Failed to update petition language')
  }
}

export async function updatePetitionContext(petitionId: string, context: string) {
  const supabase = await createClient()
  
  await requireSelectedParish()

  const { error } = await supabase
    .from('petitions')
    .update({ context })
    .eq('id', petitionId)

  if (error) {
    throw new Error('Failed to update petition context')
  }
}

export async function updatePetitionContent(petitionId: string, content: string) {
  const supabase = await createClient()
  
  await requireSelectedParish()

  const { error } = await supabase
    .from('petitions')
    .update({ generated_content: content })
    .eq('id', petitionId)

  if (error) {
    throw new Error('Failed to update petition content')
  }
}

