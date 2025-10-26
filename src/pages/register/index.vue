<template>
  <view class="page">
    <view class="card">
      <view class="title">注册</view>

      <view class="form-item">
        <AtInput :value="username" type="text" placeholder="用户名（至少3个字符）" :clear="true" @change="onChangeUsername" />
      </view>
      <view class="form-item">
        <AtInput :value="password" type="password" placeholder="密码（至少6个字符）" :clear="true" @change="onChangePassword" />
      </view>
      <view class="form-item">
        <AtInput :value="confirmPassword" type="password" placeholder="确认密码" :clear="true" @change="onChangeConfirmPassword" />
      </view>

      <AtButton type="primary" :full="true" :loading="loading" :disabled="loading" @click="onRegister">注册</AtButton>
      <AtButton type="secondary" :full="true" :disabled="loading" @click="backLogin">返回登录</AtButton>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { AtInput, AtButton } from 'taro-ui-vue3'
import { useUserStore } from '../../stores/user'
import { register } from '../../api/auth'

const userStore = useUserStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const onChangeUsername = (val: string) => {
  username.value = val
}

const onChangePassword = (val: string) => {
  password.value = val
}

const onChangeConfirmPassword = (val: string) => {
  confirmPassword.value = val
}

const onRegister = async () => {
  if (!username.value || !password.value) {
    Taro.showToast({ title: '请输入用户名和密码', icon: 'none' })
    return
  }

  if (username.value.length < 3) {
    Taro.showToast({ title: '用户名至少3个字符', icon: 'none' })
    return
  }

  if (password.value.length < 6) {
    Taro.showToast({ title: '密码至少6个字符', icon: 'none' })
    return
  }

  if (password.value !== confirmPassword.value) {
    Taro.showToast({ title: '两次密码输入不一致', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res = await register({
      username: username.value,
      password: password.value
    })

    // 保存 token 和用户信息
    Taro.setStorageSync('AUTH_TOKEN', res.token)
    userStore.setToken(res.token)
    userStore.setUser(res.user)

    Taro.showToast({ title: '注册成功', icon: 'success' })

    // 注册成功后，跳转到任务列表
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/quiz/index' })
    }, 500)
  } catch (error: any) {
    Taro.showToast({
      title: error.message || '注册失败',
      icon: 'none',
      duration: 2000
    })
  } finally {
    loading.value = false
  }
}

const backLogin = () => {
  Taro.navigateBack({ delta: 1 })
}
</script>

<style>
.page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 64rpx 40rpx; box-sizing: border-box; background: linear-gradient(180deg, var(--bg-gradient-start, #F0F5FF) 0%, var(--bg-gradient-end, #E8F3FF) 100%); }
.card { width: 100%; max-width: 680rpx; background: var(--card-bg, #fff); border-radius: 24rpx; padding: 32rpx 28rpx 24rpx; box-shadow: 0 12rpx 40rpx rgba(0,0,0,0.04); box-sizing: border-box; }
.title { font-size: 36rpx; font-weight: 600; text-align: center; margin-bottom: 28rpx; color: var(--text-primary, #1d2129); }
.form-item { margin-bottom: 20rpx; }
.secondary-btn { color: var(--color-primary, #165DFF); border: 2rpx solid var(--color-primary, #165DFF); background: transparent; width: 100%; height: 88rpx; line-height: 88rpx; border-radius: 20rpx; margin-top: 20rpx; font-size: 32rpx; }
.taro-at-button { width: 100%; }
.taro-at-button + .taro-at-button { margin-top: 20rpx; }
</style>
