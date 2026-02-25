# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是 OpenClaw 项目的 Control UI 子项目，一个基于 Web 的控制界面，用于管理 OpenClaw Gateway、频道、会话、技能等核心功能。

**技术栈：**

- **前端框架：** Lit (Web Components)
- **构建工具：** Vite
- **测试框架：** Vitest + Playwright (浏览器测试)
- **样式：** 原生 CSS (无 CSS 框架)
- **类型系统：** TypeScript

## 开发命令

### 日常开发

```bash
# 安装依赖 (必须使用 pnpm)
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 运行测试
pnpm test
```

### 单独运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test src/ui/controllers/chat.test.ts

# 测试监听模式
pnpm test --watch
```

## 代码架构

### 核心文件结构

```
src/
├── main.ts/js              # 应用入口点
├── styles.css              # 全局样式入口
├── ui/
│   ├── app.ts/js           # 主应用组件 (<openclaw-app>)
│   ├── gateway.ts/js       # WebSocket 网关客户端
│   ├── navigation.ts/js    # 路由和标签页导航
│   ├── presenter.ts/js     # 数据格式化工具
│   ├── types.ts/js         # TypeScript 类型定义
│   ├── app-*.ts/js         # 应用功能模块 (chat, channels, settings 等)
│   ├── controllers/        # 业务逻辑控制器
│   ├── views/              # 页面视图组件
│   ├── chat/               # 聊天相关功能
│   └── components/         # 可复用组件
├── styles/                 # CSS 样式文件
├── config/                 # 配置文件
└── styles.css              # 样式入口
```

### 应用程序架构模式

**主应用组件 (`src/ui/app.ts`)**

- `<openclaw-app>` 是根 LitElement 自定义元素
- 使用 `@state()` 装饰器管理响应式状态
- 将大型应用拆分为多个独立文件进行组织：
  - `app-channels.ts/js` - 频道配置逻辑
  - `app-settings.ts/js` - 设置和应用状态
  - `app-scroll.ts/js` - 滚动处理
  - `app-lifecycle.ts/js` - 生命周期钩子
  - `app-render.ts/js` - 渲染逻辑

**网关通信 (`src/ui/gateway.ts`)**

- `GatewayBrowserClient` 类管理 WebSocket 连接
- 支持设备身份验证和令牌存储
- 实现自动重连和指数退避
- 请求/响应模式 + 事件流

**导航系统 (`src/ui/navigation.ts`)**

- 基于 URL 路径的标签页路由
- `TAB_GROUPS` 定义导航分组结构
- `pathForTab()` / `tabFromPath()` 处理路径映射
- 支持基础路径配置 (用于子目录部署)

**控制器模式 (`src/ui/controllers/`)**

- 分离业务逻辑与 UI 组件
- 每个控制器处理特定领域：chat、config、channels、sessions 等
- 控制器函数接受应用状态对象作为参数

### CSS 架构

样式按功能模块组织在 `src/styles/`：

- `base.css` - 基础样式和 CSS 变量
- `layout.css` - 布局样式
- `navigation.css` - 导航样式
- `chat/` - 聊天相关样式子目录
- `*.css` - 特定页面样式

### 聊天功能

聊天功能模块化组织：

- `src/ui/controllers/chat.ts` - 聊天控制器 (发送消息、历史记录)
- `src/ui/chat/` - 聊天工具函数：
  - `message-extract.ts` - 消息文本提取
  - `message-normalizer.ts` - 消息规范化
  - `tool-cards.ts` - 工具调用卡片
  - `grouped-render.ts` - 分组渲染
- `src/ui/views/chat.ts` - 聊天页面视图

### 视图页面

所有页面视图在 `src/ui/views/`：

- `chat.ts/js` - 聊天页面
- `home.ts/js` - 首页
- `config.ts/js` - 配置页面
- `channels.ts/js` - 频道管理
- `sessions.ts/js` - 会话管理
- `skills.ts/js` - 技能管理
- `logs.ts/js` - 日志查看
- 等等...

### 类型定义

- `src/ui/types.ts` - 主要类型定义
- `src/ui/ui-types.ts` - UI 特定类型
- `src/ui/types/chat-types.ts` - 聊天相关类型

## Lit 组件约定

- 使用 `@customElement()` 装饰器注册自定义元素
- 使用 `@state()` 管理组件内部响应式状态
- `createRenderRoot()` 返回 `this` 以使用 Shadow DOM 外的样式
- 事件处理器命名为 `handle*` (如 `handleChatScroll`)
- 异步操作方法使用 `async *()` 前缀 (如 `async loadChatHistory()`)

## 网关协议

应用通过 WebSocket 与 OpenClaw Gateway 通信：

- 连接时发送 `connect` 方法进行握手
- 支持设备身份验证 (`device-auth`) 和令牌认证
- 实时事件通过 `event` 类型帧接收
- 请求/响应对应 `req` / `res` 类型帧

## 测试

- 测试文件使用 `*.test.ts` 后缀，与源文件并置
- 使用 Vitest + Playwright 进行浏览器测试
- 配置在 `vitest.config.ts`
- 支持单元测试和浏览器集成测试

## 构建输出

- 生产构建输出到 `../dist/control-ui/`
- 开发服务器运行在 `http://localhost:5173`
- 支持基础路径配置 (通过 `OPENCLAW_CONTROL_UI_BASE_PATH` 环境变量)

## 重要注意事项

- **始终使用 `pnpm` 而非 `npm`** (项目要求)
- TypeScript 源文件和编译后的 JS 文件并存 (用于兼容性)
- 遵循现有命名约定：Pascal Case 用于类，camel Case 用于函数
- 编辑应用状态时，始终使用控制器函数而非直接修改
- CSS 样式不使用预处理器，使用原生 CSS 变量和层叠
