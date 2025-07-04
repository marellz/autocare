import type { RequestParams } from '@/types/pagination'
import { createKyInstance } from '@/utils/kyCreator'
import type { SearchParamsOption } from 'ky'

export const requestStatuses = ['missing_details', 'submitted', 'pending', 'completed']
export type RequestStatus = (typeof requestStatuses)[number]
export interface Request {
  id: number
  phone: string
  name: string
  createdAt: string
  channel: 'web' | 'whatsapp'
  status: RequestStatus
  updatedAt: string | null
  originalMessages: string[]
}

export interface NewRequest {
  phone: string
  item: string
  channel: 'web'
  name: string
}

const api = createKyInstance('/requests')

export const useRequestService = {
  async getRequests(params: RequestParams<Request>) {
    const response = await api.get('', {
      searchParams: params as SearchParamsOption,
    })
    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { data } = await response.json<{
      messsage: 'ok'
      data: { items: Request[]; pagination: RequestParams<Request> }
    }>()

    return data
  },

  async createRequest(request: NewRequest) {
    const response = await api.post('', {
      json: request,
    })

    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { data } = await response.json<{ message: 'ok'; data: Request }>()
    return data
  },

  async updateRequest(id: number, updated: Partial<Request>) {
    const response = await api.put(id.toString(), {
      json: updated,
    })

    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { message } = await response.json<{ message: 'ok' | 'error' }>()
    return message === 'ok'
  },
}
