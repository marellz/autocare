import { createKyInstance } from '@/utils/kyCreator'
import type { VendorRequest } from './useVendorRequestService'
import type { RequestParams, ResultParams } from '@/types/pagination'
import type { SearchParamsOption } from 'ky'

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
export type VendorRequestParams = RequestParams<Vendor> & { brand?: string }
export type VendorResultParams = ResultParams<Vendor> & { brand?: string }

const api = createKyInstance('/vendors')

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error || 'Network response was not ok')
  }

  return response.json()
}

export const useVendorService = {
  async getVendors(
    params: VendorRequestParams,
  ): Promise<{ items: Vendor[]; pagination: VendorResultParams }> {
    return handleResponse<{
      message: 'ok'
      data: { items: Vendor[]; pagination: VendorResultParams }
    }>(
      await api.get('', {
        searchParams: params as SearchParamsOption,
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
