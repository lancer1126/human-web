import { login } from '@/api/login'

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
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
