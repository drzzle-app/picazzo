import Vue from 'vue';
import SocialMedia from '@/droplets/social-media';
import SocialMediaTpl from '@/droplets/social-media/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('social-media-page', {
  template,
  name: 'social-media-page',
  mixins: [cleanDropletTpl],
  components: {
    SocialMedia,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(SocialMediaTpl),
    };
  },
});
