'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateCalendarEntryData, LiturgicalCalendarEntry } from '@/lib/types'
import { redirect } from 'next/navigation'

export async function createCalendarEntry(data: CreateCalendarEntryData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: entry, error } = await supabase
    .from('liturgical_calendar')
    .insert([
      {
        user_id: user.id,
        title: data.title,
        date: data.date,
        liturgical_season: data.liturgical_season,
        liturgical_rank: data.liturgical_rank,
        color: data.color,
        readings: data.readings || [],
        special_prayers: data.special_prayers || [],
        notes: data.notes,
        is_custom: data.is_custom ?? true,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create calendar entry')
  }

  return entry
}

export async function getCalendarEntries(): Promise<LiturgicalCalendarEntry[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('liturgical_calendar')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  if (error) {
    throw new Error('Failed to fetch calendar entries')
  }

  return data || []
}

export async function getCalendarEntry(id: string): Promise<LiturgicalCalendarEntry | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('liturgical_calendar')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function updateCalendarEntry(id: string, data: CreateCalendarEntryData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: entry, error } = await supabase
    .from('liturgical_calendar')
    .update({
      title: data.title,
      date: data.date,
      liturgical_season: data.liturgical_season,
      liturgical_rank: data.liturgical_rank,
      color: data.color,
      readings: data.readings || [],
      special_prayers: data.special_prayers || [],
      notes: data.notes,
      is_custom: data.is_custom ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update calendar entry')
  }

  return entry
}

export async function deleteCalendarEntry(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('liturgical_calendar')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to delete calendar entry')
  }
}

export async function getUpcomingEvents(limit = 10): Promise<LiturgicalCalendarEntry[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('liturgical_calendar')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(limit)

  if (error) {
    throw new Error('Failed to fetch upcoming events')
  }

  return data || []
}