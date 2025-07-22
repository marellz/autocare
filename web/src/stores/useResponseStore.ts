import { useResponseService } from '@/services/useResponseService'
import { create } from 'zustand'
interface Store {
  sendClientResponse: (request: number, message: string, refund: boolean) => Promise<boolean>
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
        set({ error: error as string })
        return false
      } finally {
        set({ loading: false })
      }
    },
  }
})
export default useResponseStore
