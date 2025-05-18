import { computed, ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import api from '@/plugins/api'
import { useLoadingState } from '@/composables/useLoading'

export enum AuthLoading {
  LOGIN = 'login',
  REGISTER = 'login',
  LOGOUT = 'logout',
  GET_USER = 'get-user',
}

export interface User {
  name: string
  id: number,
  email: string
}


export interface LoginPayload {
  email: string
  password: string
}
export interface LoginResponse {
  data?: {
    user: User
    token: string
  }
  error?: string
}

export interface RegisterPayload {}
export interface RegisterResponse {
  data?: {
    user: User
    token: string
  }
  error?: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)

    const authenticated = computed(() => user.value !== null)
    const { begin, finish, isLoading } = useLoadingState()

    const handleError = (error: any) => {}

    const login = async (payload: LoginPayload) => {
      try {
        begin(AuthLoading.LOGIN)
        const { data }: LoginResponse = await api.post('/auth/login', payload)
        if (!data) throw new Error('Invalid response on login')
        if (data.user) user.value = data.user
        return { success: true }
      } catch (error: any) {
        const message = error ?? 'Unknown error on login'
        handleError(message)
        return { success: false, error: message }
      } finally {
        finish(AuthLoading.LOGIN)
      }
    }

    const register = async (payload: RegisterPayload) => {
      try {
        begin(AuthLoading.REGISTER)
        const { data }: RegisterResponse = await api.post('/auth/register', payload)
        if (!data) throw new Error('Invalid response on register')
        if (data.user) user.value = data.user
        return { success: true }
      } catch (error: any) {
        const message = error.response.data.message ?? 'Unknown error on registration'
        handleError(message)
        return { success: false, error: message }
      } finally {
        finish(AuthLoading.REGISTER)
      }
    }

    const logout = async () => {
      try {
        begin(AuthLoading.LOGOUT)
      } catch (error) {
        handleError(error)
      } finally {
        user.value = null
        finish(AuthLoading.LOGOUT)
      }
    }

    const getUser = async () => {
      try {
        begin(AuthLoading.GET_USER)
      } catch (error) {
        handleError(error)
      } finally {
        finish(AuthLoading.GET_USER)
      }
    }

    return {
      user,
      authenticated,
      login,
      logout,
      register,
      getUser,
      isLoading,
    }
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ['user', 'token'],
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
