'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface PetitionContextTemplate {
  id: string
  name: string
  description?: string
  community_info: string
  sacraments_received: any[]
  deaths_this_week: any[]
  sick_members: any[]
  special_petitions: any[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CreateContextData {
  name: string
  description?: string
  community_info: string
  sacraments_received: any[]
  deaths_this_week: any[]
  sick_members: any[]
  special_petitions: any[]
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
    .order('is_default', { ascending: false })
    .order('name', { ascending: true })

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
        name: contextData.name,
        description: contextData.description,
        community_info: contextData.community_info,
        sacraments_received: contextData.sacraments_received,
        deaths_this_week: contextData.deaths_this_week,
        sick_members: contextData.sick_members,
        special_petitions: contextData.special_petitions,
        is_default: false
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
      name: contextData.name,
      description: contextData.description,
      community_info: contextData.community_info,
      sacraments_received: contextData.sacraments_received,
      deaths_this_week: contextData.deaths_this_week,
      sick_members: contextData.sick_members,
      special_petitions: contextData.special_petitions,
      updated_at: new Date().toISOString()
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
    .eq('is_default', false) // Only allow deletion of non-default contexts

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