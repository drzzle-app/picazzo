import Vue from 'vue';
import ListMenu from '@/droplets/list-menu';
import ListMenuTpl from '@/droplets/list-menu/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('list-menu-page', {
  template,
  name: 'list-menu-page',
  mixins: [cleanDropletTpl],
  components: {
    ListMenu,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ListMenuTpl),
    };
  },
});
