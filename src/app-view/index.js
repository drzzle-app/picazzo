import Vue from 'vue';
import { mapGetters } from 'vuex';

const template = require('./template.html');

export default Vue.component('app-view', {
  template,
  name: 'full-page',
  computed: {
    ...mapGetters(['currentTheme']),
    theme() {
      return `/static/css/${this.currentTheme}.min.css`;
    },
  },
  watch: {
    currentTheme(theme) {
      this.updateTheme(theme);
    },
  },
  created() {
    this.$store.dispatch('getPages');
    this.$log.info('fetch all pages for searching');
    this.updateTheme();
  },
  methods: {
    updateTheme() {
      // we prepend the theme in the head tags manually so that picazzo's
      // webpack injected styles can keep precedence
      const themeTags = document.getElementById('picazzo-theme');
      if (themeTags) {
        // swap theme
        themeTags.href = this.theme;
      } else {
        // add theme
        const head = document.head;
        const theme = document.createElement('link');
        theme.id = 'picazzo-theme';
        theme.rel = 'stylesheet';
        theme.type = 'text/css';
        theme.href = this.theme;
        head.insertBefore(theme, head.childNodes[0] || null);
      }
      return themeTags;
    },
  },
});
