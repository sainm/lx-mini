# 环境配置说明

## 📋 概述

项目支持多环境配置，通过环境变量文件区分不同的运行环境。

## 🌍 环境类型

### 1. 开发环境（development）
- 配置文件：`.env.development`
- 用途：本地开发
- 特点：
  - 使用本地 API 地址
  - 开启 Mock 数据
  - 开启调试模式
  - 显示详细日志

### 2. 生产环境（production）
- 配置文件：`.env.production`
- 用途：正式发布
- 特点：
  - 使用生产 API 地址
  - 关闭 Mock 数据
  - 关闭调试模式
  - 优化性能

### 3. 测试环境（test）
- 配置文件：`.env.test`
- 用途：测试服务器
- 特点：
  - 使用测试 API 地址
  - 关闭 Mock 数据
  - 开启调试模式
  - 用于测试验证

## 🔧 配置项说明

### 环境变量列表

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NODE_ENV` | 环境标识 | `development` / `production` / `test` |
| `TARO_APP_API_BASE_URL` | API 基础地址 | `http://localhost:3000` |
| `TARO_APP_REQUEST_TIMEOUT` | 请求超时时间（毫秒） | `10000` |
| `TARO_APP_USE_MOCK` | 是否使用 Mock 数据 | `true` / `false` |
| `TARO_APP_DEBUG` | 是否开启调试模式 | `true` / `false` |

### 配置文件示例

**.env.development**
```env
NODE_ENV=development
TARO_APP_API_BASE_URL=http://localhost:3000
TARO_APP_REQUEST_TIMEOUT=10000
TARO_APP_USE_MOCK=true
TARO_APP_DEBUG=true
```

**.env.production**
```env
NODE_ENV=production
TARO_APP_API_BASE_URL=https://api.your-domain.com
TARO_APP_REQUEST_TIMEOUT=15000
TARO_APP_USE_MOCK=false
TARO_APP_DEBUG=false
```

**.env.test**
```env
NODE_ENV=test
TARO_APP_API_BASE_URL=https://test-api.your-domain.com
TARO_APP_REQUEST_TIMEOUT=10000
TARO_APP_USE_MOCK=false
TARO_APP_DEBUG=true
```

## 🚀 使用方法

### 1. 开发环境运行

默认使用 `.env.development` 配置：

```bash
# 微信小程序开发模式
pnpm dev:weapp

# 支付宝小程序开发模式
pnpm dev:alipay

# H5 开发模式
pnpm dev:h5
```

### 2. 生产环境构建

使用 `.env.production` 配置：

```bash
# 微信小程序生产构建
pnpm build:weapp

# 支付宝小程序生产构建
pnpm build:alipay

# H5 生产构建
pnpm build:h5
```

### 3. 测试环境

如果需要使用测试环境，可以在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "dev:weapp:test": "cross-env NODE_ENV=test taro build --type weapp --watch",
    "build:weapp:test": "cross-env NODE_ENV=test taro build --type weapp"
  }
}
```

## 📱 Mock 数据说明

### 什么是 Mock 数据？

Mock 数据是模拟的假数据，用于在没有后端 API 的情况下进行前端开发和测试。

### Mock 数据位置

`src/utils/mock.ts` - 包含所有 Mock 数据定义

### Mock 数据内容

- **mockTasks**: 模拟任务列表（4个任务）
- **mockQuestions**: 模拟题目列表（5个题目，包含单选、多选、量表、判断题）
- **mockResults**: 模拟结果列表（2个结果）

### 启用/禁用 Mock

在 `.env.*` 文件中修改：

```env
# 启用 Mock
TARO_APP_USE_MOCK=true

# 禁用 Mock（使用真实 API）
TARO_APP_USE_MOCK=false
```

### Mock 测试账号

**用户名**: `test`  
**密码**: `123456`

## 🔍 调试模式

### 调试模式功能

启用调试模式（`TARO_APP_DEBUG=true`）时，会在控制台输出：

1. **环境配置信息**
   - NODE_ENV
   - API_BASE_URL
   - REQUEST_TIMEOUT
   - USE_MOCK

2. **API 请求日志**
   - 请求 URL
   - 请求方法
   - 请求参数
   - 是否需要认证

3. **API 响应日志**
   - 响应状态码
   - 响应数据

4. **API 错误日志**
   - 错误信息
   - 错误堆栈

### 查看日志

**微信开发者工具**:
1. 打开"调试器"
2. 选择"Console"标签
3. 查看输出日志

**浏览器（H5）**:
1. 打开浏览器开发者工具（F12）
2. 选择"Console"标签
3. 查看输出日志

## 🔐 生产环境安全

### 注意事项

1. **不要提交敏感信息**
   - 不要在 `.env.production` 中提交真实的生产环境密钥
   - 敏感配置使用服务器环境变量

2. **API 地址配置**
   - 生产环境必须使用 HTTPS
   - 确保 API 地址正确

3. **关闭调试模式**
   ```env
   TARO_APP_DEBUG=false
   ```

4. **关闭 Mock 数据**
   ```env
   TARO_APP_USE_MOCK=false
   ```

## 📝 修改配置

### 步骤

1. **修改对应环境的配置文件**
   - 开发环境：`.env.development`
   - 生产环境：`.env.production`
   - 测试环境：`.env.test`

2. **重启开发服务**
   - 配置修改后需要重新运行 `pnpm dev:*` 命令

3. **重新构建**
   - 生产构建前确保 `.env.production` 配置正确

### 示例：修改 API 地址

**.env.development**
```env
# 修改为你的本地后端地址
TARO_APP_API_BASE_URL=http://localhost:8080
```

**.env.production**
```env
# 修改为你的生产环境地址
TARO_APP_API_BASE_URL=https://api.your-domain.com
```

## 🛠️ 常见问题

### 1. 配置不生效？

**解决方法**:
- 确保配置文件名正确（`.env.development`）
- 重启开发服务器
- 清除缓存后重试

### 2. Mock 数据不显示？

**检查**:
- 确认 `TARO_APP_USE_MOCK=true`
- 查看控制台是否有错误
- 检查 `src/utils/mock.ts` 文件是否存在

### 3. 生产环境访问失败？

**检查**:
- API 地址是否正确
- 是否使用 HTTPS
- 网络是否正常
- 后端服务是否正常

### 4. 如何临时切换环境？

**方法 1**: 修改配置文件  
**方法 2**: 使用环境变量
```bash
cross-env TARO_APP_USE_MOCK=false pnpm dev:weapp
```

## 📚 相关文件

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `.env.test` - 测试环境配置
- `src/config/api.ts` - API 配置文件
- `src/utils/request.ts` - 请求封装
- `src/utils/mock.ts` - Mock 数据
- `src/api/auth.ts` - 认证接口（含 Mock）
- `src/api/task.ts` - 任务接口（含 Mock）

## 🎯 最佳实践

1. **开发阶段**
   - 使用 Mock 数据进行前端开发
   - 开启调试模式，方便排查问题

2. **联调阶段**
   - 关闭 Mock，使用测试环境 API
   - 保持调试模式开启

3. **发布阶段**
   - 使用生产环境配置
   - 关闭所有调试功能
   - 仔细检查配置项

4. **版本管理**
   - 提交 `.env.development` 和 `.env.test` 到代码库
   - 不提交 `.env.production`（或使用模板文件）
   - 使用 `.env.local` 存储个人配置（不提交）

