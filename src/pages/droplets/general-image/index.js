import Vue from 'vue';
import GeneralImage from '@/droplets/general-image';
import GeneralImageTpl from '@/droplets/general-image/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('general-image-page', {
  template,
  name: 'general-image-page',
  mixins: [cleanDropletTpl],
  components: {
    GeneralImage,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(GeneralImageTpl),
    };
  },
});
