import Vue from 'vue';
import Vuex from 'vuex';
import SideBar from '@/layout/side-bar/vuex';
import AppView from '@/app-view/vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    SideBar,
    AppView,
  },
  strict: true,
});

export default store;
