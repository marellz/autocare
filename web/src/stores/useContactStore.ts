import type { ContactFormSchema } from '@/schemas/contact.schema'
import {
  useContactService as service,
  type ContactMessage,
  type ContactRequestParams,
} from '@/services/useContactService'
import { create } from 'zustand'

interface Store {
  loading: boolean
  error: string | null
  messages: ContactMessage[]
  params: ContactRequestParams

  getAll: () => Promise<void>
  create: (data: ContactFormSchema) => Promise<boolean>
  update: (id: number, payload: Partial<ContactMessage>) => Promise<void>
  updateParams: (params: Partial<ContactRequestParams>) => void
}

const useContactStore = create<Store>((set) => {
  const loading = false
  const error = null
  const messages: ContactMessage[] = []
  const params: ContactRequestParams = {
    query: '',
    page: 1,
    limit: 10,
    sort_by: 'id',
    page_count: 0,
    total: 0,
    sort_order: 'ASC',
  }

  const updateParams = async (newParams: Partial<ContactRequestParams>) => {
    set((state) => ({
      params: {
        ...state.params,
        ...newParams,
      },
    }))

    await getAll()
  }

  const getAll = async () => {
    set({ loading: true, error: null })
    try {
      const params = useContactStore.getState().params
      delete params.total
      delete params.page_count
      const { items: messages, pagination } = await service.getMessages(params)
      const { page_count, total } = pagination
      set({ messages, error: null, params: { ...params, page_count, total } })
    } catch (err) {
      console.error('Error fetching contact messages:', err)
      set({ error: err instanceof Error ? err.message : String(err) })
    } finally {
      set({ loading: false })
    }
  }

  const create = async (payload: ContactFormSchema) => {
    set({ loading: true, error: null })
    try {
      const data = await service.create(payload)
      if (data === null) {
        throw new Error('Failed to create contact message')
      }

      return true
    } catch (err) {
      console.error('Error creating contact message:', err)
      set({ error: err instanceof Error ? err.message : String(err) })
      return false
    } finally {
      set({ loading: false })
    }
  }

  const update = async (id: number, payload: Partial<ContactMessage>) => {
    set({ loading: true, error: null })
    try {
      const updated = await service.update(id, payload)
      if (!updated) {
        throw new Error('Failed to update contact message')
      }

      set((state) => {
        const updatedMessages = state.messages.map((msg) =>
          msg.id === id ? { ...msg, ...payload } : msg,
        )
        return { messages: updatedMessages }
      })

    } catch (err) {
      console.error('Error updating contact message:', err)
      set({ error: err instanceof Error ? err.message : String(err) })
    } finally {
      set({ loading: false })
    }
  }

  return {
    loading,
    error,
    create,
    update,
    messages,
    getAll,
    params,
    updateParams,
  }
})

export default useContactStore
