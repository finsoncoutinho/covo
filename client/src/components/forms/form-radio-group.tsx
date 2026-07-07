import * as React from 'react'
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'

export interface FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<React.ComponentProps<typeof RadioGroup>, 'name' | 'defaultValue'> {
  name: TName
  label?: string
  description?: string
  required?: boolean
  options: {
    label: string
    value: string
    description?: string
  }[]
}

export function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  required,
  options,
  ...props
}: FormRadioGroupProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-3'>
          {label && (
            <FormLabel>
              <span>
                {label}
                {required && <span className='text-destructive ml-0.5'>*</span>}
              </span>
            </FormLabel>
          )}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className='flex flex-col space-y-2'
              {...props}
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className='flex items-center space-x-3 space-y-0'
                >
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className='font-normal cursor-pointer'>
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
