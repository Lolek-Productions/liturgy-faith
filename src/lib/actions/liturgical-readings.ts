'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { LiturgicalReading, CreateLiturgicalReadingData } from '@/lib/types'

export async function createLiturgicalReading(data: CreateLiturgicalReadingData): Promise<LiturgicalReading> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: liturgicalReading, error } = await supabase
    .from('liturgical_readings')
    .insert([
      {
        user_id: user.id,
        title: data.title,
        description: data.description || null,
        date: data.date || null,
        first_reading: data.first_reading || null,
        responsorial_psalm: data.responsorial_psalm || null,
        second_reading: data.second_reading || null,
        gospel_reading: data.gospel_reading || null,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create liturgical reading')
  }

  return liturgicalReading
}

export async function getLiturgicalReadings(): Promise<LiturgicalReading[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('liturgical_readings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch liturgical readings')
  }

  return data || []
}

export async function getLiturgicalReading(id: string): Promise<LiturgicalReading | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('liturgical_readings')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function updateLiturgicalReading(id: string, data: CreateLiturgicalReadingData): Promise<LiturgicalReading> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: liturgicalReading, error } = await supabase
    .from('liturgical_readings')
    .update({
      title: data.title,
      description: data.description || null,
      date: data.date || null,
      first_reading: data.first_reading || null,
      responsorial_psalm: data.responsorial_psalm || null,
      second_reading: data.second_reading || null,
      gospel_reading: data.gospel_reading || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update liturgical reading')
  }

  return liturgicalReading
}

export async function deleteLiturgicalReading(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('liturgical_readings')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to delete liturgical reading')
  }
}