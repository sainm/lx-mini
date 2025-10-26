# 项目配置指南

## 📦 环境准备

### 1. 安装依赖

```bash
pnpm install
```

如果没有安装 pnpm，先安装：
```bash
npm install -g pnpm
```

## ⚙️ 环境配置

### 创建环境变量文件

项目需要环境变量文件来区分不同环境。按照以下步骤创建：

#### 方式一：手动创建

**1. 创建开发环境配置文件** `.env.development`

```env
NODE_ENV=development
TARO_APP_API_BASE_URL=http://localhost:3000
TARO_APP_REQUEST_TIMEOUT=10000
TARO_APP_USE_MOCK=true
TARO_APP_DEBUG=true
```

**2. 创建生产环境配置文件** `.env.production`

```env
NODE_ENV=production
TARO_APP_API_BASE_URL=https://api.your-domain.com
TARO_APP_REQUEST_TIMEOUT=15000
TARO_APP_USE_MOCK=false
TARO_APP_DEBUG=false
```

**3. （可选）创建测试环境配置文件** `.env.test`

```env
NODE_ENV=test
TARO_APP_API_BASE_URL=https://test-api.your-domain.com
TARO_APP_REQUEST_TIMEOUT=10000
TARO_APP_USE_MOCK=false
TARO_APP_DEBUG=true
```

#### 方式二：使用命令创建

**Windows (PowerShell)**：
```powershell
Copy-Item .env.example .env.development
Copy-Item .env.example .env.production
Copy-Item .env.example .env.test
```

**Mac/Linux**：
```bash
cp .env.example .env.development
cp .env.example .env.production
cp .env.example .env.test
```

然后编辑这些文件，修改对应的配置项。

## 🎯 配置说明

### 开发环境（推荐配置）

**适用场景**：本地开发、前端调试

```env
NODE_ENV=development
TARO_APP_API_BASE_URL=http://localhost:3000    # 本地后端地址
TARO_APP_REQUEST_TIMEOUT=10000                 # 10秒超时
TARO_APP_USE_MOCK=true                         # ✅ 使用 Mock 数据
TARO_APP_DEBUG=true                            # ✅ 开启调试日志
```

**优势**：
- 无需后端即可开发测试
- 有完整的 Mock 数据
- 可查看详细的请求日志

### 联调环境

**适用场景**：与后端联调测试

修改 `.env.development`：
```env
NODE_ENV=development
TARO_APP_API_BASE_URL=http://localhost:8080    # 后端地址
TARO_APP_REQUEST_TIMEOUT=10000
TARO_APP_USE_MOCK=false                        # ❌ 关闭 Mock，使用真实 API
TARO_APP_DEBUG=true                            # ✅ 保持调试开启
```

### 测试环境

**适用场景**：测试服务器部署

```env
NODE_ENV=test
TARO_APP_API_BASE_URL=https://test-api.your-domain.com
TARO_APP_REQUEST_TIMEOUT=10000
TARO_APP_USE_MOCK=false
TARO_APP_DEBUG=true
```

### 生产环境

**适用场景**：正式发布

```env
NODE_ENV=production
TARO_APP_API_BASE_URL=https://api.your-domain.com
TARO_APP_REQUEST_TIMEOUT=15000
TARO_APP_USE_MOCK=false                        # ❌ 必须关闭
TARO_APP_DEBUG=false                           # ❌ 必须关闭
```

## 🚀 启动项目

### 开发模式

```bash
# 微信小程序
pnpm dev:weapp

# H5 (浏览器预览)
pnpm dev:h5

# 支付宝小程序
pnpm dev:alipay

# 头条小程序
pnpm dev:tt
```

### 生产构建

```bash
# 微信小程序
pnpm build:weapp

# H5
pnpm build:h5
```

构建完成后：
- 微信小程序：打开 `dist` 目录到微信开发者工具
- H5：部署 `dist` 目录到服务器

