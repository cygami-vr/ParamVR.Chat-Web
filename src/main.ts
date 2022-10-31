import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Header from '@/components/Header.vue'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.component('Header', Header)
app.mount('#app')
