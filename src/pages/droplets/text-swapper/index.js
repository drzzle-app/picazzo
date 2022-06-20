import Vue from 'vue';
import TextSwapper from '@/droplets/text-swapper';
import TextSwapperTpl from '@/droplets/text-swapper/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('text-swapper-page', {
  template,
  name: 'text-swapper-page',
  mixins: [cleanDropletTpl],
  components: {
    TextSwapper,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(TextSwapperTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $textSwapper = $('.drzText-swapper');
$textSwapper.drzTextSwapper.destroy($textSwapper, () => {
// optional function
});`;
    },
  },
});
