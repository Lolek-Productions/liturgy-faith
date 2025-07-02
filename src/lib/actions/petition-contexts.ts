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
  context: Record<string, unknown>
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
        context: JSON.stringify(contextData.context)
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
      context: JSON.stringify(contextData.context)
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

  // Create default contexts
  const defaultContexts = [
    {
      title: 'Sunday Mass',
      description: 'Standard Sunday Mass petitions',
      context: {
        name: 'Sunday Mass',
        community_info: 'Regular Sunday celebration with the parish community. Include any weekly announcements, community events, or ongoing parish needs.',
        sacraments_received: [],
        deaths_this_week: [],
        sick_members: [],
        special_petitions: []
      }
    },
    {
      title: 'Wedding Ceremony',
      description: 'Wedding celebration petitions',
      context: {
        name: 'Wedding Ceremony',
        community_info: 'Celebration of marriage between [Bride Name] and [Groom Name]. We pray for their new union and for all married couples in our community.',
        sacraments_received: [],
        deaths_this_week: [],
        sick_members: [],
        special_petitions: []
      }
    },
    {
      title: 'Funeral Mass',
      description: 'Funeral Mass petitions',
      context: {
        name: 'Funeral Mass',
        community_info: 'Memorial service for [Deceased Name]. We pray for their eternal rest and for comfort for their family and friends during this time of grief.',
        sacraments_received: [],
        deaths_this_week: [],
        sick_members: [],
        special_petitions: []
      }
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
          context: JSON.stringify(contextData.context)
        }
      ])
  }
}