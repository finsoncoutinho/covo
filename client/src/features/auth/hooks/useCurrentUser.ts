import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { User } from '../types/user'

export const useCurrentUser = () => {
  const query = useQuery<User>({
    queryKey: ['currentUser'],

    queryFn: async () => {
      const response = await api.get('/auth/me')

      return response.data.data
    },

    retry: false,
  })

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
