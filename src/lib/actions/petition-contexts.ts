'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface PetitionContextTemplate {
  id: string
  title: string
  description?: string
  context: string // JSON string containing the full context data
  user_id: string
  created_at: string
  updated_at: string
}

export type { ContextData } from '@/lib/petition-context-utils'

export interface CreateContextData {
  title: string
  description?: string
  context: string
}

export interface UpdateContextData extends CreateContextData {
  id: string
}

export async function getPetitionContexts(): Promise<PetitionContextTemplate[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('petition_contexts')
    .select('*')
    .eq('user_id', user.id)
    .order('title', { ascending: true })

  if (error) {
    throw new Error('Failed to fetch petition contexts')
  }

  return data || []
}

export async function createPetitionContext(contextData: CreateContextData): Promise<PetitionContextTemplate> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('petition_contexts')
    .insert([
      {
        user_id: user.id,
        title: contextData.title,
        description: contextData.description,
        context: contextData.context
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create petition context')
  }

  return data
}

export async function updatePetitionContext(contextData: UpdateContextData): Promise<PetitionContextTemplate> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('petition_contexts')
    .update({
      title: contextData.title,
      description: contextData.description,
      context: contextData.context
    })
    .eq('id', contextData.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update petition context')
  }

  return data
}

export async function deletePetitionContext(contextId: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('petition_contexts')
    .delete()
    .eq('id', contextId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to delete petition context')
  }
}

export async function getPetitionContext(contextId: string): Promise<PetitionContextTemplate | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('petition_contexts')
    .select('*')
    .eq('id', contextId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return null
  }

  return data
}


// Function to clean up invalid contexts
export async function cleanupInvalidContexts(): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return
  }

  // Remove contexts with empty titles or invalid context data
  await supabase
    .from('petition_contexts')
    .delete()
    .eq('user_id', user.id)
    .or('title.is.null,title.eq.,context.is.null,context.eq.')
}

// Function to ensure user has default contexts
export async function ensureDefaultContexts(): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return
  }

  // First clean up any invalid contexts
  await cleanupInvalidContexts()

  // Check if user already has valid contexts
  const { data: existingContexts } = await supabase
    .from('petition_contexts')
    .select('id')
    .eq('user_id', user.id)
    .not('title', 'is', null)
    .not('title', 'eq', '')
    .not('context', 'is', null)
    .not('context', 'eq', '')
    .limit(1)

  if (existingContexts && existingContexts.length > 0) {
    return // User already has valid contexts
  }

  // Create default contexts with simple text
  const defaultContexts = [
    {
      title: 'Sunday Mass',
      description: 'Standard Sunday Mass petitions',
      context: `For our Holy Father, Pope Francis, our Bishop, and all the clergy.
For our nation's leaders and all who serve in public office.
For peace in our world and protection of the innocent.
For the unemployed and those struggling with financial hardship.
For the sick and those who minister to them.
For our young people and all who guide them.
For our deceased parishioners and all who have gone before us.
For our parish community and all our special intentions.`
    },
    {
      title: 'Daily Mass',
      description: 'Weekday Mass petitions',
      context: `For our Holy Father, Pope Francis, our Bishop, and all the clergy.
For peace in our world and an end to all violence and hatred.
For the sick, the suffering, and those who care for them.
For our deceased brothers and sisters, especially those who have recently died.
For our community and all our intentions.`
    },
    {
      title: 'Wedding',
      description: 'Wedding ceremony petitions',
      context: `For [Bride's Name] and [Groom's Name], that their love may grow stronger each day.
For their families, that they may be united in joy and support.
For all married couples, that they may be examples of faithful love.
For engaged couples preparing for marriage.
For the Church, that we may be a community of love and welcome.
For all who are seeking their life partners.
For our deceased family members who would have rejoiced in this celebration.`
    },
    {
      title: 'Funeral',
      description: 'Funeral Mass petitions',
      context: `For [Name of Deceased], that they may rest in eternal peace.
For the family and friends who mourn, that they may find comfort in God's love.
For all the faithful departed, especially those who have no one to pray for them.
For those who minister to the grieving and dying.
For our community, that we may support one another in times of loss.
For all who are sick and approaching death.
For ourselves, that we may be prepared for our own journey to eternal life.`
    }
  ]

  for (const contextData of defaultContexts) {
    await supabase
      .from('petition_contexts')
      .insert([
        {
          user_id: user.id,
          title: contextData.title,
          description: contextData.description,
          context: contextData.context
        }
      ])
  }
}