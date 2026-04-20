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

/**
 * 声明 uv-ui 模块的类型。
 * 因为 @climblee/uv-ui 目前没有提供官方的 .d.ts 声明文件，
 * 所以这里手动将其声明为一个标准的 Vue 插件 (Plugin)，
 * 避免在 main.ts 引入和 app.use(uvUI) 时报“隐式具有 any 类型”的错误。
 */
declare module '@climblee/uv-ui' {
  import type { Plugin } from 'vue'

  const uvUI: Plugin
  export default uvUI
}
