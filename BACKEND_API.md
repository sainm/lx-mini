# 后端 API 接口文档

## 概述

本文档描述心理评测小程序后端需要提供的 API 接口规范。

## 基础信息

- **Base URL**: `http://your-api-domain.com/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token（除登录/注册外的所有接口）

## 响应格式

所有接口统一返回格式：

```json
{
  "code": 0,          // 0表示成功，其他表示错误
  "message": "success",  // 提示信息
  "data": {}          // 响应数据
}
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token失效 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 1. 认证接口

### 1.1 用户登录

**接口**: `POST /auth/login`

**请求头**: 无需 Token

**请求参数**:
```json
{
  "username": "testuser",
  "password": "123456"
}
```

**响应数据**:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2025-10-01T00:00:00Z"
    }
  }
}
```

### 1.2 用户注册

**接口**: `POST /auth/register`

**请求头**: 无需 Token

**请求参数**:
```json
{
  "username": "newuser",
  "password": "123456",
  "nickname": "新用户"  // 可选
}
```

**响应数据**: 同登录接口

### 1.3 用户登出

**接口**: `POST /auth/logout`

**请求头**: 需要 Token

**请求参数**: 无

**响应数据**:
```json
{
  "code": 0,
  "message": "登出成功",
  "data": null
}
```

---

## 2. 任务接口

### 2.1 获取任务列表

**接口**: `GET /tasks`

**请求头**: 需要 Token

**查询参数**:
- `status` (可选): 任务状态筛选 (`not_started`, `in_progress`, `completed`, `expired`)
- `page` (可选): 页码，默认1
- `pageSize` (可选): 每页数量，默认20

**响应数据**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "1",
      "title": "心理健康测评",
      "description": "评估您的心理健康状况，了解当前的心理状态",
      "coverImage": "https://example.com/cover.jpg",
      "totalQuestions": 20,
      "duration": 30,
      "status": "not_started",
      "deadline": "2025-11-01T23:59:59Z",
      "score": null,
      "completedAt": null,
      "createdAt": "2025-10-26T00:00:00Z"
    },
    {
      "id": "2",
      "title": "焦虑自评量表",
      "description": "测评您的焦虑程度",
      "coverImage": "https://example.com/cover2.jpg",
      "totalQuestions": 15,
      "duration": 20,
      "status": "completed",
      "deadline": "2025-10-30T23:59:59Z",
      "score": 85,
      "completedAt": "2025-10-26T10:30:00Z",
      "createdAt": "2025-10-20T00:00:00Z"
    }
  ]
}
```

**状态说明**:
- `not_started`: 未开始
- `in_progress`: 进行中（已开始但未提交）
- `completed`: 已完成
- `expired`: 已过期

### 2.2 获取任务详情

**接口**: `GET /tasks/:id`

**请求头**: 需要 Token

**路径参数**:
- `id`: 任务ID

**响应数据**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task": {
      "id": "1",
      "title": "心理健康测评",
      "description": "评估您的心理健康状况",
      "totalQuestions": 20,
      "duration": 30,
      "status": "not_started",
      "deadline": "2025-11-01T23:59:59Z"
    },
    "questions": [
      {
        "id": "1",
        "type": "single_choice",
        "title": "第1题",
        "content": "您最近一周的睡眠质量如何？",
        "image": null,
        "required": true,
        "order": 1,
        "options": [
          {
            "id": "1",
            "label": "A",
            "content": "很好，每天都能睡得很香",
            "score": 5
          },
          {
            "id": "2",
            "label": "B",
            "content": "还可以，偶尔会失眠",
            "score": 3
          },
          {
            "id": "3",
            "label": "C",
            "content": "不太好，经常失眠",
            "score": 1
          }
        ]
      },
      {
        "id": "2",
        "type": "multiple_choice",
        "title": "第2题",
        "content": "您最近一个月出现过以下哪些症状？（可多选）",
        "image": null,
        "required": true,
        "order": 2,
        "options": [
          {
            "id": "4",
            "label": "A",
            "content": "头痛",
            "score": 2
          },
          {
            "id": "5",
            "label": "B",
            "content": "疲劳",
            "score": 2
          },
          {
            "id": "6",
            "label": "C",
            "content": "焦虑",
            "score": 3
          },
          {
            "id": "7",
            "label": "D",
            "content": "没有任何症状",
            "score": 0
          }
        ]
      },
      {
        "id": "3",
        "type": "scale",
        "title": "第3题",
        "content": "您对目前的生活满意度如何？",
        "image": null,
        "required": true,
        "order": 3,
        "options": [
          {
            "id": "8",
            "label": "1",
            "content": "非常不满意",
            "score": 1
          },
          {
            "id": "9",
            "label": "2",
            "content": "不满意",
            "score": 2
          },
          {
            "id": "10",
            "label": "3",
            "content": "一般",
            "score": 3
          },
          {
            "id": "11",
            "label": "4",
            "content": "满意",
            "score": 4
          },
          {
            "id": "12",
            "label": "5",
            "content": "非常满意",
            "score": 5
          }
        ]
      }
    ]
  }
}
```

**题型说明**:
- `single_choice`: 单选题
- `multiple_choice`: 多选题
- `true_false`: 判断题
- `scale`: 量表题（评分）

### 2.3 提交答题

**接口**: `POST /tasks/:id/submit`

**请求头**: 需要 Token

**路径参数**:
- `id`: 任务ID

**请求参数**:
```json
{
  "taskId": "1",
  "answers": [
    {
      "questionId": "1",
      "answer": "1"        // 单选：选项ID
    },
    {
      "questionId": "2",
      "answer": ["4", "5"] // 多选：选项ID数组
    },
    {
      "questionId": "3",
      "answer": "10"       // 量表：选项ID
    }
  ],
  "duration": 1200  // 答题时长（秒）
}
```

**响应数据**:
```json
{
  "code": 0,
  "message": "提交成功",
  "data": {
    "id": "result_1",
    "taskId": "1",
    "taskTitle": "心理健康测评",
    "totalScore": 85,
    "maxScore": 100,
    "percentage": 85,
    "level": "良好",
    "analysis": "您的心理健康状况良好，整体表现稳定。睡眠质量较好，生活满意度较高，但偶尔会出现一些压力症状。建议您：\n\n1. 继续保持良好的作息习惯\n2. 适当进行体育锻炼\n3. 学会释放压力\n4. 保持积极乐观的心态",
    "suggestion": "1. 每天保证7-8小时睡眠\n2. 每周进行3次以上有氧运动\n3. 定期与朋友家人交流\n4. 学习一些放松技巧，如冥想、深呼吸等",
    "completedAt": "2025-10-26T10:30:00Z",
    "duration": 1200
  }
}
```

---

## 3. 结果接口

### 3.1 获取结果列表

**接口**: `GET /results`

**请求头**: 需要 Token

**查询参数**:
- `page` (可选): 页码，默认1
- `pageSize` (可选): 每页数量，默认20

**响应数据**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "result_1",
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
  ]
}
```

