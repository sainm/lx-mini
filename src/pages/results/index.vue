<template>
  <view class="page">
    <!-- 头部 -->
    <view class="header">
      <view class="header-title">我的测评结果</view>
      <view class="header-desc">共 {{ results.length }} 条记录</view>
    </view>

    <!-- 结果列表 -->
    <view class="result-list">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>

      <view v-else-if="results.length === 0" class="empty">
        <text class="empty-icon">📊</text>
        <text class="empty-text">暂无测评结果</text>
        <text class="empty-tip">完成任务后可在此查看结果</text>
      </view>

      <view v-else class="list-container">
        <view
          v-for="item in results"
          :key="item.id"
          class="result-card"
          @tap="viewResult(item)"
        >
          <!-- 左侧信息 -->
          <view class="result-main">
            <view class="result-title">{{ item.taskTitle }}</view>
            <view class="result-time">{{ formatTime(item.completedAt) }}</view>
            <view class="result-info">
              <text class="info-score">得分: {{ item.totalScore }}/{{ item.maxScore }}</text>
              <text class="info-percentage">{{ item.percentage }}%</text>
            </view>
          </view>

          <!-- 右侧等级/徽章 -->
          <view class="result-badge">
            <view class="badge-icon" :class="'level-' + getLevelClass(item.level)">
              {{ getLevelIcon(item.level) }}
            </view>
            <text class="badge-text">{{ item.level || '已完成' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, onMounted } from 'vue'
import { getResultList } from '../../api/task'
import type { Result } from '../../types'

const loading = ref(false)
const results = ref<Result[]>([])

// 获取等级样式类
const getLevelClass = (level?: string) => {
  if (!level) return 'default'
  const levelMap: Record<string, string> = {
    '优秀': 'excellent',
    '良好': 'good',
    '中等': 'medium',
    '及格': 'pass',
    '不及格': 'fail',
  }
  return levelMap[level] || 'default'
}

// 获取等级图标
const getLevelIcon = (level?: string) => {
  if (!level) return '✓'
  const iconMap: Record<string, string> = {
    '优秀': '🏆',
    '良好': '🎖',
    '中等': '⭐',
    '及格': '✓',
    '不及格': '×',
  }
  return iconMap[level] || '✓'
}

// 格式化时间
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}分钟前`
    }
    return `${hours}小时前`
  }
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

// 查看结果详情
const viewResult = (item: Result) => {
  Taro.navigateTo({
    url: `/pages/task-result/index?resultId=${item.id}`
  })
}

// 加载结果列表
const loadResults = async () => {
  loading.value = true
  try {
    const list = await getResultList()
    results.value = list.sort((a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
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
  loadResults()
})
</script>

<style lang="scss">
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F5FF 0%, #E8F3FF 100%);
}

// 头部
.header {
  padding: 48rpx 32rpx 32rpx;
  background: #fff;
  border-bottom: 2rpx solid #f0f0f0;
}

.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #1d2129;
  margin-bottom: 12rpx;
}

.header-desc {
  font-size: 26rpx;
  color: #86909c;
}

// 结果列表
.result-list {
  padding: 32rpx;
  min-height: 400rpx;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #4e5969;
  margin-bottom: 12rpx;
  font-weight: 500;
}

.empty-tip {
  font-size: 26rpx;
  color: #86909c;
}

// 结果卡片
.list-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.result-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.result-main {
  flex: 1;
  margin-right: 20rpx;
}

.result-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-time {
  font-size: 24rpx;
  color: #86909c;
  margin-bottom: 16rpx;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.info-score {
  font-size: 26rpx;
  color: #4e5969;
  font-weight: 500;
}

.info-percentage {
  padding: 4rpx 16rpx;
  background: #E8F3FF;
  color: #165DFF;
  font-size: 24rpx;
  font-weight: 600;
  border-radius: 8rpx;
}

// 等级徽章
.result-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.badge-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;

  &.level-excellent {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  }

  &.level-good {
    background: linear-gradient(135deg, #00B42A 0%, #00D68F 100%);
  }

  &.level-medium {
    background: linear-gradient(135deg, #165DFF 0%, #4080FF 100%);
  }

  &.level-pass {
    background: linear-gradient(135deg, #FF7D00 0%, #FFAA00 100%);
  }

  &.level-fail {
    background: linear-gradient(135deg, #F53F3F 0%, #FF7777 100%);
  }

  &.level-default {
    background: linear-gradient(135deg, #86909c 0%, #a8b3c0 100%);
  }
}

.badge-text {
  font-size: 22rpx;
  color: #86909c;
  font-weight: 500;
}
</style>
