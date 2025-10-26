<template>
  <view class="page">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- 结果内容 -->
    <view v-else-if="result" class="content">
      <!-- 得分卡片 -->
      <view class="score-card">
        <view class="score-icon">🎉</view>
        <view class="score-title">测评完成</view>
        <view class="score-value">{{ result.totalScore }}</view>
        <view class="score-max">满分 {{ result.maxScore }}</view>
        <view class="score-percentage">得分率 {{ result.percentage }}%</view>

        <!-- 等级 -->
        <view v-if="result.level" class="score-level" :class="'level-' + getLevelClass(result.level)">
          {{ result.level }}
        </view>
      </view>

      <!-- 任务信息 -->
      <view class="info-card">
        <view class="card-title">测评信息</view>
        <view class="info-item">
          <text class="info-label">任务名称</text>
          <text class="info-value">{{ result.taskTitle }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">完成时间</text>
          <text class="info-value">{{ formatTime(result.completedAt) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">答题时长</text>
          <text class="info-value">{{ formatDuration(result.duration) }}</text>
        </view>
      </view>

      <!-- 结果分析 -->
      <view class="analysis-card">
        <view class="card-title">结果分析</view>
        <view class="analysis-content">{{ result.analysis }}</view>
      </view>

      <!-- 建议 -->
      <view v-if="result.suggestion" class="suggestion-card">
        <view class="card-title">💡 建议</view>
        <view class="suggestion-content">{{ result.suggestion }}</view>
      </view>

      <!-- 操作按钮 -->
      <view class="actions">
        <view class="btn btn-secondary" @tap="backToList">
          返回列表
        </view>
        <view class="btn btn-primary" @tap="shareResult">
          分享结果
        </view>
      </view>
    </view>

    <!-- 错误状态 -->
    <view v-else class="empty">
      <text class="empty-icon">😔</text>
      <text class="empty-text">未找到测评结果</text>
      <view class="btn btn-primary" style="margin-top: 40rpx;" @tap="backToList">
        返回列表
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, onMounted } from 'vue'
import { getResultDetail, getResultByTaskId } from '../../api/task'
import type { Result } from '../../types'

const loading = ref(false)
const result = ref<Result | null>(null)

// 获取等级样式类
const getLevelClass = (level: string) => {
  const levelMap: Record<string, string> = {
    '优秀': 'excellent',
    '良好': 'good',
    '中等': 'medium',
    '及格': 'pass',
    '不及格': 'fail',
  }
  return levelMap[level] || 'default'
}

// 格式化时间
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 格式化时长
const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h > 0) {
    return `${h}小时${m}分钟${s}秒`
  }
  if (m > 0) {
    return `${m}分钟${s}秒`
  }
  return `${s}秒`
}

// 返回列表
const backToList = () => {
  Taro.switchTab({ url: '/pages/quiz/index' })
}

// 分享结果
const shareResult = () => {
  Taro.showShareMenu({
    withShareTicket: true,
    showShareItems: ['wechatFriends', 'wechatMoment']
  })
  Taro.showToast({
    title: '点击右上角分享',
    icon: 'none'
  })
}

// 加载结果详情
const loadResult = async (resultId: string | number) => {
  loading.value = true
  try {
    const data = await getResultDetail(resultId)
    result.value = data
  } catch (error: any) {
    Taro.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 根据任务ID加载结果
const loadResultByTaskId = async (taskId: string | number) => {
  loading.value = true
  try {
    const data = await getResultByTaskId(taskId)
    result.value = data
  } catch (error: any) {
    Taro.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
    setTimeout(() => {
      backToList()
    }, 1500)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const instance = Taro.getCurrentInstance()
  const resultId = instance.router?.params?.resultId
  const taskId = instance.router?.params?.taskId

  if (resultId) {
    // 通过结果ID加载
    loadResult(resultId)
  } else if (taskId) {
    // 通过任务ID加载结果
    loadResultByTaskId(taskId)
  } else {
    Taro.showToast({
      title: '参数错误',
      icon: 'none'
    })
    setTimeout(() => {
      backToList()
    }, 1500)
  }
})
</script>

<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared'
  },
  // 分享配置
  onShareAppMessage() {
    return {
      title: '我的心理测评结果',
      path: '/pages/login/index'
    }
  }
}
</script>

<style lang="scss">
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F5FF 0%, #E8F3FF 100%);
  padding: 32rpx;
  box-sizing: border-box;
}

// 加载/空状态
.loading,
.empty {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #86909c;
  font-size: 28rpx;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #86909c;
}

// 内容容器
.content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 40rpx;
}

// 得分卡片
.score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 16rpx 48rpx rgba(102, 126, 234, 0.3);
  color: #fff;
}

.score-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.score-title {
  font-size: 28rpx;
  opacity: 0.9;
  margin-bottom: 24rpx;
}

.score-value {
  font-size: 96rpx;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 12rpx;
}

.score-max {
  font-size: 24rpx;
  opacity: 0.8;
  margin-bottom: 20rpx;
}

.score-percentage {
  font-size: 32rpx;
  font-weight: 600;
  padding: 12rpx 32rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40rpx;
  margin-bottom: 24rpx;
}

.score-level {
  padding: 16rpx 40rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.25);

  &.level-excellent {
    background: rgba(255, 215, 0, 0.3);
  }

  &.level-good {
    background: rgba(0, 180, 42, 0.3);
  }

  &.level-medium {
    background: rgba(22, 93, 255, 0.3);
  }

  &.level-pass {
    background: rgba(255, 125, 0, 0.3);
  }

  &.level-fail {
    background: rgba(245, 63, 63, 0.3);
  }
}

// 信息卡片
.info-card,
.analysis-card,
.suggestion-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.04);
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 28rpx;
  color: #86909c;
}

.info-value {
  font-size: 28rpx;
  color: #1d2129;
  font-weight: 500;
  text-align: right;
  max-width: 400rpx;
}

// 分析内容
.analysis-content,
.suggestion-content {
  font-size: 28rpx;
  color: #4e5969;
  line-height: 1.8;
  white-space: pre-wrap;
}

.suggestion-card {
  background: #FFF7E6;
  border: 2rpx solid #FFD666;
}

.suggestion-card .card-title {
  color: #FF7D00;
}

// 操作按钮
.actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
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

