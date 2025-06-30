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
  sacraments_received: string[]
  deaths_this_week: string[]
  sick_members: string[]
  special_petitions: string[]
  created_at: string
  updated_at: string
}

export interface CreatePetitionData {
  title: string
  date: string
  language: string
  sacraments_received: string[]
  deaths_this_week: string[]
  sick_members: string[]
  special_petitions: string[]
}