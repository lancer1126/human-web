import { constantRouterMap } from '@/router/routers'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    sidebarRouters: []
  }
}

export const filterAsyncRouter = (routers, lastRouter = false, type = false) => {
  return routers.filter(router => {
    if (type && router.children) {
      router.children = filterChildren(router.children)
    }
    if (router.component) {
      if (router.component === 'Layout') {
        // todo Layout组件特殊处理
      } else if (router.component === 'ParentView') {
        // todo ParentView组件处理
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children != null && router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children, router, type)
    } else {
      delete router['children']
      delete router['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  let children = []
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission