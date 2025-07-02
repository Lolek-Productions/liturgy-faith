'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Petition } from '@/lib/types'
import { getPetition } from '@/lib/actions/petitions'

function PrintPetitionsContent() {
  const [petition, setPetition] = useState<Petition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const petitionId = searchParams.get('id')

  useEffect(() => {
    const loadData = async () => {
      if (!petitionId) {
        setError('No petition ID provided')
        setLoading(false)
        return
      }

      try {
        const petitionData = await getPetition(petitionId)
        if (!petitionData) {
          setError('Petition not found')
        } else {
          setPetition(petitionData)
        }
      } catch (err) {
        console.error('Failed to load petition:', err)
        setError('Failed to load petition for printing')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [petitionId])

  // Auto-print after content loads
  useEffect(() => {
    if (!loading && !error && petition) {
      const timer = setTimeout(() => {
        window.print()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [loading, error, petition])

  const handlePrint = () => {
    window.print()
  }

  const handleClose = () => {
    router.back()
  }

  if (loading) {
    return (
      <div>
        <div className="print-preview-notice hide-on-print">
          Loading petition for printing...
        </div>
      </div>
    )
  }

  if (error || !petition) {
    return (
      <div>
        <div className="print-preview-notice hide-on-print" style={{ background: '#ffebee', borderColor: '#f44336', color: '#c62828' }}>
          {error || 'Petition not found'}
        </div>
        <div className="print-actions hide-on-print">
          <button className="print-button secondary" onClick={handleClose}>
            ← Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Print Actions - Hidden on Print */}
      <div className="print-actions hide-on-print">
        <button className="print-button secondary" onClick={handleClose}>
          ← Back
        </button>
        <button className="print-button" onClick={handlePrint}>
          🖨️ Print
        </button>
      </div>

      {/* Preview Notice - Hidden on Print */}
      <div className="print-preview-notice hide-on-print">
        Print Preview - This page will automatically print when content finishes loading
      </div>

      {/* Petitions Content - Page Break Container */}
      <div className="p-6 break-after-page">
        {/* Header - Right Aligned Red Text */}
        <div className="text-right text-xl text-red-500 font-semibold">
          {petition.language === 'spanish' ? 'PETICIONES' :
           petition.language === 'french' ? 'PRIÈRE UNIVERSELLE' :
           petition.language === 'latin' ? 'ORATIO UNIVERSALIS' :
           'PETITIONS'}
        </div>
        <div className="text-right text-xl text-red-500 font-semibold italic">
          {petition.title}
        </div>
        <div className="text-right text-xl text-red-500 font-bold">
          {new Date(petition.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>

        {/* Introduction */}
        <div className="mt-3 font-semibold">
          {petition.language === 'spanish' ? 
            'Confiando en la misericordia de Dios, presentemos nuestras peticiones:' :
           petition.language === 'french' ? 
            'Confiants en la miséricorde de Dieu, présentons nos demandes :' :
           petition.language === 'latin' ? 
            'Confidentes in Dei misericordia, preces nostras offeramus:' :
           'Trusting in God\'s mercy, let us present our petitions:'}
        </div>

        {/* Petitions Content */}
        <div className="mt-3">
          {petition.generated_content ? (
            <div className="whitespace-pre-line">
              {petition.generated_content.split('\n').filter(line => line.trim()).map((petitionText, i) => (
                <div key={i} className="mb-4">
                  <div className="mb-1">
                    {petitionText}
                  </div>
                  <div className="font-semibold text-red-500 italic ml-8">
                    {petition.language === 'spanish' ? 'Te rogamos, óyenos.' : 
                     petition.language === 'french' ? 'Nous te prions, écoute-nous.' :
                     petition.language === 'latin' ? 'Te rogamus, audi nos.' :
                     'Lord, hear our prayer.'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 italic text-gray-600">
              No petition content generated yet. Please return to the wizard to generate petitions.
            </div>
          )}
        </div>
        
        {/* Concluding Prayer */}
        <div className="mt-6 font-semibold">
          {petition.language === 'spanish' ? 
            'Dios todopoderoso y eterno, que gobiernas todas las cosas en el cielo y en la tierra: Acepta misericordiosamente las oraciones de tu pueblo, y fortalécenos para hacer tu voluntad; por Jesucristo nuestro Señor.' :
           petition.language === 'french' ? 
            'Dieu tout-puissant et éternel, maître de toutes choses au ciel et sur la terre : Accepte avec miséricorde les prières de ton peuple, et fortifie-nous pour faire ta volonté ; par Jésus-Christ notre Seigneur.' :
           petition.language === 'latin' ? 
            'Omnipotens sempiterne Deus, qui universa in caelo et in terra regis: Clementer exaudi preces populi tui, et confirma nos ad voluntatem tuam faciendam; per Jesum Christum Dominum nostrum.' :
           'Almighty and eternal God, ruler of all things in heaven and earth: Mercifully accept the prayers of your people, and strengthen us to do your will; through Jesus Christ our Lord.'}
        </div>
        
        {/* Amen - Right Aligned */}
        <div className="text-right font-bold mt-3">
          {petition.language === 'spanish' ? 'Amén.' :
           petition.language === 'french' ? 'Amen.' :
           petition.language === 'latin' ? 'Amen.' :
           'Amen.'}
        </div>
      </div>

      {/* Print Footer */}
      <div className="print-footer">
        Generated by Liturgy.Faith • {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}

export default function PrintPetitionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrintPetitionsContent />
    </Suspense>
  )
}