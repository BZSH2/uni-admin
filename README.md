# uni-admin

一个基于 Vue 3 + Vite + TypeScript + UniApp 开发的多端后台管理模板。

## 文档 (Documentation)

项目的详细设计与配置说明请参考以下文档：

- [代码规范与提交规范 (Linting & Formatting)](./docs/linting-and-formatting.md)
- [编辑器配置 (Editor Setup)](./docs/editor-setup.md)
- [UV-UI 集成说明 (UV-UI Integration)](./docs/uv-ui-integration.md)
- [自动化部署说明 (Automation Deploy)](./docs/automation-deploy.md)

## 快速开始 (Getting Started)

### 1. 安装依赖

```bash
pnpm install
```

### 2. 运行项目

```bash
pnpm dev
```

### 3. 提交代码

请使用 `pnpm commit` 代替 `git commit`，以生成符合规范的提交信息。

```bash
git add .
pnpm commit
```

## 自动化部署

项目已补充 GitHub Actions + ECS 静态部署骨架，说明见：

- [自动化部署说明](./docs/automation-deploy.md)
