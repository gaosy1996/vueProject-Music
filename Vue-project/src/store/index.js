import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);

const state = {
    userName: ''
}

const mutations = {
    getUserName(state, msg) {
        state.userName = msg
    }
}

const actions = {

}

export default new Vuex.Store({
    state,
    mutations,
    actions
})