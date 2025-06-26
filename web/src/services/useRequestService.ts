import { createKyInstance } from '@/utils/kyCreator'

export interface Request {
  id: number
  phone: string
  name: string
  createdAt: string
  channel: 'web' | 'whatsapp'
  status: string
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
  async getRequests() {
    const response = await api.get('')
    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { data } = await response.json<{ messsage: 'ok'; data: Request[] }>()

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
