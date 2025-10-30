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
  
  // 调用后端接口（使用 GET）
  const response = await get<any>(API_ENDPOINTS.TASK_LIST)
  
  console.log('=== 任务列表原始数据 ===')
  console.log(response)
  console.log('=====================')
  
  // 注意：request.ts 已经解包了 result.data，所以这里收到的是 { list: [...], total: 1 }
  if (response && response.list) {
    const tasks = response.list.map((item: any) => {
      // 转换后端状态码到前端状态
      // 后端: 0=未开始, 1=进行中, 2=已完成
      console.log('原始状态:', item.status, '进度:', item.progress)
      let status: 'not_started' | 'in_progress' | 'completed' | 'expired' = 'not_started'
      if (item.status === 2 || item.progress === 100) {
        status = 'completed'
      } else if (item.status === 1 || (item.progress > 0 && item.progress < 100)) {
        status = 'in_progress'
      }
      console.log('转换后状态:', status)
      
      return {
        id: item.id,
        title: item.scaleName || '未命名测评',
        description: `${item.planName} - ${item.versionName}`,
        coverImage: undefined,
        totalQuestions: 0, // 需要从任务详情接口获取
        duration: undefined,
        status: status,
        deadline: item.endTime || '',
        completedAt: item.status === 2 ? item.createTime : undefined,
        score: undefined,
        createdAt: item.createTime || new Date().toISOString()
      }
    })
    
    console.log('=== 转换后的任务列表 ===')
    console.log(tasks)
    console.log('====================')
    
    return tasks
  }
  
  // 兼容其他格式
  if (Array.isArray(response)) {
    return response
  }
  
  if (response && response.list) {
    return response.list
  }
  
  if (response && response.data && Array.isArray(response.data)) {
    return response.data
  }
  
  return []
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
  // 使用 POST 而不是 GET
  const url = API_ENDPOINTS.TASK_DETAIL.replace(':id', String(taskId))
  return post(url, {}, true)
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
  // 使用 POST 而不是 GET
  return post<Result[]>(API_ENDPOINTS.RESULT_LIST, {}, true)
}

/**
 * 获取结果详情
 */
export async function getResultDetail(resultId: string | number): Promise<Result> {
  if (USE_MOCK) {
    await delay()
    return mockResults.find(r => r.id === String(resultId)) || mockResultDetail
  }
  // 使用 POST 而不是 GET
  const url = API_ENDPOINTS.RESULT_DETAIL.replace(':id', String(resultId))
  return post(url, {}, true)
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
  // 真实 API 调用（使用 POST 而不是 GET）
  return post(`/api/tasks/${taskId}/result`, {}, true)
}

