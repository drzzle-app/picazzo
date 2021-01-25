import Vue from 'vue';
import ProfileGrid from '@/droplets/profile-grid';
import ProfileGridTpl from '@/droplets/profile-grid/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('profile-grid-page', {
  template,
  name: 'profile-grid-page',
  mixins: [cleanDropletTpl],
  components: {
    ProfileGrid,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProfileGridTpl),
    };
  },
});
