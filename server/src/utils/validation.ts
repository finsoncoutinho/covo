import { z } from 'zod'
import { ApiError } from './ApiError.js'

export type ValidationError = {
  field: string
  error: string
}

export const validateRequest = <T>(
  schema: z.ZodType<T>,
  data: unknown,
  errorMessage = 'Validation failed',
  formatAsFieldErrors = true
): T => {
  const result = schema.safeParse(data)

  if (!result.success) {
    const fieldErrors: ValidationError[] = []
    const globalErrors: string[] = []

    for (const err of result.error.issues) {
      if (formatAsFieldErrors && err.path.length > 0) {
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
