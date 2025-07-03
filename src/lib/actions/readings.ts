'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface Reading {
  id: string
  categories: string[] | null
  created_at: string
  language: string | null
  lectionary_id: string | null
  pericope: string | null
  text: string | null
  user_id: string | null
}

export interface CreateReadingData {
  categories?: string[]
  language?: string
  lectionary_id?: string
  pericope: string
  text: string
}

export async function createReading(data: CreateReadingData): Promise<Reading> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: reading, error } = await supabase
    .from('readings')
    .insert([
      {
        user_id: user.id,
        categories: data.categories || null,
        language: data.language || null,
        lectionary_id: data.lectionary_id || null,
        pericope: data.pericope,
        text: data.text,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create reading')
  }

  return reading
}

export async function getReadings(): Promise<Reading[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch readings')
  }

  return data || []
}

export async function getReading(id: string): Promise<Reading | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function updateReading(id: string, data: CreateReadingData): Promise<Reading> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: reading, error } = await supabase
    .from('readings')
    .update({
      categories: data.categories || null,
      language: data.language || null,
      lectionary_id: data.lectionary_id || null,
      pericope: data.pericope,
      text: data.text,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update reading')
  }

  return reading
}

export async function deleteReading(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('readings')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to delete reading')
  }
}

export async function getReadingsByCategory(category: string): Promise<Reading[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('user_id', user.id)
    .contains('categories', [category])
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch readings by category')
  }

  return data || []
}

export async function getReadingsByLanguage(language: string): Promise<Reading[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('user_id', user.id)
    .eq('language', language)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch readings by language')
  }

  return data || []
}