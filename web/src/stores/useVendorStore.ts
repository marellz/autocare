import {
  useVendorService as service,
  type NewVendor,
  type Vendor,
  type VendorRequestParams,
  type VendorResultParams,
} from '@/services/useVendorService'
import { create } from 'zustand'

export const brandOptions = [
  'Toyota',
  'Honda',
  'Nissan',
  'Ford',
  'Chevrolet',
  'Volkswagen',
  'Hyundai',
  'Kia',
  'Mazda',
  'Subaru',
  'Mercedes-Benz',
  'BMW',
  'Audi',
  'Lexus',
  'Porsche',
]

interface Store {
  vendors: Vendor[]
  loading: boolean
  error: string | undefined
  resultParams: VendorResultParams
  requestParams: VendorRequestParams

  getVendors: () => Promise<void>
  createVendor: (payload: NewVendor) => Promise<void>
  deleteVendor: (id: number) => Promise<void>
  updateVendor: (id: number, updated: Partial<Vendor>) => Promise<void>

  updateParams: (params:Partial<VendorRequestParams>) => void
}

const useVendorStore = create<Store>((set) => {
  const vendors: Vendor[] = []

  const loading: boolean = false
  const error: string | undefined = undefined

  const resultParams: VendorResultParams = {
    page_count: 1,
    count: 0,
  }

  const requestParams: VendorRequestParams = {
    query: '',
    brand: '',
    page: 1,
    limit: 10,
    sort_by: 'id',
    sort_order: 'ASC',
  }

  const updateParams = (params: Partial<VendorRequestParams>) => {
    set((state) => ({ requestParams: { ...state.requestParams, ...params } }))

    getVendors()
  }

  const getVendors = async () => {
    try {
      set({ loading: true })
      const { requestParams } = useVendorStore.getState()
      const { items: vendors, pagination } = await service.getVendors(requestParams)
      set({ vendors, resultParams: pagination })
    } catch (error) {
      console.error('Error fetching vendors:', error)
      set({ error: error as string })
    } finally {
      set({ loading: false })
    }
  }

  const createVendor = async (vendor: NewVendor) => {
    try {
      set({ loading: true })
      const newVendor = await service.createVendor(vendor)
      set((state) => ({ vendors: [newVendor, ...state.vendors] }))
    } catch (error) {
      console.error('Error creating vendor:', error)
      set({ error: error as string })
    } finally {
      set({ loading: false })
    }
  }

  const updateVendor = async (id: number, updated: Partial<Vendor>) => {
    try {
      set({ loading: true })
      await service.updateVendor(id, updated)
      set((state) => ({
        vendors: state.vendors.map((vendor) =>
          vendor.id === id ? { ...vendor, ...updated } : vendor,
        ),
      }))
    } catch (error) {
      console.error('Error updating vendor:', error)
      set({ error: error as string })
    } finally {
      set({ loading: false })
    }
  }

  const deleteVendor = async (id: number) => {
    try {
      set({ loading: true })
      await service.deleteVendor(id)
      set((state) => ({
        vendors: state.vendors.filter((vendor) => vendor.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting vendor:', error)
      set({ error: error as string })
    } finally {
      set({ loading: false })
    }
  }

  return {
    vendors,
    loading,
    error,

    getVendors,
    createVendor,
    deleteVendor,
    updateVendor,

    requestParams,
    resultParams,
    updateParams,
  }
})
export default useVendorStore
