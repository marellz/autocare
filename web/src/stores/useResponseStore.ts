import { useResponseService } from '@/services/useResponseService'
import { create } from 'zustand'
interface Store {
  sendClientResponse: (request: number, message: string, refund: boolean) => Promise<boolean>
  sendContactResponse: (contact: number, message: string) => Promise<boolean>
  resetError: () => void
  loading: boolean
  error: any
}
const service = useResponseService
const useResponseStore = create<Store>((set) => {
  const loading = false
  const error: any = null
  return {
    loading,
    error,
    async sendClientResponse(request: number, message: string, refund: boolean) {
      try {
        set({ loading: true })
        set({ error: null })
        return await service.sendClientResponse(request, message, refund)
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
        return false
      } finally {
        set({ loading: false })
      }
    },

    async sendContactResponse(contactId: number, message: string) {
      try {
        set({ loading: true })
        set({ error: null })
        return await service.sendContactResponse(contactId, message)
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
        return false
      } finally {
        set({ loading: false })
      }
    },

    resetError() {
      set({ error: null })
    }
  }
})
export default useResponseStore
