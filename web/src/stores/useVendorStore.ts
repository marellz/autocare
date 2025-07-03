import {
  useVendorService as service,
  type NewVendor,
  type Vendor,
} from '@/services/useVendorService'
import type { RequestParams, ResultParams } from '@/types/pagination'
import { create } from 'zustand'

type VendorRequestParams = RequestParams<Vendor>
type VendorResultParams = ResultParams<Vendor>
interface Store {
  vendors: Vendor[]
  loading: boolean
  error: string | undefined
  resultParams: VendorResultParams

  getVendors: (params: VendorRequestParams) => Promise<void>
  createVendor: (payload: NewVendor) => Promise<void>
  deleteVendor: (id: number) => Promise<void>
  updateVendor: (id: number, updated: Partial<Vendor>) => Promise<void>

  handlePaginationChange: (page: number, limit: number) => void
}

const useVendorStore = create<Store>((set) => {
  const vendors: Vendor[] = []

  const loading: boolean = false
  const error: string | undefined = undefined

  const resultParams: ResultParams<Vendor> = {
    page_count: 1,
    count: 0,
  }

  const handlePaginationChange = (page: number, limit: number) => {
    getVendors({
      page,
      limit,
    })
  }

  const getVendors = async ({
    page = 1,
    limit = 10,
    sort_by = 'id',
    sort_order = 'ASC',
  }: VendorResultParams) => {
    try {
      set({ loading: true })
      const { items: vendors, pagination } = await service.getVendors({
        page,
        limit,
        sort_by,
        sort_order,
      })
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

    resultParams,
    handlePaginationChange,
  }
})
export default useVendorStore
