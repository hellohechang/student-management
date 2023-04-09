<template>
  <div class="hamburger-container" @click="handleCollapse">
    <el-icon class="icon" color="#178557" v-if="isCollapse">
      <expand />
    </el-icon>
    <el-icon class="icon" color="#178557" v-else>
      <fold />
    </el-icon>
  </div>
</template>

<script setup>
import { useSettingStore } from "../../../store/modules/setting"
import { computed } from "vue"
const SettingStore = useSettingStore()
const isCollapse = computed(() => !SettingStore.isCollapse)
const handleCollapse = () => {
  SettingStore.setCollapse(isCollapse.value)
}
</script>

<style lang="less" scoped>
.hamburger-container {
  padding: 0px 15px;
  height: 100%;
  display: flex;
  align-items: center;

  .icon {
    font-size: 30px;
    cursor: pointer;
  }
}
</style>
