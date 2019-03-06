import Vue from 'vue';
import Pagination from '@/tools/pagination';
import PaginationTpl from '@/tools/pagination/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('pagination-page', {
  template,
  name: 'pagination-page',
  mixins: [cleanDropletTpl],
  components: {
    Pagination,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(PaginationTpl),
    };
  },
});
