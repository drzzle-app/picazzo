import Vue from 'vue';
import ProjectGrid from '@/droplets/project-grid';
import ProjectGridTpl from '@/droplets/project-grid/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('project-grid-page', {
  template,
  name: 'project-grid-page',
  mixins: [cleanDropletTpl],
  components: {
    ProjectGrid,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProjectGridTpl),
    };
  },
});
