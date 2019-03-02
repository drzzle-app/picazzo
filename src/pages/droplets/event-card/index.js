import Vue from 'vue';
import EventCard from '@/droplets/event-card';
import EventCardTpl from '@/droplets/event-card/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('event-card-page', {
  template,
  name: 'event-card-page',
  mixins: [cleanDropletTpl],
  components: {
    EventCard,
  },
  data() {
    return {
      demoCards: [EventCard, EventCard],
      dropletHtml: this.cleanDropletTpl(EventCardTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
  },
});
