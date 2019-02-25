import Vue from 'vue';
import Carousel from '@/droplets/carousel';
import CarouselTpl from '@/droplets/carousel/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('carousel-page', {
  template,
  name: 'carousel-page',
  mixins: [cleanDropletTpl],
  components: {
    Carousel,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(CarouselTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $carousel = $('.drzCarousel-container');
$carousel.drzCarousel.destroy($carousel);`;
    },
  },
});
