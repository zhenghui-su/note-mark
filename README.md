# NoteMark

一个基于 Electron + React + TypeScript 构建的现代化笔记应用

## 功能特性

- 📝 **Markdown 编辑器** - 支持实时预览的 Markdown 编辑
- 🎨 **现代化界面** - 使用 Tailwind CSS 构建的美观界面
- 🌓 **明暗主题切换** - 支持明暗主题无缝切换，自动保存用户偏好
- 💾 **自动保存** - 3秒自动保存，无需担心数据丢失
- 🌍 **国际化支持** - 自动检测系统语言和时区
- 🖥️ **跨平台** - 支持 Windows、macOS 和 Linux
- 🎯 **原生体验** - macOS 下支持毛玻璃效果和自定义标题栏

## 技术栈

- **前端框架**: React 18 + TypeScript
- **桌面框架**: Electron
- **构建工具**: Electron Vite
- **样式框架**: Tailwind CSS
- **代码规范**: ESLint + Prettier
- **状态管理**: 基于 React Hooks

## 项目结构

```
src/
├── main/           # Electron 主进程
├── preload/        # 预加载脚本
├── renderer/       # React 渲染进程
│   ├── src/
│   │   ├── components/  # React 组件
│   │   ├── hooks/       # 自定义 Hooks
│   │   ├── store/       # 状态管理
│   │   └── utils/       # 工具函数
└── shared/         # 共享类型和常量
```

## 开发环境设置

### 推荐 IDE

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### 安装依赖

```bash
$ npm install
```

### 开发模式

```bash
$ npm dev
```

### 构建应用

```bash
# Windows 平台
$ npm build:win

# macOS 平台
$ npm build:mac

# Linux 平台
$ npm build:linux
```

## 应用特色

### macOS 优化

- 无边框窗口设计
- 毛玻璃背景效果 (vibrancy)
- 自定义交通灯按钮位置
- 隐藏标题栏，提供沉浸式体验

### 安全性

- 启用上下文隔离 (contextIsolation)
- 沙盒模式运行
- 安全的 IPC 通信机制

### 用户体验

- 自动保存功能 (3秒间隔)
- 响应式界面设计
- 本地化时间和日期格式
- 欢迎笔记引导新用户
