export interface Petition {
  id: string
  user_id: string
  title: string
  date: string
  language: string
  generated_content?: string
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