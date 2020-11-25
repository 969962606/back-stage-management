import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from './utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/white']


router.beforeEach(async (to, from, next) => {
  NProgress.start() // start progress bar
    document.title = getTitle(to.meta.title)
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.token) {
        const hasRoles = store.getters.roles.length > 0
        if (hasRoles) {
          next()
        } else {
          try {
            const { roles } = await store.dispatch('user/_getInfo')
            const addRoutes = await store.dispatch(
              'permission/getAsyncRoutes',
              roles
            )
            router.addRoutes(addRoutes)
            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          } catch (error) {
            Message.error(error)
          }
        }
      } else {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      }
    }
  })

  router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    if (getToken()) { // determine if there has token
      /* has token*/
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
      } else {
        console.log(store);
        if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
          store.dispatch('GetUserInfo').then(res => { // 拉取user_info
            console.log('GetUserInfo');
            const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
            store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
              // router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              const { roles } = await store.dispatch('user/_getInfo')
              const addRoutes = await store.dispatch(
                'permission/getAsyncRoutes',
                roles
              )
              router.addRoutes(addRoutes)
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          }).catch((err) => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({ path: '/' })
            })
          })
        } else {
          // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
          if (hasPermission(store.getters.roles, to.meta.roles)) {
            next()//
          } else {
            next({ path: '/401', replace: true, query: { noGoBack: true }})
          }
          // 可删 ↑
        }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
      } else {
        next('/login') // 否则全部重定向到登录页
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  })
  

// router.beforeEach(async(to, from, next) => {
//     console.log('路由改变了', '')
//     NProgress.start()

//     document.title = getPageTitle(to.meta.title)

//     const hasToken = getToken()
//     // const hasToken = "916770b8467140a1306730bef52833bd"
//     if (hasToken) {
//         console.log(hasToken);
//         if (to.path === '/login') {
//             next({ path: '/' })
//             NProgress.done()
//         } else {
//             await store.dispatch('user/resetToken')
//             Message.error(error || 'Has Error')
//             next(`login?redirect=${to.path}`)
//             NProgress.done()
//         }
//     } else {
//         if (whiteList.indexOf(to.path) !== -1) {
//             next()
//         } else {
//             next(`login?redirect=${to.path}`)
//             NProgress.done()
//         }
//     }
// })

router.afterEach(() => {
    NProgress.done()
})