'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createTestParish() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Create a test parish
    const { data: parish, error: parishError } = await supabase
      .from('parishes')
      .insert([
        {
          name: 'Test Parish',
          city: 'Test City',
          state: 'TS'
        }
      ])
      .select()
      .single()

    if (parishError) {
      throw new Error(`Failed to create parish: ${parishError.message}`)
    }

    // Associate user with the parish
    const { error: associationError } = await supabase
      .from('parish_user')
      .insert([
        {
          user_id: user.id,
          parish_id: parish.id,
          roles: ['admin']
        }
      ])

    if (associationError) {
      throw new Error(`Failed to associate user with parish: ${associationError.message}`)
    }

    // Set the parish as selected in user settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        selected_parish_id: parish.id,
        language: 'en'
      })

    if (settingsError) {
      throw new Error(`Failed to update user settings: ${settingsError.message}`)
    }

    return { success: true, parish }
  } catch (error) {
    console.error('Error creating test parish:', error)
    throw error
  }
}

export async function createParish(data: {
  name: string
  city: string
  state: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Create the parish
    const { data: parish, error: parishError } = await supabase
      .from('parishes')
      .insert([
        {
          name: data.name.trim(),
          city: data.city.trim(),
          state: data.state.trim()
        }
      ])
      .select()
      .single()

    if (parishError) {
      throw new Error(`Failed to create parish: ${parishError.message}`)
    }

    // Associate user with the parish as admin
    const { error: associationError } = await supabase
      .from('parish_user')
      .insert([
        {
          user_id: user.id,
          parish_id: parish.id,
          roles: ['admin']
        }
      ])

    if (associationError) {
      throw new Error(`Failed to associate user with parish: ${associationError.message}`)
    }

    return { success: true, parish }
  } catch (error) {
    console.error('Error creating parish:', error)
    throw error
  }
}