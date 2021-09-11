import Vue from 'vue';
import GroupItem from '@/droplets/group-item';
import GroupItemTpl from '@/droplets/group-item/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('group-item-page', {
  template,
  name: 'group-item-page',
  mixins: [cleanDropletTpl],
  components: {
    GroupItem,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(GroupItemTpl),
    };
  },
});
