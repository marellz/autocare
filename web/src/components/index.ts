import type { Component } from 'vue'
import Container from '@/components/base/container.vue'
import Loader from '@/components/base/loader.vue'


export const components: Record<string, Component> = {
  'base-container': Container,
  'base-loader': Loader,
}
