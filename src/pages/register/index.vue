<template>
  <view class="page">
    <view class="card">
      <view class="title">注册</view>

      <view class="form-item">
        <AtInput :value="username" type="text" placeholder="用户名" :clear="true" @change="onChangeUsername" />
      </view>
      <view class="form-item">
        <AtInput :value="password" type="password" placeholder="密码" :clear="true" @change="onChangePassword" />
      </view>

      <AtButton type="primary" :full="true" @click="onRegister">注册</AtButton>
      <AtButton type="secondary" :full="true" @click="backLogin">返回登录</AtButton>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { ref } from 'vue'
import { AtInput, AtButton } from 'taro-ui-vue3'

export default {
  components: { AtInput, AtButton },
  setup() {
    const username = ref('')
    const password = ref('')

    const onChangeUsername = (val) => { username.value = val }
    const onChangePassword = (val) => { password.value = val }

    const onRegister = () => {
      if (!username.value || !password.value) {
        Taro.showToast({ title: '请输入用户名和密码', icon: 'none' })
        return
      }
      Taro.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => { Taro.navigateBack({ delta: 1 }) }, 500)
    }

    const backLogin = () => { Taro.navigateBack({ delta: 1 }) }

    return { username, password, onChangeUsername, onChangePassword, onRegister, backLogin }
  }
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
