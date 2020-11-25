import md5 from 'js-md5';
import {
    Loading,
    Message
} from 'element-ui'
import {
    requestApi
} from '@/api/index'
import { getTimeString } from '@/utils/validate'
/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
        '"}'
    )
}

export const initConfig = async() => {
    var OSS = require('ali-oss')
    return new Promise((resolve, reject) => {
        requestApi('/v1/oss/account').then(
            res => {
                console.log(res.data.resultData.securityToken);
                resolve(new OSS({
                    accessKeyId: res.data.resultData.accesskeyId,
                    accessKeySecret: res.data.resultData.accesskeySecret,
                    stsToken: res.data.resultData.securityToken,
                    region: 'oss-cn-shenzhen',
                    bucket: 'mobile-power'
                }))
            }
        )
    })
}

export const uploadFile = async(client, file, uploadUrl) => {
    let loadingInstance = Loading.service({
        text: '上传中...'
    })
    try {
        const fileNameE = file.file.name
        const fileNameArr = fileNameE != '' ? fileNameE.split('.') : []
        const fileName = fileNameArr.length > 1 ? md5(fileNameArr[0]) + '.' + fileNameArr[1] : getTimeString() + '.' + file.file.type.split('/')[1]
        const storeAs = uploadUrl + new Date().getTime() + fileName
        let result = await client.put(storeAs, file.file)
        loadingInstance.close()
        Message({
            type: 'success',
            message: '上传成功'
        })
        return result
    } catch (e) {
        console.error(e)
        Message({
            type: 'error',
            message: '上传失败'
        })
        loadingInstance.close()
        return undefined
    }

}