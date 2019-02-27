/* global describe it beforeEach */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueLogger from 'vuejs-logger';
import { expect } from 'chai';
import storeData from './vuex';
import local from './';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
localVue.use(VueLogger);
const router = new VueRouter();

describe('App View', () => {
  let store;
  beforeEach(() => {
    store = new Vuex.Store(storeData);
  });

  it('should create a style link node with default theme', () => {
    const wrapper = shallowMount(local, {
      localVue,
      router,
      store,
    });
    const node = wrapper.vm.updateTheme();
    expect(node.id).to.equal('picazzo-theme');
    expect(node.rel).to.equal('stylesheet');
    expect(node.type).to.equal('text/css');
    expect(node.href).to.be.a('string');
  });

  it('should load default theme', () => {
    const wrapper = shallowMount(local, {
      localVue,
      router,
      store,
    });
    expect(wrapper.vm.currentTheme).to.equal('default');
  });
});