### 3.2 获取结果详情

**接口**: `GET /results/:id`

**请求头**: 需要 Token

**路径参数**:
- `id`: 结果ID

**响应数据**: 同提交答题的响应数据

---

## 4. 数据模型

### User（用户）
```typescript
{
  id: string | number
  username: string        // 用户名
  nickname?: string       // 昵称
  avatar?: string         // 头像URL
  createdAt?: string      // 创建时间
}
```

### Task（任务）
```typescript
{
  id: string | number
  title: string                 // 任务标题
  description: string           // 任务描述
  coverImage?: string           // 封面图
  totalQuestions: number        // 总题数
  duration?: number             // 时长（分钟）
  status: TaskStatus            // 任务状态
  deadline?: string             // 截止时间
  completedAt?: string          // 完成时间
  score?: number                // 得分
  createdAt: string             // 创建时间
}
```

### Question（题目）
```typescript
{
  id: string | number
  type: QuestionType            // 题目类型
  title: string                 // 题目标题
  content: string               // 题目内容
  options: QuestionOption[]     // 选项列表
  required: boolean             // 是否必答
  image?: string                // 题目图片
  order: number                 // 题目顺序
}
```

### QuestionOption（选项）
```typescript
{
  id: string | number
  label: string      // 选项标签（A、B、C等）
  content: string    // 选项内容
  score?: number     // 选项分数
}
```

### Result（结果）
```typescript
{
  id: string | number
  taskId: string | number
  taskTitle: string
  totalScore: number            // 总分
  maxScore: number              // 满分
  percentage: number            // 得分率
  level?: string                // 等级（优秀、良好等）
  analysis: string              // 结果分析
  suggestion?: string           // 建议
  completedAt: string           // 完成时间
  duration: number              // 答题时长（秒）
}
```

---

## 5. 认证说明

### Token 获取
用户通过登录或注册接口获取 Token。

### Token 使用
在需要认证的接口请求头中添加：
```
Authorization: Bearer {token}
```

### Token 失效处理
当 Token 失效时，接口返回 401 状态码，前端会自动跳转到登录页。

---

## 6. 开发建议

### 数据库表设计

**users 表**
- id
- username (唯一索引)
- password (加密存储)
- nickname
- avatar
- created_at
- updated_at

**tasks 表**
- id
- title
- description
- cover_image
- total_questions
- duration
- deadline
- created_at
- updated_at

**user_tasks 表**（用户任务关联表）
- id
- user_id
- task_id
- status
- score
- completed_at
- created_at

**questions 表**
- id
- task_id
- type
- title
- content
- image
- required
- order
- created_at

**question_options 表**
- id
- question_id
- label
- content
- score
- order

**results 表**
- id
- user_id
- task_id
- total_score
- max_score
- percentage
- level
- analysis
- suggestion
- duration
- completed_at
- created_at

**answers 表**
- id
- result_id
- question_id
- answer (JSON 格式存储)
- score
- created_at

### 评分算法

1. 计算总分：将用户所有答案的分数相加
2. 计算得分率：(总分 / 满分) × 100%
3. 等级评定：
   - 90-100%: 优秀
   - 80-89%: 良好
   - 70-79%: 中等
   - 60-69%: 及格
   - 0-59%: 不及格

### 安全建议

1. 密码使用 bcrypt 加密存储
2. Token 使用 JWT，设置合理的过期时间
3. API 接口做好频率限制
4. 敏感数据传输使用 HTTPS
5. 做好 SQL 注入防护
6. 做好 XSS 攻击防护

---

## 7. 测试数据

建议创建以下测试数据：

**测试用户**:
- 用户名: `test`
- 密码: `123456`

**测试任务**:
- 心理健康测评（20题，未开始）
- 焦虑自评量表（15题，已完成）
- 抑郁自评量表（15题，进行中）

每个任务包含不同类型的题目，方便测试各种功能。

