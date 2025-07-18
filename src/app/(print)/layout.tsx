import { Inter } from 'next/font/google'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            font-family: 'Times New Roman', serif !important;
            font-size: 12pt !important;
            line-height: 1.4 !important;
            color: black !important;
            background: white !important;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .no-break {
            page-break-inside: avoid;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 2rem;
            border-bottom: 2px solid black;
            padding-bottom: 1rem;
          }
          
          .print-footer {
            position: fixed;
            bottom: 1cm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10pt;
            color: #666;
          }
          
          .reading-section {
            margin-bottom: 2rem;
            page-break-inside: avoid;
          }
          
          .reading-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 0.5rem;
            text-align: center;
          }
          
          .reading-reference {
            font-size: 12pt;
            font-style: italic;
            text-align: center;
            margin-bottom: 1rem;
          }
          
          .reading-introduction {
            font-size: 11pt;
            margin-bottom: 1rem;
            font-style: italic;
          }
          
          .reading-text {
            font-size: 12pt;
            line-height: 1.6;
            text-align: justify;
            margin-bottom: 1rem;
          }
          
          .reading-conclusion {
            font-size: 11pt;
            font-style: italic;
            text-align: right;
            margin-bottom: 1rem;
          }
          
          .petition-section {
            margin-top: 3rem;
            page-break-before: auto;
          }
          
          .petition-title {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 1.5rem;
          }
          
          .petition-item {
            margin-bottom: 1rem;
            text-align: left;
          }
          
          .petition-response {
            font-style: italic;
            margin-left: 2rem;
            margin-top: 0.3rem;
          }
          
          .liturgical-rubric {
            font-style: italic;
            color: #c41e3a;
            font-size: 11pt;
          }
          
          @page {
            margin: 2.5cm 2cm;
            size: A4;
          }
          
          .hide-on-print {
            display: none !important;
          }
        }
        
        @media screen {
          body {
            font-family: ${inter.className}, system-ui, sans-serif;
            background-color: #f5f5f5;
            padding: 2rem;
          }
          
          .print-container {
            max-width: 21cm;
            margin: 0 auto;
            background: white;
            padding: 2.5cm 2cm;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
          }
          
          .print-preview-notice {
            background: #e3f2fd;
            border: 1px solid #2196f3;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 2rem;
            text-align: center;
            color: #1565c0;
          }
          
          .print-actions {
            position: fixed;
            top: 1rem;
            right: 1rem;
            display: flex;
            gap: 0.5rem;
            z-index: 1000;
          }
          
          .print-button {
            background: #2196f3;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .print-button:hover {
            background: #1976d2;
          }
          
          .print-button.secondary {
            background: #757575;
          }
          
          .print-button.secondary:hover {
            background: #616161;
          }
        }
      `
      }} />
      <div className="print-container">
        {children}
      </div>
    </>
  )
}