import Vue from 'vue';
import GeneralCard from '@/droplets/general-card';
import GeneralCardTpl from '@/droplets/general-card/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('general-card-page', {
  template,
  name: 'general-card-page',
  mixins: [cleanDropletTpl],
  components: {
    GeneralCard,
  },
  data() {
    return {
      demoCards: [GeneralCard, GeneralCard],
      dropletHtml: this.cleanDropletTpl(GeneralCardTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
  },
});
