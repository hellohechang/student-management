<template>
  <el-menu color="#fff" text-color="#67879b" router :default-active="route.path" :unique-opened="false"
    :default-openeds="[route.path]" class="el-menu-vertical-demo" :collapse="isCollapse" :collapse-transition="true">
    <!-- logo -->
    <div class="imgBox hidden-xs-only">
      <img v-show="!isCollapse" src="../../../assets/logo.png">
    </div>

    <el-menu-item index="/home">
      <el-icon>
        <House />
      </el-icon>
      <span>后台首页</span>
    </el-menu-item>

    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <DataAnalysis />
        </el-icon>
        <span>数据管理</span>
      </template>
      <el-menu-item index="/base/student">
        <el-icon>
          <User />
        </el-icon>
        学生管理
      </el-menu-item>
      <el-menu-item index="/base/teacher">
        <el-icon>
          <Avatar />
        </el-icon>
        教师管理
      </el-menu-item>
      <el-menu-item index="/base/course">
        <el-icon>
          <Tickets />
        </el-icon>
        课程管理
      </el-menu-item>
      <el-menu-item index="/base/gradeclass">
        <el-icon>
          <Box />
        </el-icon>
        班级管理
      </el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <GoldMedal />
        </el-icon>
        <span>成绩管理</span>
      </template>
      <el-menu-item index="/scores">
        <el-icon>
          <Money />
        </el-icon>
        班级科目成绩
      </el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <GoldMedal />
        </el-icon>
        <span>数据统计</span>
      </template>
      <el-menu-item index="/census">
        <el-icon>
          <Money />
        </el-icon>
        班级科目成绩统计
      </el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="4">
      <template #title>
        <el-icon>
          <GoldMedal />
        </el-icon>
        <span>系统管理</span>
      </template>
      <el-menu-item index="/system/user">
        <el-icon>
          <Money />
        </el-icon>
        用户管理
      </el-menu-item>
      <el-menu-item index="/system/role">
        <el-icon>
          <Money />
        </el-icon>
        角色管理
      </el-menu-item>
    </el-sub-menu>

    <el-menu-item index="5">
      <el-icon>
        <Money />
      </el-icon>
      <span>个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from 'vue-router'
import { useSettingStore } from '../../../store/modules/setting'
const route = useRoute()
const SettingStore = useSettingStore()
// 是否折叠
const isCollapse = computed(() => !SettingStore.isCollapse)
</script>

<style lang="less" scoped>
.imgBox {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 90%;
  }
}

.el-menu {
  height: 100%;
  border: 0;
}

/* 选中 */
:deep(.el-menu-item.is-active) {
  color: white;
  background: linear-gradient(to right, #a0c594, #039759);
}

// 设置侧边展开宽度
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>