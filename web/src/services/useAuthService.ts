import { createKyInstance } from '@/utils/kyCreator'

export interface User {
  id: number
  name: string
  email: string
}

export interface LoginPayload {
  username: string
  password: string
}

const NetworkError = 'Network/server error'
const api = createKyInstance('/auth')

export const useAuthService = {
  async login(payload: LoginPayload) {
    try {
      const response = await api.post('login', {
        json: payload,
      })

      if (!response.ok) {
        const errorData: any = await response.json<{ error: string }>().catch(() => null) // sometimes no JSON
        console.log({ herer: errorData })
        return { data: undefined, error: errorData?.error ?? NetworkError }
      }

      return await response.json<{
        message: 'ok' | 'error'
        data?: { user: User }
        error?: string
      }>()
    } catch (error: any) {
      const { error: e } = await error.response.json()
      return {
        error: e as string,
        data: undefined,
      }
    }
  },

  async logout() {
    try {
      const response = await api.post('logout')
      if (!response.ok) return { message: 'error', error: NetworkError }
      return await response.json<{
        message: 'ok' | 'error'
        error?: string
      }>()
    } catch (error: any) {
      const { error: e } = await error.response.json()
      return {
        error: e,
      }
    }
  },

  async getUser() {
    try {
      const response = await api.get('user')

      if (!response.ok) return { data: undefined, error: NetworkError }

      return await response.json<{
        message: 'ok' | 'error'
        data?: { user: User }
        error?: string
      }>()
    } catch (error: any) {
      const { error: e } = await error.response.json()
      return {
        data: undefined,
        error: e,
      }
    }
  },
}