## 🧪 测试 Mock 功能

### 1. 确认 Mock 已启用

检查 `.env.development` 文件：
```env
TARO_APP_USE_MOCK=true
```

### 2. 启动项目

```bash
pnpm dev:weapp
```

### 3. 使用测试账号登录

- **用户名**：`test`
- **密码**：`123456`

### 4. 测试功能

登录后可以看到：
- ✅ 4个测评任务（包含不同状态）
- ✅ 可以进入任务答题（5道题）
- ✅ 提交后查看模拟结果
- ✅ 历史结果列表（2条记录）

## 📝 常见问题

### Q1: 启动后没有数据显示？

**检查步骤**：
1. 确认 `.env.development` 文件存在
2. 确认 `TARO_APP_USE_MOCK=true`
3. 重启开发服务器

### Q2: Mock 账号登录失败？

**确认**：
- 用户名必须是 `test`
- 密码必须是 `123456`
- 区分大小写

### Q3: 如何切换到真实 API？

修改 `.env.development`：
```env
TARO_APP_USE_MOCK=false
TARO_APP_API_BASE_URL=http://your-backend-url:port
```
然后重启开发服务器。

### Q4: 生产环境配置不生效？

**检查**：
1. 确认 `.env.production` 文件存在
2. 使用 `pnpm build:*` 命令构建（不是 dev）
3. 检查 API 地址是否正确

### Q5: 控制台看不到调试日志？

**检查**：
```env
TARO_APP_DEBUG=true
```

查看日志：
- **微信开发者工具**：调试器 > Console
- **H5**：浏览器 F12 > Console

## 🔧 IDE 配置

### VSCode 推荐插件

```json
{
  "recommendations": [
    "vue.volar",
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint",
    "editorconfig.editorconfig"
  ]
}
```

### 配置文件

项目已包含：
- ✅ `.editorconfig` - 编辑器配置
- ✅ `.eslintrc` - ESLint 配置
- ✅ `tsconfig.json` - TypeScript 配置

## 📚 下一步

1. ✅ 完成环境配置
2. ✅ 启动项目并登录测试
3. ✅ 测试各项功能
4. 📖 阅读 `BACKEND_API.md` 了解后端接口规范
5. 📖 阅读 `ENV_CONFIG.md` 了解详细的环境配置

## 💡 提示

### 快速开始（使用 Mock）

如果你想快速体验项目，只需：

```bash
# 1. 安装依赖
pnpm install

# 2. 创建开发配置（复制下面内容到 .env.development 文件）
echo "NODE_ENV=development
TARO_APP_API_BASE_URL=http://localhost:3000
TARO_APP_REQUEST_TIMEOUT=10000
TARO_APP_USE_MOCK=true
TARO_APP_DEBUG=true" > .env.development

# 3. 启动项目
pnpm dev:weapp

# 4. 使用测试账号登录：test / 123456
```

### 项目结构

```
lx-mini/
├── .env.example           ← 环境变量模板
├── .env.development       ← 开发环境配置（需创建）
├── .env.production        ← 生产环境配置（需创建）
├── README.md              ← 项目说明
├── SETUP_GUIDE.md         ← 本文件
├── ENV_CONFIG.md          ← 环境配置详细说明
├── BACKEND_API.md         ← 后端接口文档
└── src/
    ├── api/               ← API 接口（含 Mock）
    ├── config/            ← 配置文件
    ├── pages/             ← 页面
    ├── stores/            ← 状态管理
    ├── utils/             ← 工具函数
    └── types/             ← 类型定义
```

## 🎉 完成

配置完成后，你应该能够：
- ✅ 成功启动项目
- ✅ 使用 Mock 数据测试
- ✅ 看到调试日志输出
- ✅ 完整体验所有功能

如有问题，请查看：
- `ENV_CONFIG.md` - 详细的环境配置说明
- `BACKEND_API.md` - 后端接口文档
- `README.md` - 项目功能说明

