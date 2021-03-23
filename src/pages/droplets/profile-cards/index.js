import Vue from 'vue';
import ProfileCards from '@/droplets/profile-cards';
import ProfileCardsTpl from '@/droplets/profile-cards/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('profile-cards-page', {
  template,
  name: 'profile-cards-page',
  mixins: [cleanDropletTpl],
  components: {
    ProfileCards,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProfileCardsTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
  },
});
