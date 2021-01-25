import Vue from 'vue';
import ProfileDetails from '@/droplets/profile-details';
import ProfileDetailsTpl from '@/droplets/profile-details/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('profile-details-page', {
  template,
  name: 'profile-details-page',
  mixins: [cleanDropletTpl],
  components: {
    ProfileDetails,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProfileDetailsTpl),
    };
  },
});
