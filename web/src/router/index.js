import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from '../config/nprogress'
const routes = [
  {
    path: '/',
    redirect: '/login',
    isMenu: false
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '学生信息管理系统 - 登录' },
    component: () => import('../views/Login/Login.vue'),
    isMenu: false
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/layout/index.vue'),
    redirect: "/home",
    isMenu: true,
    funcNode: 1,
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        title: '首页',
        icon: 'House',
        affix: true//禁止关闭标识 
      },
      component: () => import('../views/home/index.vue')
    }]
  },
  {
    path: '/system',
    name: 'system',
    meta: { title: '系统管理', icon: 'GoldMedal' },
    component: () => import('../views/layout/index.vue'),
    redirect: '/system/user',
    children: [
      {
        path: 'user',
        name: 'User',
        meta: { title: '用户管理' },
        component: () => import('../views/user/UserList.vue')
      },
      {
        path: 'role',
        name: 'Role',
        meta: {
            title: '角色管理',
            icon: 'Stamp',
            role: ['ROLE_ADMIN']
        },
        component: ()=> import('../views/role/RoleList.vue')
    }
    ]
  },
  {
    path: '/base',
    name: 'base',
    meta: {
        title: '数据管理',
        icon: 'DataAnalysis',
        role: ['ROLE_ADMIN']
    },
    redirect: '/base/gradeclass',
    component: ()=> import('../views/layout/Index.vue'),
    isMenu: true,
    funcNode:2,
    children: [
        {
            path: 'student',
            name: 'student',
            meta: {
                title: '学生管理',
                icon: 'User',
                role: ['ROLE_ADMIN']
            },
            component: ()=> import('../views/student/StudentList.vue')
        },{
          path: 'teacher',
          name: 'teacher',
          meta: {
              title: '教师管理',
              icon: 'Avatar',
              role: ['ROLE_ADMIN']
          },
          component: ()=> import('../views/teacher/TeacherList.vue')
      },{
        path: 'course',
        name: 'course',
        meta: {
            title: '课程管理',
            icon: 'Tickets',
            role: ['ROLE_ADMIN']
        },
        component: ()=> import('../views/course/CourseList.vue')
    },{
      path: 'gradeclass',
      name: 'gradeclass',
      meta: {
          title: '班级管理',
          icon: 'Box',
          role: ['ROLE_ADMIN']
      },
      component: ()=> import('../views/gradeclass/GradeClassList.vue')
  },
    ]
},{
  path: '/scores',
  name: 'scores',
  meta: {
      title: '成绩管理',
      icon: 'GoldMedal',
      role: ['ROLE_USER','ROLE_ADMIN']
  },
  redirect: '/scores/index',
  component: ()=> import('../views/layout/Index.vue'),
  isMenu: true,
  funcNode:2,
  children: [
      {
          path: 'index',
          name: 'scoresIndex',
          meta: {
              title: '班级科目成绩',
              icon: 'Money',
              role: ['ROLE_USER','ROLE_ADMIN']
          },
          component: ()=> import('../views/scores/ScoresList.vue')
      }
  ]
},
]



const router = createRouter({
  history: createWebHashHistory(),
  routes
})


// 路由拦截
router.beforeEach((from, to, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
// 跳转错误
router.onError(err => {
  NProgress.done()
})


export default router