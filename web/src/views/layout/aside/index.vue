<template>
  <el-menu unique-opened color="white" text-color="#67879b" router :default-active="route.path" :unique-opened="false"
    :default-openeds="[route.path]" class="el-menu-vertical-demo" :collapse="isCollapse" :collapse-transition="true">
    <!--logo start-->
    <div class="imgBox hidden-xs-only">
      <img v-show="!isCollapse" src="../../../assets/logo.png">
    </div>
    <!--logo end-->

    <!--遍历菜单 start-->
    <template v-for="(v, index) in menuData" :key="index">
      <!-- 展示并且有子菜单 -->
      <el-sub-menu v-if="v.isMenu && v.funcNode != 1" :index="index + ''">
        <template #title>
          <el-icon>
            <component :is="v.meta.icon"></component>
          </el-icon>
          <span>{{ v.meta.title }}</span>
        </template>
        <!-- 遍历子菜单 -->
        <el-menu-item v-for="child in v.children" :key="child.path" :index="`${v.path}/${child.path}`">
          <el-icon>
            <component :is="child.meta.icon"></component>
          </el-icon>
          {{ child.meta.title }}
        </el-menu-item>
      </el-sub-menu>
      <!--没有子菜单-->
      <el-menu-item v-else-if="v.isMenu" :key="v.children[0].path" :index="v.children[0].path">
        <el-icon>
          <component :is="v.children[0].meta.icon"></component>
        </el-icon>
        <span>{{ v.children[0].meta.title }}</span>
      </el-menu-item>
    </template>
    <!--遍历菜单 end-->
  </el-menu>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingStore } from "../../../store/modules/setting";
import { useMenuStore } from '../../../store/modules/menu'
const route = useRoute();
const SettingStore = useSettingStore()
const { routers } = useMenuStore()

const menuData = ref()
menuData.value = routers

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
::v-deep(.el-menu-item.is-active) {
  color: white !important;
  background: linear-gradient(to right, #a0c594, #039759) !important;
}

// 展开侧边的宽度
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
