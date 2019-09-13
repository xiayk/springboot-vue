import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {
            username: window.localStorage.getItem('XWEB_TOKEN' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('XWEB_TOKEN' || '[]'))
        }
    },
    mutations: {
        login(state, user) {
            state.user = user
            window.localStorage.setItem('XWEB_TOKEN', JSON.stringify(user))
        }
    }
})