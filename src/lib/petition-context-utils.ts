// Utility functions for petition context handling

// Helper function to get petition text from context field
export function getPetitionTextFromContext(context: string): string {
  if (!context || context.trim() === '') {
    return ''
  }
  
  // If it's already simple text, return it
  try {
    const parsed = JSON.parse(context)
    // If it's a complex object, ignore it and treat as empty
    if (typeof parsed === 'object') {
      return ''
    }
    return context
  } catch {
    // If it's not JSON, it's simple text
    return context
  }
}