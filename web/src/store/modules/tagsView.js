import { defineStore } from 'pinia';
import router from '../../router';
export const useTagsViewStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'tagsViewState',
  // state: 返回对象的函数
  state: () => {
    return {
      activeTabsValue: '/home',
      visitedViews: [
        {
          path: '/home',
          name: 'home',
          meta: { title: '首页', affix: true, icon: 'House' },
          title: '首页',
        },
      ],
      cachedViews: [],
    };
  },
  getters: {},
  // 可以同步 也可以异步
  actions: {
    //更新当前标签
    setTabsMenuValue(val) {
      this.activeTabsValue = val;
    },
    // 添加标签
    addView(view) {
      this.addVisitedView(view);
    },
    addVisitedView(view) {
      this.setTabsMenuValue(view.path);
      // 新增已存在
      if (this.visitedViews.some((v) => v.path === view.path)) return;

      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name',
        })
      );
      if (view.meta.keepAlive) {
        this.cachedViews.push(view.name);
      }
    },
    removeView(routes) {
      return new Promise((resolve, reject) => {
        this.visitedViews = this.visitedViews.filter(
          (item) => !routes.includes(item.path)
        );
        resolve(null);
      });
    },

    delView(activeTabPath) {
      this.delVisitedView(activeTabPath);
      this.delCachedView(activeTabPath);
    },
    toLastView(activeTabPath) {
      let index = this.visitedViews.findIndex(
        (item) => item.path === activeTabPath
      );
      const nextTab =
        this.visitedViews[index + 1] || this.visitedViews[index - 1];
      if (!nextTab) return;
      router.push(nextTab.path);
      this.addVisitedView(nextTab);
    },
    delVisitedView(path) {
      return new Promise((resolve) => {
        this.visitedViews = this.visitedViews.filter((v) => {
          return v.path !== path || v.meta.affix;
        });
        this.cachedViews = this.cachedViews.filter((v) => {
          return v.path !== path || v.meta.affix;
        });
        resolve([...this.visitedViews]);
      });
    },
    delCachedView(view) {
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(view.name);
        index > -1 && this.cachedViews.splice(index, 1);
        resolve([...this.cachedViews]);
      });
    },
    clearVisitedView() {
      this.delAllViews();
    },
    delAllViews() {
      return new Promise((resolve) => {
        this.visitedViews = this.visitedViews.filter((v) => v.meta.affix);
        this.cachedViews = this.visitedViews.filter((v) => v.meta.affix);
        resolve([...this.visitedViews]);
      });
    },
    delOtherViews(path) {
      this.visitedViews = this.visitedViews.filter((item) => {
        return item.path === path || item.meta.affix;
      });
      this.cachedViews = this.visitedViews.filter((item) => {
        return item.path === path || item.meta.affix;
      });
    },
    goHome() {
      this.activeTabsValue = '/home';
      router.push({ path: '/home' });
    },
    updateVisitedView(view) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view);
          break;
        }
      }
    },
  },
});
