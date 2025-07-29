import type { ContactFormSchema } from '@/schemas/contact.schema'
import { useContactService as service } from '@/services/useContactService'
import { create } from 'zustand'

interface Store {
  loading: boolean
  error: string | null

  create: (data: ContactFormSchema) => Promise<boolean>
}

const useContactStore = create<Store>((set) => {
  const loading = false
  const error = null
  
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

  return {
    loading,
    error,
    create,
  }
})

export default useContactStore
