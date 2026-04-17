import * as Pinia from 'pinia'
import { createSSRApp } from 'vue'
import App from './App.vue'
import 'uno.css'

import uvUI from '@climblee/uv-ui'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  app.use(uvUI)
  return {
    app,
    Pinia,
  }
}
