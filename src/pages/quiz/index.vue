<template>
  <view class="page">
    <view class="card">
      <view class="title">答题</view>
      <view class="desc">这里展示可测评量表/问卷列表，点击进入开始答题。</view>
      <AtButton type="primary" :full="true" @click="startDemo">开始示例答题</AtButton>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { onMounted } from 'vue'
import { AtButton } from 'taro-ui-vue3'

export default {
  components: { AtButton },
  setup() {
    onMounted(() => {
      const token = Taro.getStorageSync('AUTH_TOKEN')
      if (!token) {
        Taro.redirectTo({ url: '/pages/login/index' })
      }
    })

    const startDemo = () => {
      Taro.showToast({ title: '开始答题（示例）', icon: 'none' })
    }

    return { startDemo }
  }
}
</script>

<style>
.page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 64rpx 40rpx; box-sizing: border-box; background: linear-gradient(180deg, var(--bg-gradient-start, #F0F5FF) 0%, var(--bg-gradient-end, #E8F3FF) 100%); }
.card { width: 100%; max-width: 680rpx; background: var(--card-bg, #fff); border-radius: 24rpx; padding: 32rpx 28rpx 24rpx; box-shadow: 0 12rpx 40rpx rgba(0,0,0,0.04); box-sizing: border-box; }
.title { font-size: 36rpx; font-weight: 600; text-align: center; margin-bottom: 20rpx; color: var(--text-primary, #1d2129); }
.desc { font-size: 26rpx; color: var(--text-secondary, #86909c); text-align: center; margin-bottom: 28rpx; }
</style>
