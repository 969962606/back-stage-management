import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/v1/platform/code2session',
        method: 'post',
        data: data
    })
}