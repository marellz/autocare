import { ref } from 'vue'

export const useLoadingState = () => {
  const loading = ref<string[]>([])

  const begin = (key: string) => {
    if (!loading.value.includes(key)) loading.value = [...loading.value, key]
  }

  const finish = (key: string) => {
    const _loading = [...loading.value]
    const i = _loading.indexOf(key)
    if (i !== -1) {
      _loading.splice(i, 1)
      loading.value = _loading
    }
  }

  const isLoading = (key: string) => {
    return loading.value.includes(key)
  }

  return {
    loading,
    begin,
    finish,
    isLoading,
  }
}
