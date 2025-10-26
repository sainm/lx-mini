import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Task, Question, Result } from '../types'

export const useTaskStore = defineStore('task', () => {
  // 任务列表
  const tasks = ref<Task[]>([])

  // 当前任务
  const currentTask = ref<Task | null>(null)

  // 当前任务的题目列表
  const questions = ref<Question[]>([])

  // 用户答案
  const answers = ref<Map<string | number, string | string[]>>(new Map())

  // 答题开始时间
  const startTime = ref<number>(0)

  // 设置任务列表
  const setTasks = (taskList: Task[]) => {
    tasks.value = taskList
  }

  // 设置当前任务
  const setCurrentTask = (task: Task) => {
    currentTask.value = task
  }

  // 设置题目列表
  const setQuestions = (questionList: Question[]) => {
    questions.value = questionList.sort((a, b) => a.order - b.order)
  }

  // 设置答案
  const setAnswer = (questionId: string | number, answer: string | string[]) => {
    answers.value.set(questionId, answer)
  }

  // 获取答案
  const getAnswer = (questionId: string | number) => {
    return answers.value.get(questionId)
  }

  // 开始答题
  const startTask = () => {
    answers.value.clear()
    startTime.value = Date.now()
  }

  // 获取答题时长（秒）
  const getDuration = () => {
    if (!startTime.value) return 0
    return Math.floor((Date.now() - startTime.value) / 1000)
  }

  // 获取已答题数
  const getAnsweredCount = () => {
    return answers.value.size
  }

  // 清除当前任务数据
  const clearCurrentTask = () => {
    currentTask.value = null
    questions.value = []
    answers.value.clear()
    startTime.value = 0
  }

  return {
    tasks,
    currentTask,
    questions,
    answers,
    startTime,
    setTasks,
    setCurrentTask,
    setQuestions,
    setAnswer,
    getAnswer,
    startTask,
    getDuration,
    getAnsweredCount,
    clearCurrentTask,
  }
})

