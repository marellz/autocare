import { createKyInstance } from "@/utils/kyCreator"

export interface VendorRequest {
  id: number
  vendor_id: number
  request_id: number
}

export interface NewVendorRequest {
  vendorId: number
  requestId: number
}

export type FindVendorRequestParams = {
  vendorId?: number
  requestId?: number
}

const api = createKyInstance('/vendor-requests')

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error || 'Network response was not ok')
  }

  return response.json()
}

export const useVendorRequestService = {
  async getVendorRequests(query: FindVendorRequestParams = {}): Promise<VendorRequest[]> {
    return handleResponse<{ message: 'ok'; data: VendorRequest[] }>(
      await api.get('', { searchParams: query }),
    ).then((res) => res.data)
  },

  async createVendorRequest(requestData: NewVendorRequest): Promise<VendorRequest> {
    return handleResponse<{ message: 'ok'; data: VendorRequest }>(
      await api.post('', { json: requestData }),
    ).then((res) => res.data)
  },

  async deleteVendorRequest(id: number): Promise<boolean> {
    await handleResponse<{ message: 'ok' | 'error' }>(await api.delete(id.toString()))
    return true
  },
}
