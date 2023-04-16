<template>
  <div class="main-tabs-view">
    <div class="tabs-view">
      <el-tabs v-model="activeTabsValue" type="card" @tab-click="tabClick" @tab-remove="removeTab">
        <el-tab-pane v-for="item in visitedViews" :key="item.path" :path="item.path" :label="item.title" :name="item.path"
          :closable="!(item.meta && item.meta.affix)">
          <template #label>
            {{ item.title }}
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="right-btn">
      <MoreButton />
    </div>
  </div>
</template>
  
<script setup>
import { computed, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router";
import { useTagsViewStore } from "../../../store/modules/tagsView"
import MoreButton from './components/MoreButton.vue'
const TagsViewStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()

const visitedViews = computed(() => TagsViewStore.visitedViews)
const activeTabsValue = computed({
  get: () => {
    return TagsViewStore.activeTabsValue;
  },
  set: val => {
    TagsViewStore.setTabsMenuValue(val);
  }
})
// 添加tabs
const addTabs = () => {
  const { name } = route
  if (name === 'Login') return
  if (name) {
    TagsViewStore.addView(route)
  }
}
// 判断当前展示标签
const isActive = (path) => {
  return path === route.path
}
// 删除tabs
const removeTab = (activeTabPath) => {
  if (isActive(activeTabPath)) {
    toLastView(activeTabPath)
  }
  TagsViewStore.delView(activeTabPath)
}
// 显示上一个tabs标签
function toLastView(activeTabPath) {
  let index = visitedViews.value.findIndex(item => item.path === activeTabPath)
  const nextTab = visitedViews.value[index + 1] || visitedViews.value[index - 1];
  if (!nextTab) return;
  router.push(nextTab.path);
  TagsViewStore.addVisitedView(nextTab)
}
// 点击tabs标签事件 
const tabClick = (tabItem) => {
  let path = tabItem.props.name;
  router.push(path);
}

onMounted(() => {
  addTabs()
})
watch(route, () => {
  addTabs()
})

</script>
  
<style scoped>
.main-tabs-view {
  flex: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  background: white;
}

.tabs-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}

:deep(.el-tabs) {
  border-top: 1px solid #178557;
}

:deep(.el-tabs .el-tabs__nav) {
  border: none;
}

:deep(.el-tabs .el-tabs__header .el-tabs__item) {
  padding: 0px 10px !important;
  border: none;
}

:deep(.el-tabs .el-tabs__header .el-tabs__item.is-active) {
  color: #178557;
  border-bottom: 2px solid #178557;
}
</style>
  