import type { ResultParams, RequestParams } from '@/types/pagination'
import { createKyInstance } from '@/utils/kyCreator'
import type { SearchParamsOption } from 'ky'

export const requestStatuses = [
  { label: "Missing details", value: 'missing_details' },
  { label: "Submitted", value: 'submitted' },
  { label: "Pending", value: 'pending' },
  { label: "Completed", value: 'completed' },
]
export const requestChannels = [
  { label: 'Web', value: 'web' },
  { label: 'Whatsapp', value: 'whatsapp' },
  { label: 'SMS', value: 'sms' },
]
export const requestStatusLabels: Record<RequestStatus, string> = {
  missing_details: 'Missing details',
  submitted: 'Submitted',
  pending: 'Pending',
  completed: 'Completed',
}
export const requestCapturedDetails = ['partName','carBrand', 'carModel','carVariant','carYear', 'engineSize','transmission','bodyType']

export type RequestCapturedDetails = (typeof requestCapturedDetails)[number]
export type RequestChannel = (typeof requestChannels)[number]['value']
export type RequestStatus = (typeof requestStatuses)[number]['value']

export interface Request {
  id: number
  phone: string
  name: string
  channel: RequestChannel
  capturedDetails: Partial<Record<RequestCapturedDetails, any>>
  missingDetails: RequestCapturedDetails[]
  status: RequestStatus
  createdAt: string
  updatedAt: string | null
  fulfilledAt: string | null // todo: confirm/enact this update
  originalMessages: string[]
}

export interface NewRequest {
  phone: string
  item: string
  channel: 'web'
  name: string
}

export type RequestRequestParams = RequestParams<Request> & {
  status?: RequestStatus
  channel?: RequestChannel
  phone?: string
}

export type RequestResultParams = ResultParams<Request> & {
  status?: RequestStatus
  channel?: RequestChannel
  phone?: string
}

const api = createKyInstance('/requests')

export const useRequestService = {
  async getRequests(params: RequestRequestParams) {
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
