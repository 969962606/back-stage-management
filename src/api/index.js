import request from '@/utils/request'
import axios from 'axios'
import qs from 'qs'
import {
  Message,
  MessageBox,
  Loading
} from 'element-ui'

function requestApi(url, method = 'get', data = {}, header = null) {
  return new Promise(function (resolve, reject) {
    request({
      url: url,
      method: method,
      data: header && header == 'json' ? data : data && qs.stringify(data),
      headers: {
        'Content-Type': header && header == 'json' ? 'application/json' : 'application/x-www-form-urlencoded'
      }
    }).then((res) => {
      // console.log(header);
      console.log(data);
      console.log(url);
      console.log(res, '请求返回')
      if (res.data.resultStatus === true) {
        resolve(res);
      } else {
        console.log( res.data.errorMessage);
        Message({
          message: res.data.errorMessage,
          type: 'warning',
          duration: 2000
        })
      }
    },
      (err) => {
        reject(err)
      })
  })
}

// function requestBatch(url, method = 'get', data = {}, header = null) {
//     return new Promise(function(resolve, reject) {
//         axios({
//             url: url,
//             method: method,
//             withCredentials: true,
//             data: header && header == 'json' ? data : data && qs.stringify(data),
//             headers: {
//                 'Content-Type': header && header == 'json' ? 'application/json' : 'application/x-www-form-urlencoded'
//             }
//         }).then((res) => {
//                 if (res.data.resultStatus === true) {
//                     resolve(res);
//                 } else {
//                     Message({
//                         message: res.data.errorMessage,
//                         type: 'warning',
//                         duration: 2000
//                     })
//                 }
//             },
//             (err) => {
//                 reject(err)
//             })
//     })
// }

export {
  requestApi
}