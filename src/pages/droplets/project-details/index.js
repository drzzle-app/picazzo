import Vue from 'vue';
import ProjectDetails from '@/droplets/project-details';
import ProjectDetailsTpl from '@/droplets/project-details/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('project-details-page', {
  template,
  name: 'project-details-page',
  mixins: [cleanDropletTpl],
  components: {
    ProjectDetails,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProjectDetailsTpl),
    };
  },
});
