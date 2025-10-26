# 心理评测小程序

基于 Taro + Vue 3 + Pinia 开发的心理评测微信小程序。

## 🎯 功能特性

### 1. 用户认证
- ✅ 用户注册（用户名、密码）
- ✅ 用户登录
- ✅ Token 认证
- ✅ 登录状态保持

### 2. 任务管理
- ✅ 查看分配的测评任务列表
- ✅ 任务状态管理（未开始、进行中、已完成、已过期）
- ✅ 任务统计（全部任务、已完成、待完成）
- ✅ 任务详情展示（题数、时长、截止时间）
- ✅ **已完成的任务 → 查看报告**
- ✅ **未完成的任务 → 进入答题**

### 3. 答题功能
- ✅ 多种题型支持：
  - 单选题
  - 多选题
  - 判断题
  - 量表题（1-5分等）
- ✅ 答题进度显示
- ✅ 必答题验证
- ✅ 答题计时
- ✅ 上一题/下一题导航
- ✅ 答案自动保存

### 4. 结果报告
- ✅ 测评成绩展示
- ✅ 得分率计算
- ✅ 等级评定（优秀、良好、中等、及格、不及格）
- ✅ 结果分析报告
- ✅ 改进建议
- ✅ 历史结果列表
- ✅ 结果分享功能

## 📁 项目结构

```
lx-mini/
├── src/
│   ├── api/                  # API 接口
│   │   ├── auth.ts          # 认证接口
│   │   └── task.ts          # 任务接口
│   ├── config/              # 配置文件
│   │   └── api.ts           # API 配置
│   ├── stores/              # 状态管理
│   │   ├── user.ts          # 用户状态
│   │   ├── task.ts          # 任务状态
│   │   └── counter.ts       # 示例
│   ├── utils/               # 工具函数
│   │   └── request.ts       # 请求封装
│   ├── types/               # 类型定义
│   │   └── index.ts         # 全局类型
│   ├── pages/               # 页面
│   │   ├── login/           # 登录页
│   │   ├── register/        # 注册页
│   │   ├── quiz/            # 任务列表页
│   │   ├── task-detail/     # 答题页
│   │   ├── task-result/     # 结果报告页
│   │   └── results/         # 历史结果页
│   ├── app.ts               # 应用入口
│   └── app.config.ts        # 应用配置
├── config/                  # 构建配置
├── package.json
└── tsconfig.json
```

## 🔧 技术栈

- **框架**: Taro 4.1.7
- **UI**: Vue 3 + Composition API
- **状态管理**: Pinia
- **语言**: TypeScript
- **样式**: Sass
- **UI 组件**: Taro UI Vue3
- **构建工具**: Vite

## 🚀 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 文件创建环境配置：

```bash
# 创建开发环境配置
cp .env.example .env.development

# 创建生产环境配置（可选）
cp .env.example .env.production

# 创建测试环境配置（可选）
cp .env.example .env.test
```

然后编辑对应的配置文件，修改 API 地址等配置项。

**开发环境配置示例** (`.env.development`)：
```env
NODE_ENV=development
TARO_APP_API_BASE_URL=http://localhost:3000
TARO_APP_REQUEST_TIMEOUT=10000
TARO_APP_USE_MOCK=true    # 使用 Mock 数据
TARO_APP_DEBUG=true       # 开启调试
```

**生产环境配置示例** (`.env.production`)：
```env
NODE_ENV=production
TARO_APP_API_BASE_URL=https://api.your-domain.com
TARO_APP_REQUEST_TIMEOUT=15000
TARO_APP_USE_MOCK=false   # 使用真实 API
TARO_APP_DEBUG=false      # 关闭调试
```

### 3. 开发模式

```bash
# 微信小程序
pnpm dev:weapp

# 支付宝小程序
pnpm dev:alipay

# 头条小程序
pnpm dev:tt

# H5
pnpm dev:h5
```

### 4. 生产构建

```bash
pnpm build:weapp
pnpm build:alipay
pnpm build:tt
pnpm build:h5
```

### 5. Mock 数据测试

默认开发环境已启用 Mock 数据，可以直接测试：

**测试账号**：
- 用户名：`test`
- 密码：`123456`

**Mock 数据包含**：
- 4个测评任务（不同状态）
- 5道测评题目（单选、多选、量表、判断）
- 2条历史结果

详见：`ENV_CONFIG.md`

## 📡 后端接口

