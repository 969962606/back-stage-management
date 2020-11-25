import {
    login,
    logout,
    getInfo
} from '@/api/user'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import router, {
    resetRouter
} from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}

const actions = {
    login({ commit }, params) {
        console.log(params, '登录接口')
        return new Promise((resolve, reject) => {
            login(params).then(
                res => {
                    console.log('登录了', res)
                    const data = res.data.resultData
                    commit('SET_TOKEN', data.accessToken)
                    setToken(data.accessToken)
                    resolve()
                }
            ).catch(error => {
                reject()
            })
        })
    },

    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}