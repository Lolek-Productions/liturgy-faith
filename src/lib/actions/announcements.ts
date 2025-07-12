'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface Announcement {
  id: number
  text: string
  liturgical_event_id: string | null
  parish_id: string
  created_at: string
}

export interface AnnouncementTemplate {
  id: number
  title: string
  text: string
  parish_id: string
  created_at: string
}

export async function getAnnouncements(parishId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Check if user has access to this parish
    const { data: userParish, error: userParishError } = await supabase
      .from('parish_user')
      .select('roles')
      .eq('user_id', user.id)
      .eq('parish_id', parishId)
      .single()

    if (userParishError || !userParish) {
      throw new Error('You do not have access to this parish')
    }

    // Get announcements for the parish
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('parish_id', parishId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch announcements: ${error.message}`)
    }

    return { success: true, announcements: announcements || [] }
  } catch (error) {
    console.error('Error fetching announcements:', error)
    throw error
  }
}

export async function createAnnouncement(data: {
  text: string
  liturgical_event_id?: string | null
  parish_id: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Check if user has permission to create announcements for this parish
    const { data: userParish, error: userParishError } = await supabase
      .from('parish_user')
      .select('roles')
      .eq('user_id', user.id)
      .eq('parish_id', data.parish_id)
      .single()

    if (userParishError || !userParish || 
        (!userParish.roles.includes('admin') && !userParish.roles.includes('minister'))) {
      throw new Error('You do not have permission to create announcements for this parish')
    }

    // Create the announcement
    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        text: data.text.trim(),
        liturgical_event_id: data.liturgical_event_id || null,
        parish_id: data.parish_id
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create announcement: ${error.message}`)
    }

    return { success: true, announcement }
  } catch (error) {
    console.error('Error creating announcement:', error)
    throw error
  }
}

export async function updateAnnouncement(announcementId: number, data: {
  text: string
  liturgical_event_id?: string | null
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Get the announcement to check parish ownership
    const { data: existingAnnouncement, error: fetchError } = await supabase
      .from('announcements')
      .select('parish_id')
      .eq('id', announcementId)
      .single()

    if (fetchError || !existingAnnouncement) {
      throw new Error('Announcement not found')
    }

    // Check if user has permission to update announcements for this parish
    const { data: userParish, error: userParishError } = await supabase
      .from('parish_user')
      .select('roles')
      .eq('user_id', user.id)
      .eq('parish_id', existingAnnouncement.parish_id)
      .single()

    if (userParishError || !userParish || 
        (!userParish.roles.includes('admin') && !userParish.roles.includes('minister'))) {
      throw new Error('You do not have permission to update this announcement')
    }

    // Update the announcement
    const { data: announcement, error } = await supabase
      .from('announcements')
      .update({
        text: data.text.trim(),
        liturgical_event_id: data.liturgical_event_id || null
      })
      .eq('id', announcementId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update announcement: ${error.message}`)
    }

    return { success: true, announcement }
  } catch (error) {
    console.error('Error updating announcement:', error)
    throw error
  }
}

export async function deleteAnnouncement(announcementId: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Get the announcement to check parish ownership
    const { data: existingAnnouncement, error: fetchError } = await supabase
      .from('announcements')
      .select('parish_id')
      .eq('id', announcementId)
      .single()

    if (fetchError || !existingAnnouncement) {
      throw new Error('Announcement not found')
    }

    // Check if user has permission to delete announcements for this parish
    const { data: userParish, error: userParishError } = await supabase
      .from('parish_user')
      .select('roles')
      .eq('user_id', user.id)
      .eq('parish_id', existingAnnouncement.parish_id)
      .single()

    if (userParishError || !userParish || !userParish.roles.includes('admin')) {
      throw new Error('You do not have permission to delete this announcement')
    }

    // Delete the announcement
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId)

    if (error) {
      throw new Error(`Failed to delete announcement: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting announcement:', error)
    throw error
  }
}

export async function getAnnouncementTemplates(parishId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Check if user has access to this parish
    const { data: userParish, error: userParishError } = await supabase
      .from('parish_user')
      .select('roles')
      .eq('user_id', user.id)
      .eq('parish_id', parishId)
      .single()

    if (userParishError || !userParish) {
      throw new Error('You do not have access to this parish')
    }

    // Get announcement templates for the parish
    const { data: templates, error } = await supabase
      .from('announcement_templates')
      .select('*')
      .eq('parish_id', parishId)
      .order('title', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch announcement templates: ${error.message}`)
    }

    return { success: true, templates: templates || [] }
  } catch (error) {
    console.error('Error fetching announcement templates:', error)
    throw error
  }
}

export async function createAnnouncementTemplate(data: {
  title: string
  text: string
  parish_id: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Check if user has permission to create templates for this parish
    const { data: userParish, error: userParishError } = await supabase
      .from('parish_user')
      .select('roles')
      .eq('user_id', user.id)
      .eq('parish_id', data.parish_id)
      .single()

    if (userParishError || !userParish || 
        (!userParish.roles.includes('admin') && !userParish.roles.includes('minister'))) {
      throw new Error('You do not have permission to create templates for this parish')
    }

    // Create the template
    const { data: template, error } = await supabase
      .from('announcement_templates')
      .insert({
        title: data.title.trim(),
        text: data.text.trim(),
        parish_id: data.parish_id
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create announcement template: ${error.message}`)
    }

    return { success: true, template }
  } catch (error) {
    console.error('Error creating announcement template:', error)
    throw error
  }
}

