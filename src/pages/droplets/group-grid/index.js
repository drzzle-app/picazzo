import Vue from 'vue';
import GroupGrid from '@/droplets/group-grid';
import GroupGridTpl from '@/droplets/group-grid/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('group-grid-page', {
  template,
  name: 'group-grid-page',
  mixins: [cleanDropletTpl],
  components: {
    GroupGrid,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(GroupGridTpl),
    };
  },
});
