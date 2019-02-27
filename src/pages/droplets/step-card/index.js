import Vue from 'vue';
import StepCard from '@/droplets/step-card';
import StepCardTpl from '@/droplets/step-card/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('step-card-page', {
  template,
  name: 'step-card-page',
  mixins: [cleanDropletTpl],
  components: {
    StepCard,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(StepCardTpl),
    };
  },
});