export async function updateAnnouncementTemplate(templateId: number, data: {
  title: string
  text: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Get the template to check parish ownership
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('announcement_templates')
      .select('parish_id')
      .eq('id', templateId)
      .single()

    if (fetchError || !existingTemplate) {
      throw new Error('Template not found')
    }

    // Check if user has permission to update templates for this parish
    const { data: userParish, error: userParishError } = await supabase
      .from('parish_user')
      .select('roles')
      .eq('user_id', user.id)
      .eq('parish_id', existingTemplate.parish_id)
      .single()

    if (userParishError || !userParish || 
        (!userParish.roles.includes('admin') && !userParish.roles.includes('minister'))) {
      throw new Error('You do not have permission to update this template')
    }

    // Update the template
    const { data: template, error } = await supabase
      .from('announcement_templates')
      .update({
        title: data.title.trim(),
        text: data.text.trim()
      })
      .eq('id', templateId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update announcement template: ${error.message}`)
    }

    return { success: true, template }
  } catch (error) {
    console.error('Error updating announcement template:', error)
    throw error
  }
}

export async function deleteAnnouncementTemplate(templateId: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Get the template to check parish ownership
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('announcement_templates')
      .select('parish_id')
      .eq('id', templateId)
      .single()

    if (fetchError || !existingTemplate) {
      throw new Error('Template not found')
    }

    // Check if user has permission to delete templates for this parish
    const { data: userParish, error: userParishError } = await supabase
      .from('parish_user')
      .select('roles')
      .eq('user_id', user.id)
      .eq('parish_id', existingTemplate.parish_id)
      .single()

    if (userParishError || !userParish || !userParish.roles.includes('admin')) {
      throw new Error('You do not have permission to delete this template')
    }

    // Delete the template
    const { error } = await supabase
      .from('announcement_templates')
      .delete()
      .eq('id', templateId)

    if (error) {
      throw new Error(`Failed to delete announcement template: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting announcement template:', error)
    throw error
  }
}

export async function getLiturgicalEvents(parishId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    // Check if user has access to this parish
    const { data: userParish, error: userParishError } = await supabase
      .from('parish_user')
      .select('roles')
      .eq('user_id', user.id)
      .eq('parish_id', parishId)
      .single()

    if (userParishError || !userParish) {
      throw new Error('You do not have access to this parish')
    }

    // Get liturgical events for the parish
    const { data: events, error } = await supabase
      .from('liturgical_events')
      .select('id, name, event_date, start_time')
      .eq('parish_id', parishId)
      .order('event_date', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch liturgical events: ${error.message}`)
    }

    return { success: true, events: events || [] }
  } catch (error) {
    console.error('Error fetching liturgical events:', error)
    throw error
  }
}