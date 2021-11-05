import { API } from "@/api"
import { getToken, setToken, removeToken, pswdEncode } from "@/utils/auth"

const state = {
  token: getToken(),
  balance: 0,
  // 用户信息
  userDetail: {},
  userFrozen: 0,
  showInitMessage: false,
  allBalance: null //所有平台得余额
}

const mutations = {
  SET_ALL_BALANCE: (state, data) => {
    state.allBalance = data
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_DETAIL(state, data) {
    state.userDetail = data
  },
  SET_BALANCE(state, data) {
    state.balance = data
  },
  SET_USER_FRONZEN(state, data) {
    state.userFrozen = data
  },
  SET_INDEX_MESSAGE(state, data) {
    state.showInitMessage = data
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    let { username, password } = userInfo
    return new Promise((resolve, reject) => {
      API.login(username.trim(), pswdEncode(password))
        .then(response => {
          const { data, success } = response
          if (success) {
            setToken(data.access_token, data.expires_at)
            commit("SET_TOKEN", data.access_token)
            dispatch("getAllBalance")
            resolve()
          } else {
            reject()
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 获取用户信息
  getUserDetail({ commit }) {
    return new Promise((resolve, reject) => {
      API.getUserDetail()
        .then(res => {
          const { success, data } = res
          if (success) {
            resolve(res)
            commit("SET_USER_DETAIL", data)
            commit("SET_BALANCE", data.balance)
            commit("SET_USER_FRONZEN", data.user_fronzen_type)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  logOut({ commit }) {
    return new Promise((resolve, reject) => {
      API.logout()
        .then(res => {
          const { success } = res
          resolve(success)
          if (success) {
            commit("SET_TOKEN", "")
            commit("SET_USER_DETAIL", {})
            removeToken()
            window.sessionStorage.clear()
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getAllBalance({ commit }) {
    return new Promise((resolve, reject) => {
      API.getAllBalance()
        .then(res => {
          const { success, data } = res
          if (success) {
            const list = []
            for (const key in data) {
              if (data[key]) {
                const { success } = data[key]
                if (success) {
                  list.push({
                    name: key,
                    balance: data[key]['data']['balance']
                  })
                }
              }
            }
            commit("SET_ALL_BALANCE", list)
            resolve(res)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
