import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import getters  from './getters'

import user from './modules/user'
import lottery from './modules/lottery'
import site from './modules/site'

Vue.use(Vuex)

const index = new Vuex.Store({
  modules: {
    user,
    site,
    lottery
  },
  getters,
  plugins: [createPersistedState({ storage: window.sessionStorage })]
})

export default index
