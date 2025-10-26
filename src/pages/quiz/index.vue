<template>
  <view class="page">
    <!-- 头部统计 -->
    <view class="stats">
      <view class="stat-item">
        <text class="stat-value">{{ taskStats.total }}</text>
        <text class="stat-label">全部任务</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ taskStats.completed }}</text>
        <text class="stat-label">已完成</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ taskStats.pending }}</text>
        <text class="stat-label">待完成</text>
      </view>
    </view>

    <!-- 任务列表 -->
    <view class="task-list">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>

      <view v-else-if="tasks.length === 0" class="empty">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无测评任务</text>
      </view>

      <view v-else class="list-container">
        <view
          v-for="task in tasks"
          :key="task.id"
          class="task-card"
          @tap="goToTask(task)"
        >
          <!-- 任务状态标签 -->
          <view class="task-status" :class="'status-' + task.status">
            {{ getStatusText(task.status) }}
          </view>

          <!-- 任务标题 -->
          <view class="task-title">{{ task.title }}</view>

          <!-- 任务描述 -->
          <view class="task-desc">{{ task.description }}</view>

          <!-- 任务信息 -->
          <view class="task-info">
            <view class="info-item">
              <text class="info-icon">📝</text>
              <text class="info-text">{{ task.totalQuestions }} 题</text>
            </view>
            <view v-if="task.duration" class="info-item">
              <text class="info-icon">⏱</text>
              <text class="info-text">{{ task.duration }} 分钟</text>
            </view>
            <view v-if="task.deadline" class="info-item">
              <text class="info-icon">📅</text>
              <text class="info-text">{{ formatDeadline(task.deadline) }}</text>
            </view>
          </view>

          <!-- 完成信息 -->
          <view v-if="task.status === 'completed' && task.score !== undefined" class="task-score">
            得分: {{ task.score }}
          </view>

          <!-- 操作按钮 -->
          <view class="task-action">
            <text v-if="task.status === 'not_started'" class="action-text">开始答题 →</text>
            <text v-else-if="task.status === 'in_progress'" class="action-text">继续答题 →</text>
            <text v-else-if="task.status === 'completed'" class="action-text">查看结果 →</text>
            <text v-else class="action-text expired">已过期</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '../../stores/task'
import { getTaskList } from '../../api/task'
import type { Task, TaskStatus } from '../../types'

const taskStore = useTaskStore()

const loading = ref(false)
const tasks = ref<Task[]>([])

// 任务统计
const taskStats = computed(() => {
  return {
    total: tasks.value.length,
    completed: tasks.value.filter(t => t.status === 'completed').length,
    pending: tasks.value.filter(t => t.status === 'not_started' || t.status === 'in_progress').length,
  }
})

// 获取状态文本
const getStatusText = (status: TaskStatus) => {
  const statusMap = {
    not_started: '未开始',
    in_progress: '进行中',
    completed: '已完成',
    expired: '已过期',
  }
  return statusMap[status] || status
}

// 格式化截止时间
const formatDeadline = (deadline: string) => {
  const date = new Date(deadline)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (days < 0) return '已过期'
  if (days === 0) return '今天截止'
  if (days === 1) return '明天截止'
  return `${days}天后截止`
}

// 跳转到任务详情
const goToTask = (task: Task) => {
  if (task.status === 'expired') {
    Taro.showToast({ title: '任务已过期', icon: 'none' })
    return
  }

  if (task.status === 'completed') {
    // 跳转到结果页
    Taro.navigateTo({
      url: `/pages/task-result/index?taskId=${task.id}`
    })
  } else {
    // 跳转到答题页
    taskStore.setCurrentTask(task)
    Taro.navigateTo({
      url: `/pages/task-detail/index?taskId=${task.id}`
    })
  }
}

// 加载任务列表
const loadTasks = async () => {
  loading.value = true
  try {
    const list = await getTaskList()
    tasks.value = list
    taskStore.setTasks(list)
  } catch (error: any) {
    Taro.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 检查登录状态
onMounted(() => {
  const token = Taro.getStorageSync('AUTH_TOKEN')
  if (!token) {
    Taro.redirectTo({ url: '/pages/login/index' })
    return
  }
  loadTasks()
})
</script>

<style lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx;
  background: linear-gradient(180deg, #F0F5FF 0%, #E8F3FF 100%);
  box-sizing: border-box;
}

// 统计卡片
.stats {
  display: flex;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.04);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:not(:last-child) {
    border-right: 2rpx solid #f0f0f0;
  }
}

.stat-value {
  font-size: 48rpx;
  font-weight: 600;
  color: #165DFF;
  line-height: 1.2;
}

.stat-label {
  font-size: 24rpx;
  color: #86909c;
  margin-top: 8rpx;
}

// 任务列表
.task-list {
  min-height: 400rpx;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  color: #86909c;
  font-size: 28rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  color: #86909c;
}

// 任务卡片
.list-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.task-card {
  position: relative;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.task-status {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 500;

  &.status-not_started {
    background: #E8F3FF;
    color: #165DFF;
  }

  &.status-in_progress {
    background: #FFF7E6;
    color: #FF7D00;
  }

  &.status-completed {
    background: #E8FFEA;
    color: #00B42A;
  }

  &.status-expired {
    background: #FFECE8;
    color: #F53F3F;
  }
}

.task-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 16rpx;
  padding-right: 120rpx;
  line-height: 1.4;
}

.task-desc {
  font-size: 26rpx;
  color: #4e5969;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #86909c;
}

.info-icon {
  margin-right: 8rpx;
}

.task-score {
  padding: 16rpx;
  background: #F2F3F5;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #165DFF;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.task-action {
  display: flex;
  justify-content: flex-end;
  padding-top: 16rpx;
  border-top: 2rpx solid #f0f0f0;
}

.action-text {
  font-size: 28rpx;
  color: #165DFF;
  font-weight: 500;

  &.expired {
    color: #86909c;
  }
}
</style>
