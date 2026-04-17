# 代码规范与提交规范 (Linting & Formatting)

本项目集成了业界主流的工具链来保证代码质量和统一代码风格，并通过放宽部分业务规则来保证开发的“松紧得当”。

## 核心工具

- **ESLint (v9 Flat Config)**: 负责检查和修复 JavaScript/TypeScript/Vue 代码的语法和格式问题。
  - 配置文件：`eslint.config.ts`
  - 忽略文件：`.eslintignore`
- **Prettier**: 负责所有类型文件的代码排版和格式化。
  - 配置文件：`.prettierrc.json`
  - 忽略文件：`.prettierignore`
- **Stylelint**: 负责检查和修复 CSS/SCSS/Vue 样式问题，已完美兼容 Tailwind/UnoCSS 指令。
  - 配置文件：`.stylelintrc.json`
  - 忽略文件：`.stylelintignore`
- **Import Sort**: 使用 `eslint-plugin-simple-import-sort` 自动对 `import` 语句进行分组和排序。
- **Git Hooks**: 使用 `Husky` & `lint-staged`，在 `pre-commit` 阶段自动对暂存区代码进行 lint 和格式化。
- **Commitlint & Commitizen (cz-git)**: 规范 Git 提交信息。
  - 使用 `pnpm commit` 触发带有中文提示和 Emoji 的交互式提交命令行。
  - 配置文件：`.commitlintrc.json` 和 `.czrc`

## 常见命令

```bash
# 检查并修复 ESLint 错误
pnpm lint:fix

# 格式化所有代码
pnpm prettier

# 检查并修复样式
pnpm stylelint

# 交互式提交代码（推荐使用此命令代替 git commit）
pnpm commit
```
