import * as React from 'react'
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'

export interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<React.ComponentProps<typeof Checkbox>, 'name'> {
  name: TName
  label: string
  description?: string
  required?: boolean
}

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  required,
  ...props
}: FormCheckboxProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              {...props}
            />
          </FormControl>
          <div className='space-y-1 leading-none'>
            <FormLabel>
              <span>
                {label}
                {required && <span className='text-destructive ml-0.5'>*</span>}
              </span>
            </FormLabel>
            {description && (
              <FormDescription>{description}</FormDescription>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}
