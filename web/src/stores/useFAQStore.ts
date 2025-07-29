import { useFAQService as service, type FAQ, type NewFAQ } from '@/services/useFAQService'
import { create } from 'zustand'

interface Store {
  faqs: FAQ[]
  loading: boolean
  error: string | null
  getAll: () => Promise<void>
  getById: (id: number) => Promise<FAQ | null>

  create: (payload: NewFAQ) => Promise<void>
  update: (id: number, payload: Partial<FAQ>) => Promise<void>
  destroy: (id: number) => Promise<void>
}

const useFAQStore = create<Store>((set) => {
  const faqs: FAQ[] = []
  const loading: boolean = false
  const error: string | null = null

  const getAll = async () => {
    set({ loading: true, error: null })
    try {
      const faqs = await service.getAll()
      set({ faqs })
    } catch (error) {
      console.error('Error getting FAQs', error)
      set({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      set({ loading: false })
    }
  }
  const getById = async (id: number) => {
    set({ loading: true, error: null })
    try {
      return await service.getById(id)
    } catch (error) {
      console.error('Error getting FAQ', error)
      set({ error: error instanceof Error ? error.message : String(error) })
      return null
    } finally {
      set({ loading: false })
    }
  }

  const create = async (payload: NewFAQ) => {
    set({ loading: true, error: null })
    try {
      const faq = await service.create(payload)
      if (faq) {
        set((state) => ({
          faqs: [...state.faqs, faq],
        }))
      }
    } catch (error) {
      console.error('Error creating FAQ', error)
      set({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      set({ loading: false })
    }
  }

  const update = async (id: number, payload: Partial<FAQ>) => {
    set({ loading: true, error: null })
    try {
      const updated = await service.update(id, payload)
      if (updated) {
        set((state) => ({
          faqs: state.faqs.map((f) => (f.id === id ? { ...f, ...payload } : f)),
        }))
      }
    } catch (error) {
      console.error('Error updating FAQ', error)
      set({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      set({ loading: false })
    }
  }

  const destroy = async (id: number) => {
    set({ loading: true, error: null })
    try {
      const ok = await service.destroy(id)
      if (ok) {
        set((state) => ({
          faqs: state.faqs.filter((f) => f.id !== id),
        }))
      }
    } catch (error) {
      console.error('Error deleting FAQ', error)
      set({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      set({ loading: false })
    }
  }

  return {
    faqs,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    destroy,
  }
})

export default useFAQStore
