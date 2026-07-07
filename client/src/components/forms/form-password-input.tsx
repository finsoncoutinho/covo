import * as React from 'react'
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'

export interface FormPasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<React.ComponentProps<typeof Input>, 'name' | 'type'> {
  name: TName
  label?: string
  description?: string
  required?: boolean
}

export function FormPasswordInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  required,
  className,
  ...props
}: FormPasswordInputProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>()
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              <span>
                {label}
                {required && <span className='text-destructive ml-0.5'>*</span>}
              </span>
            </FormLabel>
          )}
          <FormControl>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                className={cn('pr-10', className)}
                {...props}
                {...field}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground'
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' aria-hidden='true' />
                ) : (
                  <Eye className='h-4 w-4' aria-hidden='true' />
                )}
                <span className='sr-only'>
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
