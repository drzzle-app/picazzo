import * as types from '@/store/mutation-types';

const state = {
  currentTheme: 'ecomm',
};

const getters = {
  currentTheme(s) {
    return s.currentTheme;
  },
};

const mutations = {
  [types.SET_THEME](s, p) {
    s.currentTheme = p;
  },
};

const actions = {
  setTheme: ({ commit }, payload) => {
    commit(types.SET_THEME, payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
