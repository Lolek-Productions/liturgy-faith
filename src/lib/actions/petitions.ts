'use server'

import { createClient } from '@/lib/supabase/server'
import { CreatePetitionData, Petition, PetitionContext } from '@/lib/types'
import { redirect } from 'next/navigation'

export async function createPetition(data: CreatePetitionData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const generatedContent = generatePetitionContent(data)

  const { data: petition, error: petitionError } = await supabase
    .from('petitions')
    .insert([
      {
        user_id: user.id,
        title: data.title,
        date: data.date,
        language: data.language,
        generated_content: generatedContent,
      },
    ])
    .select()
    .single()

  if (petitionError) {
    throw new Error('Failed to create petition')
  }

  const { error: contextError } = await supabase
    .from('petition_contexts')
    .insert([
      {
        petition_id: petition.id,
        user_id: user.id,
        sacraments_received: data.sacraments_received,
        deaths_this_week: data.deaths_this_week,
        sick_members: data.sick_members,
        special_petitions: data.special_petitions,
      },
    ])

  if (contextError) {
    throw new Error('Failed to create petition context')
  }

  return petition
}

export async function getPetitions(): Promise<Petition[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('petitions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch petitions')
  }

  return data || []
}

export async function getPetitionWithContext(id: string): Promise<{ petition: Petition; context: PetitionContext } | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: petition, error: petitionError } = await supabase
    .from('petitions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (petitionError || !petition) {
    return null
  }

  const { data: context, error: contextError } = await supabase
    .from('petition_contexts')
    .select('*')
    .eq('petition_id', id)
    .eq('user_id', user.id)
    .single()

  if (contextError || !context) {
    return null
  }

  return { petition, context }
}

function generatePetitionContent(data: CreatePetitionData): string {
  const { title, sacraments_received, deaths_this_week, sick_members, special_petitions, language } = data

  let content = `${title}\n\n`

  const prayers = {
    english: {
      bishops: "For all bishops, the successors of the Apostles, may the Holy Spirit protect and guide them, let us pray to the Lord.",
      government: "For government leaders, may God give them wisdom to work for justice and to protect the lives of the innocent, let us pray to the Lord.",
      nonbelievers: "For those who do not know Christ, may the Holy Spirit bring them to recognize his love and goodness, let us pray to the Lord.",
      community: "For this community gathered here, may Christ grant us strength to proclaim him boldly, let us pray to the Lord.",
      sickPrefix: "For all those who are praying for healing, especially",
      sickSuffix: "may they receive God's strength and grace, let us pray to the Lord.",
      deadPrefix: "For all who have died, especially",
      deadSuffix: "may they rejoice with the angels and saints in the presence of God the Father, let us pray to the Lord.",
      intentions: "For the intentions that we hold in the silence of our hearts (PAUSE 2-3 seconds), and for those written in our book of intentions, let us pray to the Lord.",
    },
    spanish: {
      bishops: "Por todos los obispos, sucesores de los Apóstoles, que el Espíritu Santo los proteja y los guíe, roguemos al Señor.",
      government: "Por los líderes del gobierno, que Dios les dé sabiduría para trabajar por la justicia y proteger las vidas de los inocentes, roguemos al Señor.",
      nonbelievers: "Por aquellos que no conocen a Cristo, que el Espíritu Santo los lleve a reconocer su amor y bondad, roguemos al Señor.",
      community: "Por esta comunidad aquí reunida, que Cristo nos conceda fuerza para proclamarlo con valentía, roguemos al Señor.",
      sickPrefix: "Por todos los que están pidiendo sanación, especialmente",
      sickSuffix: "que reciban la fuerza y gracia de Dios, roguemos al Señor.",
      deadPrefix: "Por todos los que han muerto, especialmente",
      deadSuffix: "que se regocijen con los ángeles y santos en la presencia de Dios Padre, roguemos al Señor.",
      intentions: "Por las intenciones que guardamos en el silencio de nuestros corazones (PAUSA 2-3 segundos), y por las escritas en nuestro libro de intenciones, roguemos al Señor.",
    }
  }

  const selectedPrayers = prayers[language as keyof typeof prayers] || prayers.english

  content += selectedPrayers.bishops + "\n"
  content += selectedPrayers.government + "\n"
  content += selectedPrayers.nonbelievers + "\n"
  content += selectedPrayers.community + "\n"

  if (sick_members.length > 0) {
    const sickList = sick_members.join(", ")
    content += `${selectedPrayers.sickPrefix} ${sickList}, ${selectedPrayers.sickSuffix}\n`
  }

  if (deaths_this_week.length > 0) {
    const deadList = deaths_this_week.join(", ")
    content += `${selectedPrayers.deadPrefix} ${deadList}, ${selectedPrayers.deadSuffix}\n`
  }

  if (special_petitions.length > 0) {
    special_petitions.forEach(petition => {
      if (petition.trim()) {
        content += `${petition}, let us pray to the Lord.\n`
      }
    })
  }

  if (sacraments_received.length > 0) {
    sacraments_received.forEach(person => {
      if (person.trim()) {
        content += `For ${person}, who received the sacraments this week, may they grow in faith and grace, let us pray to the Lord.\n`
      }
    })
  }

  content += selectedPrayers.intentions + "\n"

  return content
}