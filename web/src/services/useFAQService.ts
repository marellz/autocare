import { createKyInstance } from '@/utils/kyCreator'

export interface NewFAQ {
  title: string
  content: string
}

export interface FAQ extends NewFAQ {
  id: number
}

const api = createKyInstance('/faq')

export const useFAQService = {
  async getAll() {
    const response = await api.get('')
    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { data } = await response.json<{ message: 'ok'; data: FAQ[] }>()
    return data
  },
  async getById(id: number) {
    const response = await api.get(`${id}`)
    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { data } = await response.json<{ message: 'ok'; data: FAQ | null }>()
    return data
  },
  async create(faq: NewFAQ) {
    const response = await api.post('', {
      json: faq,
    })

    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { data } = await response.json<{ message: 'ok'; data: FAQ | null }>()
    return data
  },
  async update(id: number, faq: Partial<FAQ>) {
    const response = await api.put(`${id}`, {
      json: faq,
    })

    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { updated } = await response.json<{ message: 'ok'; updated: boolean }>()
    return updated
  },
  async destroy(id: number) {
    const response = await api.delete(`${id}`)

    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { message } = await response.json<{ message: 'ok' }>()
    return message === 'ok'
  },
}
