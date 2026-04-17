# UV-UI 集成 (UV-UI Integration)

本项目集成了 [@climblee/uv-ui](https://gitee.com/climblee/uv-ui)，这是一个全面兼容 Vue3、多端支持的跨平台 UI 框架。

## 集成细节

1. **按需引入 (easycom)**
   在 `src/pages.json` 中配置了 `easycom` 规则：
   ```json
   "easycom": {
     "autoscan": true,
     "custom": {
       "^uv-(.*)": "@climblee/uv-ui/components/uv-$1/uv-$1.vue"
     }
   }
   ```
   开发时可以直接在模板中使用 `<uv-button>`、`<uv-icon>` 等组件，无需手动 import 引入和注册。

2. **全局样式引入**
   在 `src/App.vue` 中全局引入了 uv-ui 的基础样式：
   ```scss
   <style lang="scss">
   @import '@climblee/uv-ui/index.scss';
   </style>
   ```

3. **主题变量覆盖**
   在 `src/uni.scss` 中引入了 `@import '@climblee/uv-ui/theme.scss';`，方便进行全局主题色定制。

4. **插件注册**
   在 `src/main.ts` 中通过 `app.use(uvUI)` 进行了全局注册，从而可以使用 `uv-ui` 提供的内置工具方法（如 `uni.$uv.toast` 等）。
