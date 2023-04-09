<template>
  <!-- 背景图片 -->
  <div id="ebg"></div>
  <div class="common-layout">
    <el-container>
      <!-- 左侧菜单栏 -->
      <el-aside width="auto">
        <AsideMenu></AsideMenu>
      </el-aside>
      <el-container>
        <!-- 顶部导航栏 -->
        <el-header>
          <TopBar/>
        </el-header>
        <!-- 主要内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
// import { computed } from 'vue'
// import {useSettingStore} from "../../store/modules/setting";
import AsideMenu from './aside/index.vue';
import TopBar from './header/TopBar.vue';
// const SettingStore = useSettingStore()
// 是否折叠
// const isCollapse = computed(() => !SettingStore.isCollapse)
// 引入左侧菜单栏自定义组件
</script>

<style lang="less" scoped>
.common-layout {
  width: 99%;
  height: 99%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  
  .el-container {
    height: 100%;
    /* 顶部导航栏 */
    .el-header {
      padding: 0px;
      height: 111px;
      background: #F3F3F3;
    }
    .el-main {
      background: #F3F3F3;
    }
  }
}

/* 设置背景图 */
#ebg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-image: url(../../assets/system-bg.jpg);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

</style>
