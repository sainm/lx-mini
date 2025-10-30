<template>
  <view class="page">
    <view class="top">
      <!-- 使用真实Logo图片 -->
      <image class="logo-img" :src="logoImg" mode="aspectFill" />
      <view class="brand">欢迎登录</view>
      <view class="subtitle">请使用账号与密码登录</view>
    </view>

    <view class="card">
      <view class="title">登录</view>

      <view class="form-item">
        <input
          class="custom-input"
          v-model="username"
          type="text"
          placeholder="用户名"
        />
      </view>
      <view class="form-item">
        <input
          class="custom-input"
          v-model="password"
          type="password"
          placeholder="密码"
        />
      </view>

      <view class="actions">
        <AtButton type="primary" :full="true" :loading="loading" :disabled="loading" @click="onLogin">登录</AtButton>
        <AtButton type="secondary" :full="true" :disabled="loading" @click="goRegister">注册</AtButton>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { AtInput, AtButton } from 'taro-ui-vue3'
import { useUserStore } from '../../stores/user'
import { login } from '../../api/auth'

const userStore = useUserStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const logoImg = '/assets/images/logo.png'

const onLogin = async () => {
  console.log('登录 - 用户名:', username.value)
  console.log('登录 - 密码:', password.value)

  if (!username.value || !password.value) {
    Taro.showToast({ title: '请输入用户名和密码', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res = await login({
      username: username.value,
      password: password.value
    })

    // 保存 token 和用户信息
    Taro.setStorageSync('AUTH_TOKEN', res.token)
    userStore.setToken(res.token)
    userStore.setUser(res.user)

    Taro.showToast({ title: '登录成功', icon: 'success' })

    // 登录成功后，切换到任务列表Tab
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/quiz/index' })
    }, 500)
  } catch (error) {
    Taro.showToast({
      title: error.message || '登录失败',
      icon: 'none',
      duration: 2000
    })
  } finally {
    loading.value = false
  }
}

const goRegister = () => {
  Taro.navigateTo({ url: '/pages/register/index' })
}
</script>

<style>
/* 基于 750rpx 设计稿适配 */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64rpx 40rpx calc(64rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background: linear-gradient(180deg, var(--bg-gradient-start, #F0F5FF) 0%, var(--bg-gradient-end, #E8F3FF) 100%);
}
.top { display: flex; flex-direction: column; align-items: center; margin-bottom: 40rpx; }

/* Logo 图片样式 */
.logo-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 32rpx;
  box-shadow: 0 16rpx 48rpx rgba(22, 93, 255, 0.15);
  background: #fff;
}
.brand { margin-top: 20rpx; font-weight: 600; font-size: 36rpx; color: var(--text-primary, #1d2129); }
.subtitle { margin-top: 8rpx; font-size: 26rpx; color: var(--text-secondary, #86909c); }

.card {
  width: 100%;
  max-width: 680rpx;
  background: var(--card-bg, #fff);
  border-radius: 24rpx;
  padding: 32rpx 28rpx 24rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
}
.title { font-size: 36rpx; font-weight: 600; text-align: center; margin-bottom: 28rpx; color: var(--text-primary, #1d2129); }
.form-item { margin-bottom: 20rpx; }

/* 自定义输入框样式 */
.custom-input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  border: 2rpx solid #e5e6eb;
  border-radius: 12rpx;
  box-sizing: border-box;
  background: #fff;
  color: #1d2129;
}

.custom-input:focus {
  border-color: #165DFF;
  outline: none;
}

.custom-input::placeholder {
  color: #c9cdd4;
}

.actions { margin-top: 12rpx; }

/* 统一按钮宽度与间距（taro-ui 渲染后的类名为 .at-button） */
.actions .at-button { width: 100%; }
.actions .at-button + .at-button { margin-top: 20rpx; }
</style>
