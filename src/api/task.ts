import { get, post } from '../utils/request'
import { API_ENDPOINTS, USE_MOCK } from '../config/api'
import type { Task, Question, Result, SubmitData } from '../types'
import { mockTasks, mockQuestions, mockResults, mockResultDetail, delay } from '../utils/mock'

/**
 * 获取任务列表
 */
export async function getTaskList(): Promise<Task[]> {
  if (USE_MOCK) {
    await delay()
    return mockTasks
  }
  return get<Task[]>(API_ENDPOINTS.TASK_LIST)
}

/**
 * 获取任务详情（包含题目）
 */
export async function getTaskDetail(taskId: string | number): Promise<{
  task: Task
  questions: Question[]
}> {
  if (USE_MOCK) {
    await delay()
    const task = mockTasks.find(t => t.id === String(taskId))
    if (!task) {
      throw new Error('任务不存在')
    }
    return {
      task,
      questions: mockQuestions
    }
  }
  const url = API_ENDPOINTS.TASK_DETAIL.replace(':id', String(taskId))
  return get(url)
}

/**
 * 提交答题
 */
export async function submitAnswer(data: SubmitData): Promise<Result> {
  if (USE_MOCK) {
    await delay(1000)
    // Mock 计算分数
    const totalScore = Math.floor(Math.random() * 30) + 70 // 70-100分
    const maxScore = 100
    const percentage = totalScore

    let level = '及格'
    if (percentage >= 90) level = '优秀'
    else if (percentage >= 80) level = '良好'
    else if (percentage >= 70) level = '中等'
    else if (percentage >= 60) level = '及格'
    else level = '不及格'

    return {
      id: 'result_' + Date.now(),
      taskId: data.taskId,
      taskTitle: mockTasks.find(t => t.id === String(data.taskId))?.title || '测评任务',
      totalScore,
      maxScore,
      percentage,
      level,
      analysis: '这是一份模拟的测评结果分析。您的心理健康状况整体良好，各项指标都在正常范围内。建议您继续保持良好的生活习惯，适当进行体育锻炼，保持积极乐观的心态。',
      suggestion: '1. 保持规律作息，保证充足睡眠\n2. 适当进行体育锻炼\n3. 学会释放压力\n4. 保持良好的社交关系',
      completedAt: new Date().toISOString(),
      duration: data.duration
    }
  }
  const url = API_ENDPOINTS.SUBMIT_ANSWER.replace(':id', String(data.taskId))
  return post<Result>(url, data)
}

/**
 * 获取结果列表
 */
export async function getResultList(): Promise<Result[]> {
  if (USE_MOCK) {
    await delay()
    return mockResults
  }
  return get<Result[]>(API_ENDPOINTS.RESULT_LIST)
}

/**
 * 获取结果详情
 */
export async function getResultDetail(resultId: string | number): Promise<Result> {
  if (USE_MOCK) {
    await delay()
    return mockResults.find(r => r.id === String(resultId)) || mockResultDetail
  }
  const url = API_ENDPOINTS.RESULT_DETAIL.replace(':id', String(resultId))
  return get(url)
}

/**
 * 根据任务ID获取结果
 */
export async function getResultByTaskId(taskId: string | number): Promise<Result> {
  if (USE_MOCK) {
    await delay()
    // 从 mockResults 中找到对应 taskId 的结果
    const result = mockResults.find(r => r.taskId === String(taskId))
    if (result) {
      return result
    }
    // 如果没找到，说明任务刚完成，返回一个默认结果
    return mockResultDetail
  }
  // 真实 API 调用
  return get(`/api/tasks/${taskId}/result`)
}

