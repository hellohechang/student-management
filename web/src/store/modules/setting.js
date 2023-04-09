import { defineStore } from 'pinia'

export const useSettingStore = defineStore({
  id: 'settingStore',
  state: () => {
    return {
      // menu 是否收缩
      isCollapse: true,
      // tagsView 是否展示 默认展示
      showTag: true,
    }
  },
  getters: {},
  actions: {
    // 切换 Collapse
    setCollapse(value) {
      this.isCollapse = value
    }
  },
  persist: true
})