/**
 * Mock 数据工具
 * 用于本地开发测试
 */

import type { Task, Question, Result, QuestionType } from '../types'

// Mock 任务列表
export const mockTasks: Task[] = [
  {
    id: '1',
    title: '心理健康测评',
    description: '评估您的心理健康状况，了解当前的心理状态，包含睡眠、情绪、压力等多个维度',
    totalQuestions: 20,
    duration: 30,
    status: 'not_started',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '焦虑自评量表（SAS）',
    description: '通过标准化量表评估您的焦虑水平，帮助您了解自己的焦虑程度',
    totalQuestions: 15,
    duration: 20,
    status: 'in_progress',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: '抑郁自评量表（SDS）',
    description: '科学评估抑郁倾向，及时发现心理健康问题',
    totalQuestions: 15,
    duration: 20,
    status: 'completed',
    score: 85,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: '职业倦怠量表',
    description: '了解您在工作中的倦怠程度，帮助改善工作状态',
    totalQuestions: 12,
    duration: 15,
    status: 'not_started',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
]

// Mock 题目列表
export const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'single_choice',
    title: '第1题',
    content: '您最近一周的睡眠质量如何？',
    required: true,
    order: 1,
    options: [
      { id: '1', label: 'A', content: '很好，每天都能睡得很香', score: 5 },
      { id: '2', label: 'B', content: '还可以，偶尔会失眠', score: 3 },
      { id: '3', label: 'C', content: '不太好，经常失眠', score: 1 },
      { id: '4', label: 'D', content: '很差，几乎每天都失眠', score: 0 },
    ],
  },
  {
    id: '2',
    type: 'multiple_choice',
    title: '第2题',
    content: '您最近一个月出现过以下哪些症状？（可多选）',
    required: true,
    order: 2,
    options: [
      { id: '5', label: 'A', content: '头痛', score: 2 },
      { id: '6', label: 'B', content: '疲劳', score: 2 },
      { id: '7', label: 'C', content: '焦虑', score: 3 },
      { id: '8', label: 'D', content: '心悸', score: 3 },
      { id: '9', label: 'E', content: '没有任何症状', score: 0 },
    ],
  },
  {
    id: '3',
    type: 'scale',
    title: '第3题',
    content: '您对目前的生活满意度如何？',
    required: true,
    order: 3,
    options: [
      { id: '10', label: '1', content: '非常不满意', score: 1 },
      { id: '11', label: '2', content: '不满意', score: 2 },
      { id: '12', label: '3', content: '一般', score: 3 },
      { id: '13', label: '4', content: '满意', score: 4 },
      { id: '14', label: '5', content: '非常满意', score: 5 },
    ],
  },
  {
    id: '4',
    type: 'true_false',
    title: '第4题',
    content: '您最近是否感到情绪低落？',
    required: true,
    order: 4,
    options: [
      { id: '15', label: 'A', content: '是', score: 1 },
      { id: '16', label: 'B', content: '否', score: 5 },
    ],
  },
  {
    id: '5',
    type: 'single_choice',
    title: '第5题',
    content: '您的工作压力如何？',
    required: true,
    order: 5,
    options: [
      { id: '17', label: 'A', content: '压力很大，经常加班', score: 1 },
      { id: '18', label: 'B', content: '有一定压力，但可以应对', score: 3 },
      { id: '19', label: 'C', content: '压力适中，工作生活平衡', score: 5 },
      { id: '20', label: 'D', content: '几乎没有压力', score: 4 },
    ],
  },
]

// Mock 结果列表
export const mockResults: Result[] = [
  {
    id: 'result_1',
    taskId: '3',
    taskTitle: '抑郁自评量表（SDS）',
    totalScore: 85,
    maxScore: 100,
    percentage: 85,
    level: '良好',
    analysis: '您的心理健康状况良好，整体表现稳定。睡眠质量较好，生活满意度较高，但偶尔会出现一些压力症状。\n\n具体表现：\n1. 睡眠状况：睡眠质量良好，能够保证充足休息\n2. 情绪状态：情绪较为稳定，能够有效调节\n3. 压力水平：压力处于可控范围内\n4. 生活满意度：对生活整体较为满意',
    suggestion: '建议您继续保持良好的生活习惯：\n\n1. 作息规律：每天保证7-8小时睡眠，规律作息\n2. 适度运动：每周进行3次以上有氧运动，如跑步、游泳等\n3. 社交活动：定期与朋友家人交流，保持良好的社会支持\n4. 压力管理：学习一些放松技巧，如冥想、深呼吸、瑜伽等\n5. 均衡饮食：保证营养均衡，多吃蔬菜水果\n6. 积极心态：保持乐观积极的生活态度',
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 1200,
  },
  {
    id: 'result_2',
    taskId: '1',
    taskTitle: '心理健康测评',
    totalScore: 92,
    maxScore: 100,
    percentage: 92,
    level: '优秀',
    analysis: '您的心理健康状况优秀！各项指标都表现出色，说明您拥有良好的心理素质和健康的生活方式。',
    suggestion: '继续保持当前的良好状态，定期进行自我评估。',
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 1500,
  },
]

// Mock 结果详情
export const mockResultDetail: Result = mockResults[0]

// 延迟函数（模拟网络请求）
export const delay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

