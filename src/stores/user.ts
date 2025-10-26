import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')

  // 设置用户信息
  const setUser = (userData: User) => {
    user.value = userData
  }

  // 设置 token
  const setToken = (tokenValue: string) => {
    token.value = tokenValue
  }

  // 清除用户信息
  const clearUser = () => {
    user.value = null
    token.value = ''
  }

  // 是否已登录
  const isLoggedIn = () => {
    return !!token.value && !!user.value
  }

  return {
    user,
    token,
    setUser,
    setToken,
    clearUser,
    isLoggedIn,
  }
})

