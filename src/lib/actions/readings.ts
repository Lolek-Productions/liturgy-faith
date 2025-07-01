'use server'

import { createClient } from '@/lib/supabase/server'
import { 
  CreateReadingCollectionData, 
  ReadingCollection, 
  CreateIndividualReadingData, 
  IndividualReading,
  CreateReadingCollectionItemData,
  ReadingCollectionWithItems
} from '@/lib/types'
import { redirect } from 'next/navigation'

// Reading Collections CRUD
export async function createReadingCollection(data: CreateReadingCollectionData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: collection, error } = await supabase
    .from('reading_collections')
    .insert([
      {
        user_id: user.id,
        name: data.name,
        description: data.description,
        occasion_type: data.occasion_type,
        is_template: data.is_template ?? false,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create reading collection')
  }

  return collection
}

export async function getReadingCollections(): Promise<ReadingCollection[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('reading_collections')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    // If table doesn't exist yet, return empty array
    if (error.message?.includes('relation "public.reading_collections" does not exist')) {
      console.warn('Reading collections table not yet created. Please run database migrations.')
      return []
    }
    throw new Error('Failed to fetch reading collections')
  }

  return data || []
}

export async function getReadingCollection(id: string): Promise<ReadingCollection | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('reading_collections')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function getReadingCollectionWithItems(id: string): Promise<ReadingCollectionWithItems | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('reading_collections')
    .select(`
      *,
      reading_collection_items (
        id,
        position,
        lector_name,
        do_not_print,
        notes,
        individual_readings (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  // Transform the data to match our type
  const collection: ReadingCollectionWithItems = {
    ...data,
    items: (data.reading_collection_items || [])
      .map((item: { id: string; position: number; lector_name?: string; do_not_print: boolean; notes?: string; individual_readings: IndividualReading }) => ({
        id: item.id,
        position: item.position,
        lector_name: item.lector_name,
        do_not_print: item.do_not_print,
        notes: item.notes,
        reading: item.individual_readings
      }))
      .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
  }

  return collection
}

export async function updateReadingCollection(id: string, data: CreateReadingCollectionData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: collection, error } = await supabase
    .from('reading_collections')
    .update({
      name: data.name,
      description: data.description,
      occasion_type: data.occasion_type,
      is_template: data.is_template ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update reading collection')
  }

  return collection
}

export async function deleteReadingCollection(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('reading_collections')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to delete reading collection')
  }
}

// Individual Readings CRUD
export async function createIndividualReading(data: CreateIndividualReadingData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: reading, error } = await supabase
    .from('individual_readings')
    .insert([
      {
        user_id: user.id,
        pericope: data.pericope,
        title: data.title,
        category: data.category,
        translation_id: data.translation_id ?? 1,
        sort_order: data.sort_order ?? 1,
        introduction: data.introduction,
        reading_text: data.reading_text,
        conclusion: data.conclusion,
        is_template: data.is_template ?? false,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create reading')
  }

  return reading
}

export async function getIndividualReadings(): Promise<IndividualReading[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('individual_readings')
    .select('*')
    .order('reference', { ascending: true })

  if (error) {
    // If table doesn't exist yet, return empty array
    if (error.message?.includes('relation "public.individual_readings" does not exist')) {
      console.warn('Individual readings table not yet created. Please run database migrations.')
      return []
    }
    throw new Error('Failed to fetch individual readings')
  }

  return data || []
}

export async function getIndividualReading(id: string): Promise<IndividualReading | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('individual_readings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function updateIndividualReading(id: string, data: CreateIndividualReadingData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: reading, error } = await supabase
    .from('individual_readings')
    .update({
      pericope: data.pericope,
      title: data.title,
      category: data.category,
      translation_id: data.translation_id ?? 1,
      sort_order: data.sort_order ?? 1,
      introduction: data.introduction,
      reading_text: data.reading_text,
      conclusion: data.conclusion,
      is_template: data.is_template ?? false,
      updated_at: new Date().toISOString(),
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

export async function deleteIndividualReading(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('individual_readings')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to delete reading')
  }
}

// Collection Items Management



// Search and Filter Functions
export async function searchReadingsByOccasion(occasionType: string): Promise<IndividualReading[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('individual_readings')
    .select('*')
    .contains('occasion_tags', [occasionType])
    .order('reference', { ascending: true })

  if (error) {
    // If table doesn't exist yet, return empty array
    if (error.message?.includes('relation "public.individual_readings" does not exist')) {
      console.warn('Individual readings table not yet created. Please run database migrations.')
      return []
    }
    throw new Error('Failed to search readings')
  }

  return data || []
}

export async function getReadingsByCategory(category: string, translationId: number = 1): Promise<IndividualReading[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('individual_readings')
    .select('*')
    .eq('category', category)
    .eq('translation_id', translationId)
    .order('sort_order', { ascending: true })

  if (error) {
    // If table doesn't exist yet, return empty array
    if (error.message?.includes('relation "public.individual_readings" does not exist')) {
      console.warn('Individual readings table not yet created. Please run database migrations.')
      return []
    }
    throw new Error('Failed to fetch readings by category')
  }

  return data || []
}

// Get readings organized by liturgical category for a specific occasion
export async function getReadingsForOccasion(occasionType: string, translationId: number = 1): Promise<Record<string, IndividualReading[]>> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get all readings for this occasion type
  const categoryPrefix = occasionType === 'wedding' ? 'marriage' : occasionType
  
  const { data, error } = await supabase
    .from('individual_readings')
    .select('*')
    .like('category', `${categoryPrefix}-%`)
    .eq('translation_id', translationId)
    .order('sort_order', { ascending: true })

  if (error) {
    if (error.message?.includes('relation "public.individual_readings" does not exist')) {
      console.warn('Individual readings table not yet created. Please run database migrations.')
      return {}
    }
    throw new Error('Failed to fetch readings for occasion')
  }

  // Group by category
  const grouped: Record<string, IndividualReading[]> = {}
  for (const reading of data || []) {
    if (!grouped[reading.category]) {
      grouped[reading.category] = []
    }
    grouped[reading.category].push(reading)
  }

  return grouped
}

// Get available translations
export async function getAvailableTranslations(): Promise<Array<{id: number, name: string, abbreviation: string}>> {
  // For now, return static list - could be made dynamic later
  return [
    { id: 1, name: 'New American Bible Revised Edition', abbreviation: 'NABRE' },
    { id: 2, name: 'Revised Standard Version', abbreviation: 'RSV' },
    { id: 3, name: 'New Revised Standard Version', abbreviation: 'NRSV' },
  ]
}

// Reading Collection Items with liturgical functionality
export async function addReadingToCollection(data: CreateReadingCollectionItemData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: item, error } = await supabase
    .from('reading_collection_items')
    .insert([
      {
        collection_id: data.collection_id,
        reading_id: data.reading_id,
        position: data.position ?? 1,
        lector_name: data.lector_name,
        do_not_print: data.do_not_print ?? false,
        notes: data.notes,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Failed to add reading to collection')
  }

  return item
}

export async function updateCollectionItem(id: string, data: Partial<CreateReadingCollectionItemData>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: item, error } = await supabase
    .from('reading_collection_items')
    .update({
      position: data.position,
      lector_name: data.lector_name,
      do_not_print: data.do_not_print ?? false,
      notes: data.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update collection item')
  }

  return item
}

export async function removeReadingFromCollection(itemId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('reading_collection_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    throw new Error('Failed to remove reading from collection')
  }
}