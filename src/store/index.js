import Vue from 'vue';
import Vuex from 'vuex';
import Globals from '@/vuex';
import SideBar from '@/layout/side-bar/vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Globals,
    SideBar,
  },
  strict: true,
});

export default store;
