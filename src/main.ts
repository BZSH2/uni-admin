import 'virtual:uno.css'
import './styles/index.scss'
import '@tdesign/uniapp/theme.css'

import * as Pinia from 'pinia'
import { createSSRApp } from 'vue'

import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())

  // 【优化】Vue 全局异常捕获，避免由于组件内部报错导致应用白屏
  app.config.errorHandler = (err, instance, info) => {
    console.error('【Vue 全局异常捕获】', err, '组件信息:', info)
    // TODO: 生产环境下可以在此处接入 Sentry 或其他日志上报系统
  }

  return {
    app,
    Pinia
  }
}
