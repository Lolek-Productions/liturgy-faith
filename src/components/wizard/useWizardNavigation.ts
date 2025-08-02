'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface UseWizardNavigationProps {
  totalSteps: number
  initialStep?: number
  onStepChange?: (step: number) => void
}

export function useWizardNavigation({ 
  totalSteps, 
  initialStep = 1,
  onStepChange 
}: UseWizardNavigationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(initialStep)

  const updateStepInUrl = (step: number) => {
    const url = new URL(window.location.href)
    const currentStepParam = url.searchParams.get('step')
    
    // Only update if the step is different
    if (currentStepParam !== step.toString()) {
      url.searchParams.set('step', step.toString())
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }

  // Initialize step from URL params
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10)
      if (stepNumber >= 1 && stepNumber <= totalSteps && stepNumber !== currentStep) {
        setCurrentStep(stepNumber)
        onStepChange?.(stepNumber)
      }
    } else if (currentStep === initialStep) {
      // Only set URL if we're on initial step and there's no step param
      updateStepInUrl(initialStep)
    }
  }, [searchParams, totalSteps, initialStep]) // Removed currentStep to prevent loops

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
      updateStepInUrl(step)
      onStepChange?.(step)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1
      goToStep(newStep)
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      goToStep(newStep)
    }
  }

  const canGoNext = currentStep < totalSteps
  const canGoPrevious = currentStep > 1
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  return {
    currentStep,
    goToStep,
    nextStep,
    previousStep,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep
  }
}