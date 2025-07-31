import { CreatePetitionData } from '@/lib/types'

export interface TemplateVariables {
  TITLE: string
  LANGUAGE: string
  COMMUNITY_CONTEXT: string
  TEMPLATE_CONTENT: string
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

export function getTemplateVariables(data: CreatePetitionData, templateContent?: string): TemplateVariables {
  return {
    TITLE: data.title,
    LANGUAGE: data.language,
    COMMUNITY_CONTEXT: data.community_info,
    TEMPLATE_CONTENT: templateContent || '',
  }
}

export function getDefaultPromptTemplate(): string {
  return `Create liturgical petitions in {{LANGUAGE}} for a Catholic Mass using the selected template and community information:

Title: {{TITLE}}
Language: {{LANGUAGE}}
Template Content: {{TEMPLATE_CONTENT}}
Community Information: {{COMMUNITY_CONTEXT}}

Instructions:
1. Use the template content as the base structure for the petitions
2. Incorporate the community information to personalize the petitions
3. Generate in {{LANGUAGE}} language
4. Follow traditional Catholic liturgical petition format
5. Each petition should end with "let us pray to the Lord" (or equivalent in {{LANGUAGE}})
6. Include specific petitions based on community information (deaths, sick members, sacraments, special requests)
7. Maintain reverent and appropriate liturgical tone

If no template content is provided, use this standard format:
{{TITLE}}

For all bishops, the successors of the Apostles, may the Holy Spirit protect and guide them, let us pray to the Lord.

For government leaders, may God give them wisdom to work for justice and to protect the lives of the innocent, let us pray to the Lord.

For those who do not know Christ, may the Holy Spirit bring them to recognize his love and goodness, let us pray to the Lord.

For this community gathered here, may Christ grant us strength to proclaim him boldly, let us pray to the Lord.

[Insert specific petitions based on community information]

For the intentions that we hold in the silence of our hearts (PAUSE 2-3 seconds), and for those written in our book of intentions, let us pray to the Lord.

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