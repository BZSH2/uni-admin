import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import uniHelper from '@uni-helper/eslint-config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const eslintignorePath = path.resolve(__dirname, '.eslintignore')

function getIgnores(filePath: string) {
  try {
    return fs
      .readFileSync(filePath, 'utf-8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
  } catch {
    return []
  }
}

export default uniHelper({
  ignores: getIgnores(eslintignorePath),
  plugins: {
    'simple-import-sort': simpleImportSort
  },
  rules: {
    // === 核心业务逻辑放宽 ===
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // === 字符与单双引号相关 ===
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }], // 强制使用单引号，允许字符串模板
    'jsx-quotes': ['error', 'prefer-single'], // JSX 中强制使用单引号

    // === Import 排序相关 ===
    'perfectionist/sort-imports': 'off', // 禁用默认的排序规则，防止与 simple-import-sort 冲突
    'perfectionist/sort-named-imports': 'off',
    'perfectionist/sort-exports': 'off',
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // === Vue 相关放宽 ===
    'vue/multi-word-component-names': 'off', // 允许单单词组件名 (在 pages/index.vue 等场景极其常见)
    'vue/no-v-html': 'off', // 允许使用 v-html，富文本解析常见
    'vue/require-default-prop': 'off', // props 不强制要求默认值

    // === TS 相关放宽 ===
    '@typescript-eslint/no-explicit-any': 'off', // 业务代码中无可避免会用到 any
    '@typescript-eslint/ban-ts-comment': 'off', // 允许 @ts-ignore 等注释
    '@typescript-eslint/no-non-null-assertion': 'off', // 允许 obj!.property 非空断言
    'no-undef': 'off', // 结合 unplugin-auto-import 解决全局变量未定义报错
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ] // 允许使用 _ 开头的未使用的变量
  }
}).append(eslintPluginPrettierRecommended)
