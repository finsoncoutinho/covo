import { isAxiosError } from 'axios'

export const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}
