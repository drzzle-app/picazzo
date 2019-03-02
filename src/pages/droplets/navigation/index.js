import Vue from 'vue';
import Navigation from '@/droplets/navigation';
import NavigationTpl from '@/droplets/navigation/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('navigation-page', {
  template,
  name: 'navigation-page',
  mixins: [cleanDropletTpl],
  components: {
    Navigation,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(NavigationTpl),
    };
  },
  mounted() {
    $(this.$refs.centerNav).drzNav();
    $(this.$refs.leftNav).drzNav();
    $(this.$refs.rightNav).drzNav();
  },
  methods: {
    destroyMarkup() {
      return `const $nav = $('.drzNav');
$nav.drzNav.destroy($nav);`;
    },
  },
});
