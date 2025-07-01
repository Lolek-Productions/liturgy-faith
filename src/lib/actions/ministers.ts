'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateMinisterData, Minister } from '@/lib/types'
import { redirect } from 'next/navigation'

export async function createMinister(data: CreateMinisterData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: minister, error } = await supabase
    .from('ministers')
    .insert([
      {
        user_id: user.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        availability: data.availability || {},
        notes: data.notes,
        is_active: data.is_active ?? true,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create minister')
  }

  return minister
}

export async function getMinisters(): Promise<Minister[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('ministers')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (error) {
    // If table doesn't exist yet, return empty array
    if (error.message?.includes('relation "public.ministers" does not exist')) {
      console.warn('Ministers table not yet created. Please run database migrations.')
      return []
    }
    throw new Error('Failed to fetch ministers')
  }

  return data || []
}

export async function getMinister(id: string): Promise<Minister | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('ministers')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function updateMinister(id: string, data: CreateMinisterData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: minister, error } = await supabase
    .from('ministers')
    .update({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      availability: data.availability || {},
      notes: data.notes,
      is_active: data.is_active ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update minister')
  }

  return minister
}

export async function deleteMinister(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('ministers')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to delete minister')
  }
}