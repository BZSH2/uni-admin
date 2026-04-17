import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import uniHelper from '@uni-helper/eslint-config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const eslintignorePath = path.resolve(__dirname, '.eslintignore')

function getIgnores(filePath: string) {
  try {
    return fs
      .readFileSync(filePath, 'utf-8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
  }
  catch {
    return []
  }
}

export default uniHelper({
  ignores: getIgnores(eslintignorePath),
  rules: {
    // === 核心业务逻辑放宽 ===
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // === Vue 相关放宽 ===
    'vue/multi-word-component-names': 'off', // 允许单单词组件名 (在 pages/index.vue 等场景极其常见)
    'vue/no-v-html': 'off', // 允许使用 v-html，富文本解析常见
    'vue/require-default-prop': 'off', // props 不强制要求默认值

    // === TS 相关放宽 ===
    '@typescript-eslint/no-explicit-any': 'off', // 业务代码中无可避免会用到 any
    '@typescript-eslint/ban-ts-comment': 'off', // 允许 @ts-ignore 等注释
    '@typescript-eslint/no-non-null-assertion': 'off', // 允许 obj!.property 非空断言
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ], // 允许使用 _ 开头的未使用的变量
  },
})
