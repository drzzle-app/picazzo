import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('scrolling-page', {
  template,
  name: 'scrolling-page',
  mounted() {
    setTimeout(() => {
      $(this.$refs.anchorScroll).drzAnchorScroll();
      $(this.$refs.backToTop).drzTopScroll();
    }, 1000);
  },
  methods: {
    sectionScrollHtml() {
      return `<div class="drzNav drzNav-links-left drzAnchor-scroll">
  <ul class="drzNav-list">
    <li class="drzNav-item">
      <a href="#section-one" class="drzNav-link">Section One</a>
    </li>
    <li class="drzNav-item">
      <a href="#section-two" class="drzNav-link">Section Two</a>
    </li>
    <li class="drzNav-item">
      <a href="#section-three" class="drzNav-link">Section Three</a>
    </li>
  </ul>
</div>

<div class="section" data-anchor-scroll="section-one"></div>
<div class="section" data-anchor-scroll="section-two"></div>
<div class="section" data-anchor-scroll="section-three"></div>`;
    },
    backToTopHtml() {
      return '<a href="#" class="drzTopScroll-button"></a>';
    },
  },
});
