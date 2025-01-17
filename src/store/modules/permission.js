import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

router.beforeEnter(async(to, from, next) => {
    NProgress.start()
    document.title = getPageTitle(to.meta.title)

    const hasToken = getToken()

    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            next()
        }
    } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
    }
})

router.afterEach(() => {
    NProgress.done()
})