# 编辑器配置 (Editor Setup)

推荐使用 **VSCode** 进行开发，以获得最佳的开发体验。

本项目在 `.vscode/settings.json` 中提供了一系列开箱即用的配置，以确保“保存即自动格式化”和“代码风格统一”等功能。

## 核心配置项

### 1. 保存自动格式化与修复

开启了相关配置以确保当你按下 `Ctrl + S` 时，编辑器会自动处理格式和常见问题：

- `"editor.formatOnSave": true`: 开启保存时自动格式化。
- `"editor.defaultFormatter": "esbenp.prettier-vscode"`: 指定 Prettier 为默认格式化工具。
- `"editor.codeActionsOnSave"`:
  - `"source.fixAll.eslint": "explicit"`: 保存文件时自动执行 ESLint 修复。
  - `"source.fixAll.stylelint": "explicit"`: 保存 SCSS/CSS 时自动执行 Stylelint 修复。

### 2. 文件资源管理器嵌套 (File Nesting)

开启了 `explorer.fileNesting.enabled`，将相关的配置文件折叠到对应的主文件下，保持左侧资源管理器的根目录清爽整洁。

例如：

- **`package.json`** 会收纳：`pnpm-lock.yaml`, `tsconfig.json`, `.npmrc`, `.gitignore` 等。
- **`vite.config.ts`** 会收纳：`*.html`, `uno.config.ts`, `vitest.config.ts` 等。
- **`eslint.config.ts`** 会收纳：`.eslintignore`, `.prettierrc.json`, `.stylelintrc.json`, `.commitlintrc.json` 等所有格式化配置文件。

### 3. 拼写检查 (cSpell)

配置了 `cSpell.words` 以忽略项目特定的框架术语（如 `uniapp`, `kuaishou`, `dcloudio`, `climblee` 等），减少无效的拼写错误警告。
