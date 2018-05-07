import * as types from '@/store/mutation-types';
import SideBar from '@/layout/side-bar/links.json';

const state = {
  sidebarLinks: [],
};

const getters = {
  sidebarLinks(s) {
    return s.sidebarLinks;
  },
};

const mutations = {
  [types.GET_SIDE_BAR_LINKS](s) {
    s.sidebarLinks = SideBar.links;
  },
};

const actions = {
  getSideBarLinks: ({ commit, state }, payload) =>
    new Promise((resolve) => {
      commit(types.GET_SIDE_BAR_LINKS, payload);
      resolve(state.sidebarLinks);
    }),
};

export default {
  state,
  getters,
  mutations,
  actions,
};
