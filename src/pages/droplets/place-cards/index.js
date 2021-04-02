import Vue from 'vue';
import PlaceCards from '@/droplets/place-cards';
import PlaceCardsTpl from '@/droplets/place-cards/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('place-cards-page', {
  template,
  name: 'place-cards-page',
  mixins: [cleanDropletTpl],
  components: {
    PlaceCards,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(PlaceCardsTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
  },
});
