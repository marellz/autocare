import { createKyInstance } from '@/utils/kyCreator'

const api = createKyInstance('/responses')

export const useResponseService = {
  async sendClientResponse(requestId: number, body: string) {
    const response = await api.post('', {
      json: { requestId, body },
    })

    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { message } = await response.json<{ message: 'ok' | 'error' }>()
    return message === 'ok'
  },
}
