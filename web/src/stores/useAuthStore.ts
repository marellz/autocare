import {
  useAuthService,
  type LoginPayload,
  type PasswordResetPayload,
  type PasswordResetRequestPayload,
  type User,
} from '@/services/useAuthService'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
interface Store {
  login: (payload: LoginPayload) => Promise<boolean>
  logout: () => Promise<boolean>

  requestPasswordReset: (payload: PasswordResetRequestPayload) => Promise<boolean>
  resetPassword: (payload: PasswordResetPayload) => Promise<boolean>

  user: User | null
  loading: boolean
  error: string | null
}

const service = useAuthService
const useAuthStore = create<Store>()(
  persist(
    (set) => {
      const user: User | null = null
      const loading: boolean = false
      const error: string | null = null

      const login = async (payload: LoginPayload) => {
        set({ loading: true, error: null })

        const response = await service.login(payload)
        if (response) {
          set({ loading: false })
        }

        const { error, data } = response
        if (data) {
          set({ user: data.user })
          return true
        }
        if (error) set({ error })
        return false
      }

      const logout = async () => {
        set({ loading: true, error: null, user: null })

        const response = await service.logout()
        if (response) {
          set({ loading: false })
        }

        const { error, message } = response

        if (error) throw new Error(error)
        if (error || message !== 'ok') {
          set({ error: error ?? 'Error logging out' })
          return false
        } else {
          return true
        }
      }

      const requestPasswordReset = async (payload: PasswordResetRequestPayload) => {
        try {
          set({ loading: true, error: null })
          const { success } = await service.requestPasswordReset(payload)
          return success
        } catch (error) {
          console.error('Error resetting password', error)
          set({ error: error instanceof Error ? error.message : String(error) })
          return false
        } finally {
          set({ loading: false })
        }
      }

      const resetPassword = async (payload: PasswordResetPayload) => {
        try {
          set({ loading: true, error: null })
          const { success } = await service.submitPasswordReset(payload)
          return success
        } catch (error) {
          console.error('Error resetting password', error)
          set({ error: error instanceof Error ? error.message : String(error) })
          return false
        } finally {
          set({ loading: false })
        }
      }

      return {
        error,
        loading,
        user,

        login,
        logout,

        requestPasswordReset,
        resetPassword,
      }
    },
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

export default useAuthStore
