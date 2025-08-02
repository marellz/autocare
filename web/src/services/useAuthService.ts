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

export interface PasswordResetRequestPayload {
  email: string
  token: string
}

export interface PasswordResetPayload {
  password: string
  confirmPassword: string
  token: string
  secure_token: string
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
        const errorData: any = await response.json<{ error: string }>().catch(() => null)
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

  // password reset
  async requestPasswordReset(payload: PasswordResetRequestPayload) {
    try {
      const response = await api.post('recover-password', {
        json: payload,
      })

      if (!response.ok) {
        const errorData: any = await response.json<{ error: string }>().catch(() => null)
        return { sent: false, error: errorData?.error ?? NetworkError }
      }

      const { sent } = await response.json<{ message: 'ok' | 'error'; sent: boolean }>()

      return { sent }
    } catch (error: any) {
      const { error: e } = await error.response.json()
      return {
        sent: false,
        error: e as string,
      }
    }
  },

  async submitPasswordReset(payload: PasswordResetPayload) {
    try {
      const response = await api.post('reset-password', {
        json: payload,
      })

      if (!response.ok) {
        const errorData: any = await response.json<{ error: string }>().catch(() => null)
        return { updated: false, error: errorData?.error ?? NetworkError }
      }

      const { updated } = await response.json<{ message: 'ok' | 'error'; updated: boolean }>()

      return { updated }
    } catch (error: any) {
      const { error: e } = await error.response.json()
      return {
        updated: false,
        error: e as string,
      }
    }
  },

  async verifyToken(token: string) {
    try {
      const response = await api.post('reset-password/verify-token', {
        json: { token },
      })

      if (!response.ok) {
        const errorData: any = await response.json<{ error: string }>().catch(() => null)
        return { valid: false, error: errorData?.error ?? NetworkError }
      }

      const { valid } = await response.json<{ message: 'ok' | 'error'; valid: true }>()

      return { valid }
    } catch (error: any) {
      const { error: e } = await error.response.json()
      return {
        valid: false,
        error: e as string,
      }
    }
  },
}
