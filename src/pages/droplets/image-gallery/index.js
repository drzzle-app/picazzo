import Vue from 'vue';
import ImageGallery from '@/droplets/image-gallery';
import ImageGalleryTpl from '@/droplets/image-gallery/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('image-gallery-page', {
  template,
  name: 'image-gallery-page',
  mixins: [cleanDropletTpl],
  components: {
    ImageGallery,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ImageGalleryTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $imageGallery = $('.drzImageGallery');
$imageGallery.drzImageGallery.destroy($imageGallery);`;
    },
  },
});
