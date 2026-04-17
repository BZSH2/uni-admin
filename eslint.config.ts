import fs from 'node:fs'
import path from 'node:path'
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
})
