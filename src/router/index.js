import router from './routers'
import store from '@/store'
import Config from '@/settings'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { buildMenus } from '@/store/modules/menu'
import { filterAsyncRouter } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + '-' + Config.title
  }
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(() => {
          // todo 动态路由，拉取菜单
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            location.reload()
          })
        })
      } else if (store.getters.loadMenus) {
        store.dispatch('updateLoadMenus').then(() => {})
      } else {
        next()
      }
    }
  } else {
    // 没有token
    // 在免登录白名单
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 不然全部定向到登录页
      next(`/login?redirect=${to.fullPath}`)
      NProgress.done()
    }
  }
})

// 加载菜单
export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    const sdata = JSON.parse(JSON.stringify(res))
    const rdata = JSON.parse(JSON.stringify(res))
    const sidebarRoutes = filterAsyncRouter(sdata)
    const rewriteRoutes = filterAsyncRouter(rdata)
    rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })

    store.dispatch('GenerateRoutes', rewriteRoutes).then(() => {
      router.addRoutes(rewriteRoutes)
      next({ ...to, replace: true })
    })
    store.dispatch('SetSidebarRouters', sidebarRoutes).then(() => {})
  })
}

router.afterEach(() => {
  NProgress.done()
})
