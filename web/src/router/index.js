import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from '../config/nprogress';
import { useUserStore } from '../store/modules/user';
import { useMenuStore } from '../store/modules/menu';
// 定义静态路由
// isMenu 是否展示在左菜单
// funcNode 是否有子菜单
export const staticRouter = [
  {
    path: '/',
    redirect: '/login',
    isMenu: false,
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '学生信息管理系统 - 登录' },
    component: () => import('../views/login/Login.vue'),
    isMenu: false,
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/layout/Index.vue'),
    redirect: '/home',
    isMenu: true,
    funcNode: 1,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: '首页', icon: 'House', affix: true },
        component: () => import('../views/home/Index.vue'),
      },
    ],
  },
  {
    path: '/user',
    name: 'UserSetting',
    redirect: '/user/setting',
    component: () => import('../views/layout/Index.vue'),
    isMenu: true,
    funcNode: 1,
    children: [
      {
        path: 'setting',
        name: 'PersonalSettings',
        meta: { title: '个人设置', icon: 'Basketball' },
        component: () =>
          import('../views/user/components/PersonalSettings.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '404' },
    isMenu: false,
  },
];
// 定义动态路由
export const asyncRoutes = [
  {
    path: '/system',
    name: 'system',
    meta: {
      title: '系统管理',
      icon: 'GoldMedal',
      role: ['ROLE_ADMIN'],
    },
    redirect: '/system/user',
    component: () => import('../views/layout/Index.vue'),
    isMenu: true,
    funcNode: 2,
    children: [
      {
        path: 'user',
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'UserFilled',
          role: ['ROLE_ADMIN'],
        },
        component: () => import('../views/user/UserList.vue'),
      },
      {
        path: 'role',
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'Stamp',
          role: ['ROLE_ADMIN'],
        },
        component: () => import('../views/role/RoleList.vue'),
      },
    ],
  },
  {
    path: '/base',
    name: 'base',
    meta: {
      title: '数据管理',
      icon: 'DataAnalysis',
      role: ['ROLE_ADMIN'],
    },
    redirect: '/base/gradeclass',
    component: () => import('../views/layout/Index.vue'),
    isMenu: true,
    funcNode: 2,
    children: [
      {
        path: 'gradeclass',
        name: 'gradeclass',
        meta: {
          title: '班级管理',
          icon: 'Box',
          role: ['ROLE_ADMIN'],
        },
        component: () => import('../views/gradeclass/GradeClassList.vue'),
      },
      {
        path: 'student',
        name: 'student',
        meta: {
          title: '学生管理',
          icon: 'User',
          role: ['ROLE_ADMIN'],
        },
        component: () => import('../views/student/StudentList.vue'),
      },
      {
        path: 'course',
        name: 'course',
        meta: {
          title: '课程管理',
          icon: 'Tickets',
          role: ['ROLE_ADMIN'],
        },
        component: () => import('../views/course/CourseList.vue'),
      },
      {
        path: 'teacher',
        name: 'teacher',
        meta: {
          title: '教师管理',
          icon: 'Avatar',
          role: ['ROLE_ADMIN'],
        },
        component: () => import('../views/teacher/TeacherList.vue'),
      },
    ],
  },
  {
    path: '/scores',
    name: 'scores',
    meta: {
      title: '成绩管理',
      icon: 'GoldMedal',
      role: ['ROLE_USER', 'ROLE_ADMIN'],
    },
    redirect: '/scores/index',
    component: () => import('../views/layout/Index.vue'),
    isMenu: true,
    funcNode: 2,
    children: [
      {
        path: 'index',
        name: 'scoresIndex',
        meta: {
          title: '班级科目成绩',
          icon: 'Money',
          role: ['ROLE_USER', 'ROLE_ADMIN'],
        },
        component: () => import('../views/scores/ScoresList.vue'),
      },
    ],
  },
  {
    path: '/census',
    name: 'census',
    meta: {
      title: '数据统计',
      icon: 'Medal',
      role: ['ROLE_USER', 'ROLE_ADMIN'],
    },
    redirect: '/census/index',
    component: () => import('../views/layout/Index.vue'),
    isMenu: true,
    funcNode: 2,
    children: [
      {
        path: 'index',
        name: 'scoresCensusIndex',
        meta: {
          title: '班级科目成绩统计',
          icon: 'Histogram',
          role: ['ROLE_USER', 'ROLE_ADMIN'],
        },
        component: () => import('../views/census/ScoresCensus.vue'),
      },
    ],
  },
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRouter,
});

// 路由拦截 beforeEach
router.beforeEach(async (to, from, next) => {
  // 1.NProgress 开始
  NProgress.start();

  const userStore = useUserStore();
  //如果是访问登录页
  if (to.path === '/login') {
    //判断是否有Token,有跳转到到home
    if (userStore.token) return next({ path: `/home`, replace: true })
    return next()
  };

  //判断是否有Token,没有跳转到到login
  if (!userStore.token) return next({ path: `/login`, replace: true });

  // 获取登录用户的角色
  const { userInfo } = userStore;
  const roles = [];
  roles.push(userInfo.role.code);

  // 根据角色动态生成路由访问映射
  const menuStore = useMenuStore();
  // 判断menuStore是否存有路由配置
  if (!menuStore.routers.length) {
    // 生成动态路由
    const accessRoutes = menuStore.generateRoutes({ roles });
    // 动态添加访问路由表
    accessRoutes.forEach((item) => router.addRoute(item));
    // 配置好路由之后重新再跳转一次
    next({ ...to, replace: true });
  } else {
    // 正常访问页面
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

router.onError((error) => {
  NProgress.done();
  console.warn('路由错误', error.message);
});

export default router;
