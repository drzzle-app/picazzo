import Vue from 'vue';
import WideCard from '@/droplets/wide-card';
import WideCardTpl from '@/droplets/wide-card/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('wide-card-page', {
  template,
  name: 'wide-card-page',
  mixins: [cleanDropletTpl],
  components: {
    WideCard,
  },
  data() {
    return {
      demoCards: [WideCard, WideCard],
      dropletHtml: this.cleanDropletTpl(WideCardTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
  },
});
