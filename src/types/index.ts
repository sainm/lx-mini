// 用户信息
export interface User {
  id: string | number
  username: string
  nickname?: string
  avatar?: string
  createdAt?: string
}

// 任务状态
export enum TaskStatus {
  NOT_STARTED = 'not_started', // 未开始
  IN_PROGRESS = 'in_progress',  // 进行中
  COMPLETED = 'completed',      // 已完成
  EXPIRED = 'expired',          // 已过期
}

// 测评任务
export interface Task {
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
  createdAt: string
}

// 题目类型
export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',   // 单选
  MULTIPLE_CHOICE = 'multiple_choice', // 多选
  TRUE_FALSE = 'true_false',         // 判断
  SCALE = 'scale',                   // 量表（如1-5分）
}

// 题目选项
export interface QuestionOption {
  id: string | number
  label: string      // 选项标签（A、B、C等）
  content: string    // 选项内容
  score?: number     // 选项分数
}

// 题目
export interface Question {
  id: string | number
  type: QuestionType
  title: string                 // 题目标题
  content: string               // 题目内容
  options: QuestionOption[]     // 选项列表
  required: boolean             // 是否必答
  image?: string                // 题目图片
  order: number                 // 题目顺序
}

// 答题记录
export interface Answer {
  questionId: string | number
  answer: string | string[]     // 单选为string，多选为string[]
  score?: number
}

// 测评结果
export interface Result {
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

// 答题提交数据
export interface SubmitData {
  taskId: string | number
  answers: Answer[]
  duration: number              // 答题时长（秒）
}

