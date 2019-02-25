import Vue from 'vue';
import FooterNav from '@/droplets/footer-nav';
import FooterNavTpl from '@/droplets/footer-nav/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('footer-nav-page', {
  template,
  name: 'footer-nav-page',
  mixins: [cleanDropletTpl],
  components: {
    FooterNav,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(FooterNavTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $footerNav = $('.drzFooterNav-list');
$footerNav.drzFooterNav.destroy($footerNav);`;
    },
  },
});
