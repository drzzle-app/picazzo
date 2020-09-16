import Vue from 'vue';
import ProjectCard from '@/droplets/project-card';
import ProjectCardTpl from '@/droplets/project-card/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('project-card-page', {
  template,
  name: 'project-card-page',
  mixins: [cleanDropletTpl],
  components: {
    ProjectCard,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProjectCardTpl),
    };
  },
});
