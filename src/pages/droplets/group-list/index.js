import Vue from 'vue';
import GroupList from '@/droplets/group-list';
import GroupListTpl from '@/droplets/group-list/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('group-list-page', {
  template,
  name: 'group-list-page',
  mixins: [cleanDropletTpl],
  components: {
    GroupList,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(GroupListTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $groupList = $('.groupList-list');
$groupList.drzLoadMore.destroy();`;
    },
  },
});
