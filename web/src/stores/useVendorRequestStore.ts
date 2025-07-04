import {
  useVendorRequestService as service,
  type FindVendorRequestParams,
  type NewVendorRequest,
  type VendorRequest,
} from '@/services/useVendorRequestService'
import { create } from 'zustand'

interface Store {
  vendorRequests: VendorRequest[]

  getVendorRequests: (query?: FindVendorRequestParams) => Promise<void>
  createVendorRequest: (payload: NewVendorRequest) => Promise<void>
  deleteVendorRequest: (id: number) => Promise<void>
}

const useVendorRequestStore = create<Store>((set) => {
  return {
    vendorRequests: [],

    getVendorRequests: async (query: FindVendorRequestParams = {}) => {
      try {
        const vendorRequests = await service.getVendorRequests(query)
        set({ vendorRequests })
      } catch (error) {
        console.error('Error fetching vendor requests:', error)
      }
    },

    createVendorRequest: async (payload: NewVendorRequest) => {
      try {
        await service.createVendorRequest(payload)
      } catch (error) {
        console.error('Error creating vendor request:', error)
      }
    },

    deleteVendorRequest: async (id: number) => {
      try {
        await service.deleteVendorRequest(id)
        set((state) => ({
          vendorRequests: state.vendorRequests.filter((request) => request.id !== id),
        }))
      } catch (error) {
        console.error('Error deleting vendor request:', error)
      }
    },
  }
})

export default useVendorRequestStore
