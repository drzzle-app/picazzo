import Vue from 'vue';
import ContentSlider from '@/droplets/content-slider';
import ContentSliderTpl from '@/droplets/content-slider/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('content-slider-page', {
  template,
  name: 'content-slider-page',
  mixins: [cleanDropletTpl],
  components: {
    ContentSlider,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ContentSliderTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $contentSlider = $('.drzContentSlider');
$contentSlider.drzContentSlider.destroy($contentSlider);`;
    },
  },
});
