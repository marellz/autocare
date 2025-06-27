import { createKyInstance } from '@/utils/kyCreator'
import type { VendorRequest } from './useVendorRequestService'

export interface Vendor {
  id: number
  name: string
  phone: string
  brands: string[]
  location: string | null
  vendor_requests?: VendorRequest[]
}

export interface NewVendor {
  name: string
  phone: string
  brands: string[]
  location?: string | null
}

export type FindVendorParams= {
  name?: string
  brand?: string
}

const api = createKyInstance('/vendors')

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error || 'Network response was not ok')
  }

  return response.json()
}

export const useVendorService = {
  async getVendors(query: FindVendorParams): Promise<Vendor[]> {
    return handleResponse<{ message: 'ok'; data: Vendor[] }>(await api.get('', {
      searchParams: query,
    })).then(
      (res) => res.data,
    )
  },

  async createVendor(vendorData: NewVendor): Promise<Vendor> {
    return handleResponse<{ message: 'ok'; data: Vendor }>(
      await api.post('', { json: vendorData }),
    ).then((res) => res.data)
  },

  async updateVendor(id: number, update: Partial<Vendor>): Promise<boolean> {
    await handleResponse<{ message: 'ok' | 'error' }>(
      await api.put(id.toString(), { json: update }),
    )
    return true
  },

  async deleteVendor(id: number): Promise<boolean> {
    await handleResponse<{ message: 'ok' | 'error' }>(await api.delete(id.toString()))
    return true
  },
}
