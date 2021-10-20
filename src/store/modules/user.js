import { login, getInfo, logout } from '@/api/login'

const user = {
  state: {
    token: '',
    user: {},
    roles: {},
    loadMenus: false
  },

  actions: {
    Login({ commit }, userInfo) {
      // const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid)
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          innerLogOut(commit)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    updateLoadMenus({ commit }) {
      return new Promise(() => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const setUserInfo = (res, commit) => {
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res.user)
}

export const innerLogOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
}

export default user