### API 配置
在 `src/config/api.ts` 中配置 API 地址：
```typescript
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:3000'
```

### 接口列表

#### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/logout` - 用户登出

#### 任务接口
- `GET /api/tasks` - 获取任务列表
- `GET /api/tasks/:id` - 获取任务详情（包含题目）
- `POST /api/tasks/:id/submit` - 提交答题

#### 结果接口
- `GET /api/results` - 获取结果列表
- `GET /api/results/:id` - 获取结果详情

### 数据格式

#### 登录请求
```json
{
  "username": "testuser",
  "password": "123456"
}
```

#### 登录响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "testuser",
      "nickname": "测试用户"
    }
  }
}
```

#### 任务列表响应
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "1",
      "title": "心理健康测评",
      "description": "评估您的心理健康状况",
      "totalQuestions": 20,
      "duration": 30,
      "status": "not_started",
      "deadline": "2025-11-01T00:00:00Z",
      "createdAt": "2025-10-26T00:00:00Z"
    }
  ]
}
```

#### 任务详情响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task": { /* 任务信息 */ },
    "questions": [
      {
        "id": "1",
        "type": "single_choice",
        "title": "第1题",
        "content": "您最近一周的睡眠质量如何？",
        "options": [
          {
            "id": "1",
            "label": "A",
            "content": "很好",
            "score": 5
          },
          {
            "id": "2",
            "label": "B",
            "content": "一般",
            "score": 3
          }
        ],
        "required": true,
        "order": 1
      }
    ]
  }
}
```

#### 提交答题请求
```json
{
  "taskId": "1",
  "answers": [
    {
      "questionId": "1",
      "answer": "1"
    },
    {
      "questionId": "2",
      "answer": ["1", "3"]
    }
  ],
  "duration": 1200
}
```

#### 结果响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "1",
    "taskId": "1",
    "taskTitle": "心理健康测评",
    "totalScore": 85,
    "maxScore": 100,
    "percentage": 85,
    "level": "良好",
    "analysis": "您的心理健康状况良好...",
    "suggestion": "建议您继续保持...",
    "completedAt": "2025-10-26T10:30:00Z",
    "duration": 1200
  }
}
```

## 🎨 页面流程

```
登录页 → 任务列表页 ┬→ 答题页 → 结果报告页
                    └→ 结果报告页（已完成任务）
                    
注册页 → 登录页

结果列表页 → 结果报告页
```

### 核心逻辑

**任务列表页 (`src/pages/quiz/index.vue`)**
```typescript
const goToTask = (task: Task) => {
  if (task.status === 'completed') {
    // 已完成 → 查看报告
    Taro.navigateTo({ 
      url: `/pages/task-result/index?taskId=${task.id}` 
    })
  } else {
    // 未完成 → 进入答题
    Taro.navigateTo({ 
      url: `/pages/task-detail/index?taskId=${task.id}` 
    })
  }
}
```

## 🎯 特色功能

### 1. 智能状态管理
- 使用 Pinia 管理全局状态
- 用户状态持久化
- 答题进度自动保存

### 2. 优雅的 UI 设计
- 渐变背景
- 卡片式布局
- 流畅的交互动画
- 响应式设计

### 3. 完善的错误处理
- 统一的请求拦截
- 友好的错误提示
- 401 自动跳转登录

### 4. 多种题型支持
- 单选题（圆形选择器）
- 多选题（方形选择器）
- 量表题（评分式布局）
- 判断题（是/否选择）

### 5. 实时答题反馈
- 进度条显示
- 答题计时
- 必答题提醒
- 提交前确认

## 📝 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 使用 Composition API
- 使用 `<script setup>` 语法
- 组件和函数命名遵循驼峰命名

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建/工具链相关

## 🔐 安全性

- ✅ Token 认证机制
- ✅ 请求加密传输（HTTPS）
- ✅ 敏感信息本地加密存储
- ✅ API 访问权限控制
- ✅ XSS 防护

## 📱 兼容性

- 微信小程序 7.0+
- 支付宝小程序
- 头条/抖音小程序
- QQ 小程序
- H5（移动端）

## 🚧 待开发功能

- [ ] 用户个人中心
- [ ] 答题历史记录
- [ ] 测评数据统计图表
- [ ] 测评报告导出（PDF）
- [ ] 测评提醒推送
- [ ] 离线答题支持
- [ ] 多语言支持

## 📄 License

MIT

## 👥 联系方式

如有问题，请联系项目负责人。

