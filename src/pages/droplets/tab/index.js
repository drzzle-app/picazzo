import Vue from 'vue';
import Tabs from '@/droplets/tabs';
import TabsTpl from '@/droplets/tabs/template.html';
import LeftTabs from '@/droplets/tabs/types/left';
import LeftTabsTpl from '@/droplets/tabs/types/left/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('tab-page', {
  template,
  name: 'tab-page',
  mixins: [cleanDropletTpl],
  components: {
    Tabs,
    LeftTabs,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(TabsTpl),
      leftHtml: this.cleanDropletTpl(LeftTabsTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $tabs = $('.drzTabs');
$tabs.drzTabs.destroy($tabs);`;
    },
  },
});
