import * as types from '@/store/mutation-types';
import Data from '@/pages.json';

const state = {
  currentTheme: 'ecomm',
  pages: [],
};

const getters = {
  currentTheme(s) {
    return s.currentTheme;
  },
  pages(s) {
    return s.pages;
  },
};

const mutations = {
  [types.SET_THEME](s, p) {
    s.currentTheme = p;
  },
  [types.GET_PAGES](s) {
    s.pages = Data.pages;
  },
};

const actions = {
  setTheme: ({ commit }, payload) => {
    commit(types.SET_THEME, payload);
  },
  getPages: ({ commit }, payload) => {
    commit(types.GET_PAGES, payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
