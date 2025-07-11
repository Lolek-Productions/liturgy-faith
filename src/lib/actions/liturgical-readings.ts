'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { requireSelectedParish } from '@/lib/auth/parish'
import { ensureJWTClaims } from '@/lib/auth/jwt-claims'
import type { LiturgicalReading, CreateLiturgicalReadingData } from '@/lib/types'

export async function createLiturgicalReading(data: CreateLiturgicalReadingData): Promise<LiturgicalReading> {
  const supabase = await createClient()
  
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()

  const { data: liturgicalReading, error } = await supabase
    .from('liturgical_readings')
    .insert([
      {
        parish_id: selectedParishId,
        title: data.title,
        description: data.description || null,
        date: data.date || null,
        first_reading: data.first_reading || null,
        first_reading_lector: data.first_reading_lector || null,
        responsorial_psalm: data.responsorial_psalm || null,
        psalm_lector: data.psalm_lector || null,
        second_reading: data.second_reading || null,
        second_reading_lector: data.second_reading_lector || null,
        gospel_reading: data.gospel_reading || null,
        gospel_lector: data.gospel_lector || null,
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
  
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()

  const { data, error } = await supabase
    .from('liturgical_readings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch liturgical readings')
  }

  return data || []
}

export async function getLiturgicalReading(id: string): Promise<LiturgicalReading | null> {
  const supabase = await createClient()
  
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()

  const { data, error } = await supabase
    .from('liturgical_readings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function updateLiturgicalReading(id: string, data: Partial<CreateLiturgicalReadingData>): Promise<LiturgicalReading> {
  const supabase = await createClient()
  
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()

  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.description !== undefined) updateData.description = data.description || null
  if (data.date !== undefined) updateData.date = data.date || null
  if (data.first_reading !== undefined) updateData.first_reading = data.first_reading || null
  if (data.first_reading_lector !== undefined) updateData.first_reading_lector = data.first_reading_lector || null
  if (data.responsorial_psalm !== undefined) updateData.responsorial_psalm = data.responsorial_psalm || null
  if (data.psalm_lector !== undefined) updateData.psalm_lector = data.psalm_lector || null
  if (data.second_reading !== undefined) updateData.second_reading = data.second_reading || null
  if (data.second_reading_lector !== undefined) updateData.second_reading_lector = data.second_reading_lector || null
  if (data.gospel_reading !== undefined) updateData.gospel_reading = data.gospel_reading || null
  if (data.gospel_lector !== undefined) updateData.gospel_lector = data.gospel_lector || null

  const { data: liturgicalReading, error } = await supabase
    .from('liturgical_readings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update liturgical reading')
  }

  return liturgicalReading
}

export async function deleteLiturgicalReading(id: string): Promise<void> {
  const supabase = await createClient()
  
  const selectedParishId = await requireSelectedParish()
  await ensureJWTClaims()

  const { error } = await supabase
    .from('liturgical_readings')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Failed to delete liturgical reading')
  }
}