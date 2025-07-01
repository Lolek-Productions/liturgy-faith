export interface Petition {
  id: string
  user_id: string
  title: string
  date: string
  language: string
  generated_content?: string
  petition_text?: string // Alias for generated_content for compatibility
  created_at: string
  updated_at: string
}

export interface PetitionContext {
  id: string
  petition_id: string
  user_id: string
  community_info: string
  created_at: string
  updated_at: string
}

export interface CreatePetitionData {
  title: string
  date: string
  language: string
  community_info: string
}

export interface PetitionSettings {
  id: string
  user_id: string
  daily_mass: string
  sunday_mass: string
  wedding: string
  funeral: string
  created_at: string
  updated_at: string
}

export interface Minister {
  id: string
  user_id: string
  name: string
  email?: string
  phone?: string
  role: string
  availability: Record<string, unknown>
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateMinisterData {
  name: string
  email?: string
  phone?: string
  role: string
  availability?: Record<string, unknown>
  notes?: string
  is_active?: boolean
}

export interface LiturgyPlan {
  id: string
  user_id: string
  title: string
  date: string
  liturgy_type: string
  prayers: unknown[]
  preface?: string
  readings: unknown[]
  special_notes?: string
  created_at: string
  updated_at: string
}

export interface CreateLiturgyPlanData {
  title: string
  date: string
  liturgy_type: string
  prayers?: unknown[]
  preface?: string
  readings?: unknown[]
  special_notes?: string
}

export interface LiturgicalCalendarEntry {
  id: string
  user_id: string
  title: string
  date: string
  liturgical_season?: string
  liturgical_rank?: string
  color?: string
  readings: unknown[]
  special_prayers: unknown[]
  notes?: string
  is_custom: boolean
  created_at: string
  updated_at: string
}

export interface CreateCalendarEntryData {
  title: string
  date: string
  liturgical_season?: string
  liturgical_rank?: string
  color?: string
  readings?: unknown[]
  special_prayers?: unknown[]
  notes?: string
  is_custom?: boolean
}

export interface ReadingCollection {
  id: string
  user_id: string
  name: string
  description?: string
  occasion_type: string
  is_template: boolean
  created_at: string
  updated_at: string
}

export interface CreateReadingCollectionData {
  name: string
  description?: string
  occasion_type: string
  is_template?: boolean
}

export interface IndividualReading {
  id: string
  user_id?: string
  pericope: string
  title: string
  category: string
  translation_id: number
  sort_order: number
  introduction?: string
  reading_text: string
  conclusion?: string
  is_template: boolean
  created_at: string
  updated_at: string
}

export interface CreateIndividualReadingData {
  pericope: string
  title: string
  category: string
  translation_id?: number
  sort_order?: number
  introduction?: string
  reading_text: string
  conclusion?: string
  is_template?: boolean
}

export interface ReadingCollectionItem {
  id: string
  collection_id: string
  reading_id: string
  position: number
  lector_name?: string
  do_not_print: boolean
  notes?: string
  created_at: string
}

export interface CreateReadingCollectionItemData {
  collection_id: string
  reading_id: string
  position?: number
  lector_name?: string
  do_not_print?: boolean
  notes?: string
}

export interface ReadingCollectionWithItems {
  id: string
  user_id?: string
  name: string
  description?: string
  occasion_type: string
  is_template: boolean
  created_at: string
  updated_at: string
  items: Array<{
    id: string
    position: number
    lector_name?: string
    do_not_print: boolean
    notes?: string
    reading: IndividualReading
  }>
}

// Translation/Version definitions
export interface Translation {
  id: number
  name: string
  abbreviation: string
}

// Liturgical category definitions
export type LiturgicalCategory = 
  | 'marriage-1'      // Marriage First Reading
  | 'marriage-2'      // Marriage Second Reading
  | 'marriage-psalm'  // Marriage Psalm
  | 'marriage-gospel' // Marriage Gospel
  | 'funeral-1'       // Funeral First Reading
  | 'funeral-psalm'   // Funeral Psalm
  | 'funeral-gospel'  // Funeral Gospel
  | 'baptism-1'       // Baptism First Reading
  | 'baptism-psalm'   // Baptism Psalm
  | 'baptism-2'       // Baptism Second Reading
  | 'baptism-gospel'  // Baptism Gospel
  | 'confirmation-1'  // Confirmation First Reading
  | 'confirmation-psalm' // Confirmation Psalm
  | 'confirmation-2'  // Confirmation Second Reading
  | 'confirmation-gospel' // Confirmation Gospel
  | 'mass-1'          // Mass First Reading
  | 'mass-psalm'      // Mass Psalm
  | 'mass-2'          // Mass Second Reading
  | 'mass-gospel'     // Mass Gospel
  | 'other'           // Other/Custom

// Helper constants
export const TRANSLATIONS: Translation[] = [
  { id: 1, name: 'New American Bible Revised Edition', abbreviation: 'NABRE' },
  { id: 2, name: 'Revised Standard Version', abbreviation: 'RSV' },
  { id: 3, name: 'New Revised Standard Version', abbreviation: 'NRSV' },
]

export const LITURGICAL_CATEGORIES: Record<string, LiturgicalCategory[]> = {
  'wedding': ['marriage-1', 'marriage-psalm', 'marriage-2', 'marriage-gospel'],
  'funeral': ['funeral-1', 'funeral-psalm', 'funeral-gospel'],
  'baptism': ['baptism-1', 'baptism-psalm', 'baptism-2', 'baptism-gospel'],
  'confirmation': ['confirmation-1', 'confirmation-psalm', 'confirmation-2', 'confirmation-gospel'],
  'mass': ['mass-1', 'mass-psalm', 'mass-2', 'mass-gospel'],
}