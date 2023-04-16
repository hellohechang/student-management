import { defineStore } from 'pinia';
import { asyncRoutes, staticRouter } from '../../router';
export const useMenuStore = defineStore({
  id: 'menuState',
  // state: 返回对象的函数
  state: () => ({
    // menu 静态路由
    routers: [],
    // 动态路由
    addRouters: []
  }),
  getters: {},
  actions: {
    // 设置角色
    generateRoutes: function ({ roles }) {
      // 过滤路由
      let accessedRoutes = filterAsyncRoutes({
        routes: asyncRoutes,
        roles: roles,
      });
      this.addRouters = accessedRoutes;
      // 合并静态和动态路由
      this.routers = staticRouter.concat(accessedRoutes);
      return accessedRoutes;
    }
  },
});
// 通过角色过滤asyncRoutes
export function filterAsyncRoutes({ routes, roles }) {
  const res = [];
  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      // 有子路由则递归过滤
      if (tmp.children) {
        tmp.children = filterAsyncRoutes({
          routes: tmp.children,
          roles: roles,
        });
      }
      res.push(tmp);
    }
  });
  return res;
}
// 判断角色是否可以访问路由
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some((role) => route.meta.role.indexOf(role) >= 0);
  } else {
    return true;
  }
}
