import { createKyInstance } from '@/utils/kyCreator'
import type { VendorRequest } from './useVendorRequestService'
import type { RequestParams, ResultParams } from '@/types/pagination'

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
type VendorRequestParams = RequestParams<Vendor>
// export type FindVendorParams= {
//   name?: string
//   brand?: string
// }

const api = createKyInstance('/vendors')

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error || 'Network response was not ok')
  }

  return response.json()
}

type VendorResultParams = ResultParams<Vendor>

export const useVendorService = {
  async getVendors(
    params: VendorRequestParams,
  ): Promise<{ items: Vendor[]; pagination: VendorResultParams }> {
    return handleResponse<{
      message: 'ok'
      data: { items: Vendor[]; pagination: VendorResultParams }
    }>(
      await api.get('', {
        searchParams: params as Record<keyof VendorRequestParams, string | number>,
      }),
    ).then((res) => res.data)
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
