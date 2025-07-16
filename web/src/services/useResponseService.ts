import { createKyInstance } from '@/utils/kyCreator'

const api = createKyInstance('/responses')

export const useResponseService = {
  async sendClientResponse(requestId: number, body: string, refund: boolean) {
    const response = await api.post('', {
      json: { requestId, body, refund },
    })

    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { message } = await response.json<{ message: 'ok' | 'error' }>()
    return message === 'ok'
  },
}
