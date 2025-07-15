import {
  useVendorRequestService as service,
  type FindVendorRequestParams,
  type NewVendorRequest,
  type VendorRequest,
} from '@/services/useVendorRequestService'
import { create } from 'zustand'

interface Store {
  vendorRequests: VendorRequest[]
  loading: boolean
  error: any

  getVendorRequests: (query?: FindVendorRequestParams) => Promise<void>
  createVendorRequest: (payload: NewVendorRequest) => Promise<void>
  deleteVendorRequest: (id: number) => Promise<void>
}

const useVendorRequestStore = create<Store>((set) => {
  return {
    vendorRequests: [],
    loading: false,
    error: null,

    getVendorRequests: async (query: FindVendorRequestParams = {}) => {
      try {
        set({ error: null })
        set({ loading: true })
        const vendorRequests = await service.getVendorRequests(query)
        set({ vendorRequests })
      } catch (error) {
        set({ error: error })
        console.error('Error fetching vendor requests:', error)
      } finally {
        set({ loading: false })
      }
    },

    createVendorRequest: async (payload: NewVendorRequest) => {
      set({ error: null })
      set({ loading: true })
      try {
        await service.createVendorRequest(payload)
      } catch (error) {
        set({ error: error })
        console.error('Error creating vendor request:', error)
      } finally {
        set({ loading: false })
      }
    },

    deleteVendorRequest: async (id: number) => {
      set({ error: null })
      set({ loading: true })
      try {
        await service.deleteVendorRequest(id)
        set((state) => ({
          vendorRequests: state.vendorRequests.filter((request) => request.id !== id),
        }))
      } catch (error) {
        set({ error: error })
        console.error('Error deleting vendor request:', error)
      } finally {
        set({ loading: false })
      }
    },
  }
})

export default useVendorRequestStore
