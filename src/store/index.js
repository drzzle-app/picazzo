import Vue from 'vue';
import Vuex from 'vuex';
import Globals from '@/vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Globals,
  },
  strict: true,
});

export default store;
