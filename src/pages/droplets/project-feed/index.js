import Vue from 'vue';
import ProjectFeed from '@/droplets/project-feed';
import ProjectFeedTpl from '@/droplets/project-feed/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('project-feed-page', {
  template,
  name: 'project-feed-page',
  mixins: [cleanDropletTpl],
  components: {
    ProjectFeed,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProjectFeedTpl),
    };
  },
});
