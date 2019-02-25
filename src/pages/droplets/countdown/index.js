import Vue from 'vue';
import Countdown from '@/droplets/countdown';
import CountdownTpl from '@/droplets/countdown/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('countdown-page', {
  template,
  name: 'countdown-page',
  mixins: [cleanDropletTpl],
  components: {
    Countdown,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(CountdownTpl),
    };
  },
});
