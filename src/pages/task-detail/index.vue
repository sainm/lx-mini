<template>
  <view class="page">
    <!-- 顶部进度条 -->
    <view class="progress-bar">
      <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
    </view>

    <!-- 题目信息 -->
    <view class="header">
      <view class="question-index">
        第 {{ currentIndex + 1 }} / {{ questions.length }} 题
      </view>
      <view v-if="duration" class="timer">
        ⏱ {{ formatTime(duration) }}
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- 题目内容 -->
    <view v-else-if="currentQuestion" class="question-container">
      <view class="question-card">
        <!-- 题目标题 -->
        <view class="question-title">{{ currentQuestion.title }}</view>

        <!-- 题目内容 -->
        <view class="question-content">{{ currentQuestion.content }}</view>

        <!-- 题目图片 -->
        <image
          v-if="currentQuestion.image"
          class="question-image"
          :src="currentQuestion.image"
          mode="widthFix"
        />

        <!-- 选项列表 -->
        <view class="options">
          <!-- 单选 -->
          <view
            v-if="currentQuestion.type === 'single_choice' || currentQuestion.type === 'true_false'"
            v-for="option in currentQuestion.options"
            :key="option.id"
            class="option-item"
            :class="{ 'selected': isSelected(option.id) }"
            @tap="selectOption(option.id)"
          >
            <view class="option-radio">
              <view v-if="isSelected(option.id)" class="radio-checked"></view>
            </view>
            <view class="option-content">
              <text class="option-label">{{ option.label }}.</text>
              <text class="option-text">{{ option.content }}</text>
            </view>
          </view>

          <!-- 多选 -->
          <view
            v-else-if="currentQuestion.type === 'multiple_choice'"
            v-for="option in currentQuestion.options"
            :key="option.id"
            class="option-item"
            :class="{ 'selected': isSelected(option.id) }"
            @tap="toggleOption(option.id)"
          >
            <view class="option-checkbox">
              <view v-if="isSelected(option.id)" class="checkbox-checked">✓</view>
            </view>
            <view class="option-content">
              <text class="option-label">{{ option.label }}.</text>
              <text class="option-text">{{ option.content }}</text>
            </view>
          </view>

          <!-- 量表 -->
          <view
            v-else-if="currentQuestion.type === 'scale'"
            class="scale-options"
          >
            <view
              v-for="option in currentQuestion.options"
              :key="option.id"
              class="scale-item"
              :class="{ 'selected': isSelected(option.id) }"
              @tap="selectOption(option.id)"
            >
              <view class="scale-label">{{ option.label }}</view>
              <view class="scale-content">{{ option.content }}</view>
            </view>
          </view>
        </view>

        <!-- 必答标识 -->
        <view v-if="currentQuestion.required" class="required-tip">
          * 此题为必答题
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="footer">
      <view class="btn-group">
        <view
          v-if="currentIndex > 0"
          class="btn btn-secondary"
          @tap="prevQuestion"
        >
          上一题
        </view>
        <view
          v-if="currentIndex < questions.length - 1"
          class="btn btn-primary"
          @tap="nextQuestion"
        >
          下一题
        </view>
        <view
          v-else
          class="btn btn-primary"
          @tap="handleSubmit"
        >
          提交答卷
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '../../stores/task'
import { getTaskDetail, submitAnswer } from '../../api/task'
import type { Question, Answer } from '../../types'

const taskStore = useTaskStore()

const loading = ref(false)
const taskId = ref<string | number>('')
const questions = ref<Question[]>([])
const currentIndex = ref(0)
const duration = ref(0)
let timer: number | null = null

// 当前题目
const currentQuestion = computed(() => {
  return questions.value[currentIndex.value]
})

// 进度百分比
const progressPercent = computed(() => {
  if (questions.value.length === 0) return 0
  return Math.floor(((currentIndex.value + 1) / questions.value.length) * 100)
})

// 格式化时间
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// 判断选项是否被选中
const isSelected = (optionId: string | number) => {
  if (!currentQuestion.value) return false
  const answer = taskStore.getAnswer(currentQuestion.value.id)
  if (!answer) return false
  if (Array.isArray(answer)) {
    return answer.includes(String(optionId))
  }
  return answer === String(optionId)
}

// 单选选择
const selectOption = (optionId: string | number) => {
  if (!currentQuestion.value) return
  taskStore.setAnswer(currentQuestion.value.id, String(optionId))
}

// 多选切换
const toggleOption = (optionId: string | number) => {
  if (!currentQuestion.value) return
  const answer = taskStore.getAnswer(currentQuestion.value.id) as string[] || []
  const optionIdStr = String(optionId)
  const index = answer.indexOf(optionIdStr)

  if (index > -1) {
    answer.splice(index, 1)
  } else {
    answer.push(optionIdStr)
  }

  taskStore.setAnswer(currentQuestion.value.id, [...answer])
}

// 上一题
const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// 下一题
const nextQuestion = () => {
  // 检查必答题
  if (currentQuestion.value?.required) {
    const answer = taskStore.getAnswer(currentQuestion.value.id)
    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
      Taro.showToast({ title: '请先回答此题', icon: 'none' })
      return
    }
  }

  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

