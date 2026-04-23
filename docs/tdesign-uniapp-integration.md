# TDesign UniApp 集成 (TDesign UniApp Integration)

本项目集成了 [@tdesign/uniapp](https://www.npmjs.com/package/@tdesign/uniapp)，这是 TDesign 在 uni-app 场景下的组件库实现。

## 集成细节

1. **按需引入 (easycom)**
   在 `src/pages.json` 中配置了 `easycom` 规则：

   ```json
   "easycom": {
     "autoscan": true,
     "custom": {
       "^t-(.*)": "@tdesign/uniapp/$1/$1.vue"
     }
   }
   ```

   配置后可直接使用 `<t-button>`、`<t-loading>` 等组件。

2. **全局样式引入**
   在 `src/main.ts` 中引入主题样式：

   ```ts
   import '@tdesign/uniapp/theme.css'
   ```

3. **编辑器类型提示**
   在 `tsconfig.json` 的 `compilerOptions.types` 中添加：

   ```json
   "@tdesign/uniapp/global"
   ```
