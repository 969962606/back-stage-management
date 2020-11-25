import axios from 'axios'
import {
    MessageBox,
    Message
} from 'element-ui'
import store from '@/store'
import {
    getToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: process.env.BASE_URL, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
        config => {
            // do something before request is sent
            let token = localStorage.getItem("resultData") && JSON.parse(localStorage.getItem("resultData")).accessToken
            if (token) {
                // let each request carry token
                // ['X-Token'] is a custom headers key
                // please modify it according to the actual situation
                // config.headers['accessToken'] = token
                    config.headers['accessToken'] = '53439c96cfe8cea7c68630820a84e78f'
            }
            // config.headers['accessToken'] = '123'

            return config
        },
        error => {
            // do something with request error
            console.log(error) // for debug
            return Promise.reject(error)
        }
    )
    // 每一个请求都需要带token来验证权限，在请求前拦截，赋值token，
    // 响应前拦截，如果响应的code不等于20000，则提示错误信息，如果是不合法的token，则提示
    // 用户登出或者留在当前页面，或者去到登录页面进行重新登录。

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        if (response.data.resultStatus) {
            return response;
        } else if (response.data.errorCode === '000631' || response.data.errorCode === '000630') {
            Message({
                message: response.data.errorMessage,
                type: 'error',
                duration: 2 * 1000
            })
            localStorage.removeItem('resultData')
            localStorage.removeItem('allPermissions')
            window.location.href = "/#/login";
        } else {
            Message({
                message: response.data.errorMessage,
                type: 'error',
                duration: 2 * 1000
            })
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service  