import { localSet, localGet } from '@/libs/util.js'
import { isEmpty } from '@/libs/common.js'

export default {
  state: {
    loginedUser: {},
    accountInfo: {},
  },
  mutations: {
    setLoginedUser(state, user) {
      state.loginedUser = user
      localSet('loginedUser', user)
    },
    setAccountInfo(state, info) { state.accountInfo = info },
  },
  getters: {
    loginedUser(state) {
      let user = state.loginedUser
      return isEmpty(user.userName) ? localGet('loginedUser') : user
    },
  }
}