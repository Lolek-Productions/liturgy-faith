import { CreatePetitionData } from '@/lib/types'

export interface TemplateVariables {
  TITLE: string
  LANGUAGE: string
  COMMUNITY_CONTEXT: string
}

export function replaceTemplateVariables(template: string, variables: TemplateVariables): string {
  let result = template
  
  // Replace each variable with its value
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    result = result.replaceAll(placeholder, value)
  })
  
  return result
}

export function getTemplateVariables(data: CreatePetitionData): TemplateVariables {
  return {
    TITLE: data.title,
    LANGUAGE: data.language,
    COMMUNITY_CONTEXT: data.community_info,
  }
}

export function getDefaultPromptTemplate(): string {
  return `Create liturgical petitions in {{LANGUAGE}} for a Catholic Mass based on the following community information:

Title: {{TITLE}}
Community Information: {{COMMUNITY_CONTEXT}}

Please generate formal liturgical petitions following traditional Catholic prayer structure. Here is the exact format to follow:

EXAMPLE FORMAT:
{{TITLE}}

For all bishops, the successors of the Apostles, may the Holy Spirit protect and guide them, let us pray to the Lord.

For government leaders, may God give them wisdom to work for justice and to protect the lives of the innocent, let us pray to the Lord.

For those who do not know Christ, may the Holy Spirit bring them to recognize his love and goodness, let us pray to the Lord.

For this community gathered here, may Christ grant us strength to proclaim him boldly, let us pray to the Lord.

[Insert 2-4 specific petitions based on the community information provided - deaths, sick members, sacraments received, special requests]

For the intentions that we hold in the silence of our hearts (PAUSE 2-3 seconds), and for those written in our book of intentions, let us pray to the Lord.

REQUIREMENTS:
1. Use the exact title provided
2. Always include the 4 standard petitions shown above
3. Add 2-4 specific petitions based on community information between the standard petitions and final petition
4. Each petition must end with "let us pray to the Lord" (or equivalent in the specified language)
5. Include "(PAUSE 2-3 seconds)" only in the final petition
6. Separate each petition with a blank line
7. Format for liturgical reading with appropriate reverence

Generate the complete set of petitions now:`
}

export function getUserPromptTemplate(): string {
  // In a real application, this would fetch from the database
  // For now, we'll use localStorage as a simple storage mechanism
  if (typeof window !== 'undefined') {
    return localStorage.getItem('petition-prompt-template') || getDefaultPromptTemplate()
  }
  return getDefaultPromptTemplate()
}