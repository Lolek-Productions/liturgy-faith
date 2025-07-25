'use server'

import { createClient } from '@/lib/supabase/server'
import { requireSelectedParish } from '@/lib/auth/parish'
import { ensureJWTClaims } from '@/lib/auth/jwt-claims'
import { 
  DEFAULT_PETITION_CONTEXT_SUNDAY_ENGLISH,
  DEFAULT_PETITION_CONTEXT_SUNDAY_SPANISH,
  DEFAULT_PETITION_CONTEXT_DAILY,
  DEFAULT_PETITION_CONTEXT_WEDDING_ENGLISH,
  DEFAULT_PETITION_CONTEXT_WEDDING_SPANISH,
  DEFAULT_PETITION_CONTEXT_FUNERAL_ENGLISH,
  DEFAULT_PETITION_CONTEXT_FUNERAL_SPANISH
} from '@/lib/constants'

export interface PetitionContextTemplate {
  id: string
  title: string
  description?: string
  context: string // JSON string containing the full context data
  parish_id: string
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
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('petition_contexts')
    .select('*')
    .order('title', { ascending: true })

  if (error) {
    throw new Error('Failed to fetch petition contexts')
  }

  return data || []
}

export async function createPetitionContext(contextData: CreateContextData): Promise<PetitionContextTemplate> {
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('petition_contexts')
    .insert([
      {
        parish_id: selectedParishId,
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
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('petition_contexts')
    .update({
      title: contextData.title,
      description: contextData.description,
      context: contextData.context
    })
    .eq('id', contextData.id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update petition context')
  }

  return data
}

export async function deletePetitionContext(contextId: string): Promise<void> {
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()
  const supabase = await createClient()

  const { error } = await supabase
    .from('petition_contexts')
    .delete()
    .eq('id', contextId)

  if (error) {
    throw new Error('Failed to delete petition context')
  }
}

export async function getPetitionContext(contextId: string): Promise<PetitionContextTemplate | null> {
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('petition_contexts')
    .select('*')
    .eq('id', contextId)
    .single()

  if (error) {
    return null
  }

  return data
}

export async function getPetitionContextById(contextId: string): Promise<PetitionContextTemplate | null> {
  return getPetitionContext(contextId)
}


// Function to clean up invalid contexts
export async function cleanupInvalidContexts(): Promise<void> {
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()
  const supabase = await createClient()

  // Remove contexts with empty titles or invalid context data
  await supabase
    .from('petition_contexts')
    .delete()
    .or('title.is.null,title.eq.,context.is.null,context.eq.')
}

// Function to ensure parish has default contexts
export async function ensureDefaultContexts(): Promise<void> {
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()
  const supabase = await createClient()

  // First clean up any invalid contexts
  await cleanupInvalidContexts()

  // Check if parish already has valid contexts
  const { data: existingContexts } = await supabase
    .from('petition_contexts')
    .select('id')
    .not('title', 'is', null)
    .not('title', 'eq', '')
    .not('context', 'is', null)
    .not('context', 'eq', '')
    .limit(1)

  if (existingContexts && existingContexts.length > 0) {
    return // Parish already has valid contexts
  }

  // Create default contexts with simple text
  const defaultContexts = [
    {
      title: 'Sunday Mass (English)',
      description: 'Standard Sunday Mass petitions in English',
      context: DEFAULT_PETITION_CONTEXT_SUNDAY_ENGLISH
    },
    {
      title: 'Sunday Mass (Spanish)',
      description: 'Standard Sunday Mass petitions in Spanish',
      context: DEFAULT_PETITION_CONTEXT_SUNDAY_SPANISH
    },
    {
      title: 'Daily Mass',
      description: 'Weekday Mass petitions',
      context: DEFAULT_PETITION_CONTEXT_DAILY
    },
    {
      title: 'Wedding (English)',
      description: 'Wedding ceremony petitions in English',
      context: DEFAULT_PETITION_CONTEXT_WEDDING_ENGLISH
    },
    {
      title: 'Wedding (Spanish)',
      description: 'Wedding ceremony petitions in Spanish',
      context: DEFAULT_PETITION_CONTEXT_WEDDING_SPANISH
    },
    {
      title: 'Funeral (English)',
      description: 'Funeral Mass petitions in English',
      context: DEFAULT_PETITION_CONTEXT_FUNERAL_ENGLISH
    },
    {
      title: 'Funeral (Spanish)',
      description: 'Funeral Mass petitions in Spanish',
      context: DEFAULT_PETITION_CONTEXT_FUNERAL_SPANISH
    }
  ]

  for (const contextData of defaultContexts) {
    await supabase
      .from('petition_contexts')
      .insert([
        {
          parish_id: selectedParishId,
          title: contextData.title,
          description: contextData.description,
          context: contextData.context
        }
      ])
  }
}