/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(http?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean} 
 */
export function validUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} type
 * @returns {string} 
 */
export function getTimeString(type) {
    let date = new Date()
    let yy = date.getFullYear().toString()
    let mm = (date.getMonth() + 1).toString()
    let dd = date.getDate().toString()
    let hh = date.getHours().toString()
    let nn = date.getMinutes().toString()
    let ss = date.getSeconds().toString()
    let mi = date.getMilliseconds().toString()
    let ret = yy + mm + dd + hh + nn + ss + mi
    let _mm = mm < 10 ? `0${mm}` : mm
    let _dd = mm < 10 ? `0${dd}` : dd
    let result = `${yy}${_mm}${_dd}/`
    if (type) {
        return result
    }
    return ret
}