import Vue from 'vue';
import BreadCrumbs from '@/tools/breadcrumbs';
import BreadCrumbsTpl from '@/tools/breadcrumbs/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('breadcrumbs-page', {
  template,
  name: 'breadcrumbs-page',
  mixins: [cleanDropletTpl],
  components: {
    BreadCrumbs,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(BreadCrumbsTpl),
    };
  },
});
