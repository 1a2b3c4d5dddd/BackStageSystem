import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 引入整个页面的布局、骨架【组件】
import Layout from '@/layout'

// 常量路由 --- 所有用户都能看到的组件 路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      // title 是侧边栏和面包屑的文字
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
]
// 异步路由 --- 不同用户的角色显示对应的路由 组件
export const asyncRoutes = [
  {
    path: '/product',
    component: Layout,
    name:'Product',
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'trademark',
        name: 'Trademark',
        component: () => import('@/views/product/Trademark'),
        // title 是侧边栏和面包屑的文字
        meta: { title: '品牌管理', }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/Attr'),
        // title 是侧边栏和面包屑的文字
        meta: { title: '平台属性管理', }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/Spu'),
        // title 是侧边栏和面包屑的文字
        meta: { title: 'Spu管理', }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/Sku'),
        // title 是侧边栏和面包屑的文字
        meta: { title: 'Sku管理', }
      },
    ]
    
  },

  {
    path: '/acl',
    component: Layout,
    name:'Acl',
    meta: { title: '权限管理', icon: 'el-icon-lock' },
    children: [
      {
        path: 'userManage',
        name: 'User',
        component: () => import('@/views/power/userManage'),
        // title 是侧边栏和面包屑的文字
        meta: { title: '用户管理', }
      },
      {
        path: 'roleManage',
        name: 'Role',
        component: () => import('@/views/power/roleManage'),
        // title 是侧边栏和面包屑的文字
        meta: { title: '角色管理', }
      },
      {
        path: 'menuManage',
        name: 'Permission',
        component: () => import('@/views/power/menuManage'),
        // title 是侧边栏和面包屑的文字
        meta: { title: '菜单管理', }
      },
    ]
    
  },
]
// 任意路由 --- 当路由路径错误时重定向404
export const anyRoutes = { path: '*', redirect: '/404', hidden: true }


const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})

const router = createRouter()

// 退出登入时，重置路由器
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
