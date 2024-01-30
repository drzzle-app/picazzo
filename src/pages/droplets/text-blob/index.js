import Vue from 'vue';
import TextBlob from '@/droplets/text-blob';
import TextBlobTpl from '@/droplets/text-blob/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('text-blob-page', {
  template,
  name: 'text-blob-page',
  mixins: [cleanDropletTpl],
  components: {
    TextBlob,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(TextBlobTpl),
    };
  },
});
