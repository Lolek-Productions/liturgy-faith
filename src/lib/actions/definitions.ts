'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDefaultPromptTemplate } from '@/lib/template-utils'

export async function savePromptTemplate(template: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // For now, we'll store in user metadata. In a production app, 
  // you might want a dedicated table for user preferences
  const { error } = await supabase.auth.updateUser({
    data: { 
      petition_prompt_template: template 
    }
  })

  if (error) {
    throw new Error('Failed to save template')
  }

  return { success: true }
}

export async function getPromptTemplate(): Promise<string> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return getDefaultPromptTemplate()
  }

  // Get template from user metadata
  const template = user.user_metadata?.petition_prompt_template
  
  return template || getDefaultPromptTemplate()
}