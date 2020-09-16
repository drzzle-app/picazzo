import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('project-card-droplet', {
  template,
  name: 'project-card-droplet',
  mounted() {
    const $projectCards = $(this.$refs.projectCards);
    $projectCards.drzLoadMore({
      visible: 2,
      assets: 'bg',
      classes: {
        show: 'drzProject-card-show',
        img: 'drzProject-card-image',
        footer: 'drzProject-cards-footer',
        footerHidden: 'drzProject-cards-footerHidden',
        item: 'drzProject-card',
        loadMore: 'drzProject-cards-more',
      },
    });
  },
});
