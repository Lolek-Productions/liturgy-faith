import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

interface BaseFormFieldProps {
  id: string
  label: string
  description?: string
  required?: boolean
  className?: string
  formFieldClassName?: string
}

interface InputFieldProps extends BaseFormFieldProps {
  type?: 'input'
  inputType?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface TextareaFieldProps extends BaseFormFieldProps {
  type: 'textarea'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  resize?: boolean
}

interface SelectFieldProps extends BaseFormFieldProps {
  type: 'select'
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps

export function FormField(props: FormFieldProps) {
  const { id, label, description, required = false, className = '' } = props

  const renderInput = () => {
    switch (props.type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows || 12}
            className={`min-h-[200px] ${props.resize ? 'resize-y' : 'resize-none'}`}
            required={required}
          />
        )
      case 'select':
        return (
          <Select value={props.value} onValueChange={props.onChange}>
            {props.children}
          </Select>
        )
      default:
        return (
          <Input
            id={id}
            type={props.inputType || 'text'}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            required={required}
          />
        )
    }
  }

  return (
    <div className={className}>
      <Label htmlFor={id} className="text-lg">{label}</Label>
      {description && (
        <p className="text-xs text-muted-foreground mb-1">{description}</p>
      )}
      {renderInput()}
    </div>
  )
}