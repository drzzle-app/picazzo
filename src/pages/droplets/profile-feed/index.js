import Vue from 'vue';
import ProfileFeed from '@/droplets/profile-feed';
import ProfileFeedTpl from '@/droplets/profile-feed/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('profile-feed-page', {
  template,
  name: 'profile-feed-page',
  mixins: [cleanDropletTpl],
  components: {
    ProfileFeed,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProfileFeedTpl),
    };
  },
});
