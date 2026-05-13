# TouchFish Formatter

**[English](README-en-US.md) | 简体中文**

一款用于竞赛题解 / 文章的 Markdown 格式化工具，支持数学公式符号规范化、中日韩标点转换及代码风格统一。

## 功能特性

- **数学公式格式化**：自动将 LaTeX 公式中的非标准写法转换为规范符号，例如：
  - `<=` → `\le`，`>=` → `\ge`，`!=` → `\neq`
  - `->` → `\to`，`<-` → `\gets`，`=>` → `\Rightarrow`
  - `gcd`/`min`/`max`/`log` → 对应 LaTeX 命令
  - `dp[i][j]` → `dp_{i,j}`
- **全角标点转换**：自动将 CJK 字符后跟随的半角标点（`,`, `.`, `:` 等）转换为全角标点
- **实时差异对比**：可视化展示格式化前后的文本差异
- **规则自定义**：在设置页面中按需开启或关闭各项规则
- **深色 / 浅色主题**：一键切换

## 在线使用

将 Markdown 文本粘贴至编辑器，点击「一键格式化」即可。格式化结果可通过「复制」按钮直接写入剪贴板。

## 本地开发

**环境要求**：Node.js

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 使用

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [MUI (Material UI)](https://mui.com/)
- [CodeMirror 6](https://codemirror.net/)
- [unified](https://unifiedjs.com/) / [remark](https://remark.js.org/)
- [i18next](https://www.i18next.com/)

## 许可证

使用 [AGPL-3.0](LICENSE) 许可证。
