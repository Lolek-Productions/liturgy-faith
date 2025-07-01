'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface PetitionSettings {
  daily_mass: string
  sunday_mass: string
  wedding: string
  funeral: string
}

export async function getPetitionSettings(): Promise<PetitionSettings | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('petition_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    // If no settings exist, return null to use defaults
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error('Failed to load petition settings')
  }

  return {
    daily_mass: data.daily_mass || '',
    sunday_mass: data.sunday_mass || '',
    wedding: data.wedding || '',
    funeral: data.funeral || ''
  }
}

export async function updatePetitionSettings(settings: PetitionSettings) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('petition_settings')
    .upsert({
      user_id: user.id,
      daily_mass: settings.daily_mass,
      sunday_mass: settings.sunday_mass,
      wedding: settings.wedding,
      funeral: settings.funeral,
      updated_at: new Date().toISOString()
    })

  if (error) {
    throw new Error('Failed to save petition settings')
  }
}