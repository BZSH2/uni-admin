/// <reference types="vite/client" />

/**
 * Vite 环境变量智能提示
 */
interface ImportMetaEnv {
  readonly UNI_PLATFORM: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_REQUEST_TIMEOUT: string
  readonly VITE_APP_ENABLE_MOCK: string
  readonly VITE_APP_ENABLE_VCONSOLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * 声明 .vue 文件的模块类型，
 * 让 TypeScript 能够正确识别 import MyComponent from './MyComponent.vue' 这种语法。
 *
 * 使用 Record<string, unknown> 代替 {} 来表示任意对象，
 * 以符合严格模式下的 @typescript-eslint/ban-types 规则规范。
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
