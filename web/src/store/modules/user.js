import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => {
    return {
      token: '',
      userInfo: {},
      // 角色
      roles: []
    }
  },
  getters: {},
  actions: {
    setToken(token) {
      this.token = token
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    }
  },
  //持久化存储
  persist: true
})