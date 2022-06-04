import Vue from 'vue';
import ProgressBar from '@/droplets/progress-bar';
import ProgressBarTpl from '@/droplets/progress-bar/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('progress-bar-page', {
  template,
  name: 'progress-bar-page',
  mixins: [cleanDropletTpl],
  components: {
    ProgressBar,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProgressBarTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $progressBar = $('.drzProgressBar');
$progressBar.drzProgressBar.destroy($progressBar, () => {
// optional function
});`;
    },
  },
});
