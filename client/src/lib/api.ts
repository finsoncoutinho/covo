import axios from 'axios'

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login')
    ) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await api.post('/auth/refresh')

        return api(originalRequest)
      } catch {
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname
          
          const protectedRoutes = [
            '/dashboard',
            '/rooms',
            '/profile',
            '/settings',
            '/workspaces',
          ]
          
          const isProtectedRoute = protectedRoutes.some((route) =>
            currentPath.startsWith(route),
          )
          
          if (isProtectedRoute) {
            window.location.href = '/login'
          }
        }
      }
    }

    return Promise.reject(error)
  },
)
