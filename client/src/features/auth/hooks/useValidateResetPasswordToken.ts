import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const useValidateResetPasswordToken = (token: string) => {
  return useQuery({
    queryKey: ['validateResetToken', token],

    queryFn: async () => {
      const response = await api.get(
        `/auth/validate-reset-token?token=${token}`,
      )

      return response.data.data
    },

    enabled: !!token,
  })
}