// 提交答卷
const handleSubmit = async () => {
  // 检查最后一题
  if (currentQuestion.value?.required) {
    const answer = taskStore.getAnswer(currentQuestion.value.id)
    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
      Taro.showToast({ title: '请先回答此题', icon: 'none' })
      return
    }
  }

  // 检查未完成的必答题
  const unansweredRequired = questions.value.filter(q => {
    if (!q.required) return false
    const answer = taskStore.getAnswer(q.id)
    return !answer || (Array.isArray(answer) && answer.length === 0)
  })

  if (unansweredRequired.length > 0) {
    const result = await Taro.showModal({
      title: '提示',
      content: `还有 ${unansweredRequired.length} 道必答题未完成，确定要提交吗？`,
      confirmText: '继续答题',
      cancelText: '提交',
    })
    if (result.confirm) {
      return
    }
  } else {
    const result = await Taro.showModal({
      title: '确认提交',
      content: '确定要提交答卷吗？提交后将无法修改。',
    })
    if (!result.confirm) {
      return
    }
  }

  // 提交答案
  Taro.showLoading({ title: '提交中...' })
  try {
    // 转换答案格式
    const answers: Answer[] = []
    Object.entries(taskStore.answers).forEach(([questionId, answer]) => {
      answers.push({
        questionId,
        answer,
      })
    })

    const result = await submitAnswer({
      taskId: taskId.value,
      answers,
      duration: taskStore.getDuration(),
    })

    Taro.hideLoading()
    Taro.showToast({ title: '提交成功', icon: 'success' })

    // 清除当前任务数据
    taskStore.clearCurrentTask()

    // 跳转到结果页
    setTimeout(() => {
      Taro.redirectTo({
        url: `/pages/task-result/index?resultId=${result.id}`
      })
    }, 500)
  } catch (error: any) {
    Taro.hideLoading()
    Taro.showToast({
      title: error.message || '提交失败',
      icon: 'none'
    })
  }
}

// 加载任务详情
const loadTaskDetail = async () => {
  loading.value = true
  try {
    const data = await getTaskDetail(taskId.value)
    questions.value = data.questions
    taskStore.setQuestions(data.questions)
    taskStore.startTask()

    // 启动计时器
    timer = setInterval(() => {
      duration.value++
    }, 1000) as unknown as number
  } catch (error: any) {
    Taro.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const instance = Taro.getCurrentInstance()
  taskId.value = instance.router?.params?.taskId || ''

  if (!taskId.value) {
    Taro.showToast({ title: '参数错误', icon: 'none' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
    return
  }

  loadTaskDetail()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared'
  }
}
</script>

<style lang="scss">
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F6F8;
}

// 进度条
.progress-bar {
  height: 8rpx;
  background: #e5e6eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #165DFF 0%, #4080FF 100%);
  transition: width 0.3s ease;
}

// 头部
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  background: #fff;
  border-bottom: 2rpx solid #f0f0f0;
  position: sticky;
  top: 8rpx;
  z-index: 99;
}

.question-index {
  font-size: 28rpx;
  font-weight: 600;
  color: #165DFF;
}

.timer {
  font-size: 26rpx;
  color: #86909c;
}

// 加载状态
.loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #86909c;
  font-size: 28rpx;
}

// 题目容器
.question-container {
  flex: 1;
  padding: 32rpx;
  overflow-y: auto;
}

.question-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.04);
}

.question-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 20rpx;
  line-height: 1.6;
}

.question-content {
  font-size: 28rpx;
  color: #4e5969;
  line-height: 1.8;
  margin-bottom: 32rpx;
}

.question-image {
  width: 100%;
  border-radius: 12rpx;
  margin-bottom: 32rpx;
}

// 选项
.options {
  margin-bottom: 24rpx;
}

.option-item {
  display: flex;
  align-items: flex-start;
  padding: 24rpx;
  margin-bottom: 20rpx;
  border: 2rpx solid #e5e6eb;
  border-radius: 16rpx;
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }

  &.selected {
    border-color: #165DFF;
    background: #F7F9FF;
  }
}

.option-radio,
.option-checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #c9cdd4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16rpx;
  margin-top: 4rpx;
  transition: all 0.3s;
}

.option-radio {
  border-radius: 50%;
}

.option-checkbox {
  border-radius: 8rpx;
}

.option-item.selected .option-radio,
.option-item.selected .option-checkbox {
  border-color: #165DFF;
  background: #165DFF;
}

.radio-checked {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #fff;
}

.checkbox-checked {
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
}

.option-content {
  flex: 1;
  font-size: 28rpx;
  color: #1d2129;
  line-height: 1.6;
}

.option-label {
  font-weight: 600;
  margin-right: 8rpx;
}

// 量表选项
.scale-options {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.scale-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  border: 2rpx solid #e5e6eb;
  border-radius: 16rpx;
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }

  &.selected {
    border-color: #165DFF;
    background: #F7F9FF;
  }
}

.scale-label {
  font-size: 32rpx;
  font-weight: 600;
  color: #165DFF;
  min-width: 60rpx;
}

.scale-content {
  flex: 1;
  font-size: 28rpx;
  color: #1d2129;
  margin-left: 20rpx;
}

// 必答提示
.required-tip {
  font-size: 24rpx;
  color: #F53F3F;
  margin-top: 16rpx;
}

// 底部操作栏
.footer {
  padding: 24rpx 32rpx calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 2rpx solid #f0f0f0;
}

.btn-group {
  display: flex;
  gap: 20rpx;
}

.btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
  transition: opacity 0.3s;

  &:active {
    opacity: 0.8;
  }
}

.btn-primary {
  background: #165DFF;
  color: #fff;
}

.btn-secondary {
  background: #F2F3F5;
  color: #4e5969;
}
</style>

