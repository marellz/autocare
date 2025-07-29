import type { ContactFormSchema } from '@/schemas/contact.schema'
import { createKyInstance } from '@/utils/kyCreator'

interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  createdAt: string
  updatedAt: string | null
  closedAt: string | null
}

const api = createKyInstance('/contact')
export const useContactService = {
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
}
