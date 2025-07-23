import { useAuthService, type LoginPayload, type User } from '@/services/useAuthService'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
interface Store {
  login: (payload: LoginPayload) => Promise<boolean>
  logout: () => Promise<boolean>

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
        set({ loading: true })
        set({ error: null })

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
        set({ loading: true })
        set({ error: null })
        set({ user: null })

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

      return {
        error,
        loading,
        user,

        login,
        logout,
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
