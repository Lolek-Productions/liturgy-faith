// Utility functions for petition context handling

export interface ContextData {
  name: string
  description?: string
  community_info: string
  sacraments_received: Array<{ name: string; details?: string }>
  deaths_this_week: Array<{ name: string; details?: string }>
  sick_members: Array<{ name: string; details?: string }>
  special_petitions: Array<{ name: string; details?: string }>
}

// Helper function to parse context data
export function parseContextData(context: string): ContextData | null {
  if (!context || context.trim() === '') {
    return null
  }
  
  try {
    const parsed = JSON.parse(context)
    
    // Validate that we have the required structure
    if (!parsed || typeof parsed !== 'object') {
      return null
    }
    
    // Ensure required fields exist and have valid values
    if (!parsed.name || typeof parsed.name !== 'string' || parsed.name.trim() === '') {
      return null
    }
    
    // Return parsed data with defaults for missing fields
    return {
      name: parsed.name,
      description: parsed.description || '',
      community_info: parsed.community_info || '',
      sacraments_received: Array.isArray(parsed.sacraments_received) ? parsed.sacraments_received : [],
      deaths_this_week: Array.isArray(parsed.deaths_this_week) ? parsed.deaths_this_week : [],
      sick_members: Array.isArray(parsed.sick_members) ? parsed.sick_members : [],
      special_petitions: Array.isArray(parsed.special_petitions) ? parsed.special_petitions : []
    }
  } catch {
    return null
  }
}