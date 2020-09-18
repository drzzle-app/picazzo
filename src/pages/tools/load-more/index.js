import Vue from 'vue';
import LoadMore from '@/tools/load-more';
import LoadMoreTpl from '@/tools/load-more/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('load-more-page', {
  template,
  name: 'load-more-page',
  mixins: [cleanDropletTpl],
  components: {
    LoadMore,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(LoadMoreTpl),
    };
  },
});
