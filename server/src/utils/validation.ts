import { z } from 'zod'
import { ApiError } from './ApiError.js'

export type ValidationError = {
  field: string
  error: string
}

export type ValidateRequestOptions = {
  errorMessage?: string
  includeFieldErrors?: boolean
}

export const validateRequest = <T>(
  schema: z.ZodType<T>,
  data: unknown,
  options?: ValidateRequestOptions
): T => {
  const errorMessage = options?.errorMessage ?? 'Validation failed'
  const includeFieldErrors = options?.includeFieldErrors ?? true
  const result = schema.safeParse(data)

  if (!result.success) {
    const fieldErrors: ValidationError[] = []
    const globalErrors: string[] = []

    for (const err of result.error.issues) {
      if (includeFieldErrors && err.path.length > 0) {
        fieldErrors.push({
          field: err.path.join('.'),
          error: err.message,
        })
      } else {
        globalErrors.push(err.message)
      }
    }

    const finalMessage = globalErrors.length > 0 ? globalErrors.join('. ') : errorMessage

    throw new ApiError(400, finalMessage, fieldErrors)
  }

  return result.data
}
