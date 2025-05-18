import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { components } from './components'

import './assets/style/main.css'

import App from './app.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
for(const _name in components) {
    app.component(_name, components[_name])
}
app.mount('#app')
