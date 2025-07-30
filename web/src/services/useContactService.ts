import type { ContactFormSchema } from '@/schemas/contact.schema'
import { createKyInstance } from '@/utils/kyCreator'
import type { SearchParamsOption } from 'ky'

export const ContactMessageStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'closed', label: 'Closed' },
] // todo: change this when re-configured on the API
export type ContactMessageStatus = (typeof ContactMessageStatuses)[number]['value']

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  status: ContactMessageStatus
  createdAt: string
  updatedAt: string | null
  closedAt: string | null
}

export interface ContactRequestParams {
  status?: ContactMessageStatus,
  query?: string
  page?: number
  page_count?: number
  total?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
}

const api = createKyInstance('/contact')
export const useContactService = {
  async getMessages(params: ContactRequestParams) {
    const response = await api.get('', {
      searchParams: params as SearchParamsOption,
    })

    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { data } = await response.json<{
      message: string
      data: { items: ContactMessage[]; pagination: ContactRequestParams }
    }>()
    return data || []
  },
  create: async (payload: ContactFormSchema) => {
    const response = await api.post('', {
      json: payload,
    })

    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { data } = await response.json<{ message: string; data: ContactMessage | null }>()
    return data
  },
  update: async (id: number, payload: Partial<ContactMessage>) => {
    const response = await api.put(`${id}`, {
      json: payload,
    })

    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { updated } = await response.json<{ message: string; updated: boolean }>()
    return updated
  },
}
