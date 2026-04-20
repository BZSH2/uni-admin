import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import Uni from '@uni-helper/plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'uni-app', 'pinia'],
      dts: 'src/types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    // https://uni-helper.js.org/vite-plugin-uni-components
    Components({
      dts: 'src/types/components.d.ts',
      resolvers: []
    }),
    // https://uni-helper.js.org/plugin-uni
    Uni(),
    UnoCSS()
  ],
  esbuild: {
    // 生产环境自动移除 console 和 debugger
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  build: {
    // 生产环境禁用 sourcemap 减小打包体积
    sourcemap: false,
    // chunk 大小警告的限制
    chunkSizeWarningLimit: 1024
  }
})
