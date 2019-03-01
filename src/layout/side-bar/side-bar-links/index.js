import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('sidebar-links', {
  template,
  name: 'sidebar-links',
  props: ['link', 'depth'],
  computed: {
    indent() {
      const bg = this.depth === 20 ? 0 : this.depth - 5;
      return {
        paddingLeft: `${this.depth}px`,
        backgroundColor: `rgba(0, 0, 0, .0${bg})`,
      };
    },
  },
  data() {
    return {
      showChildren: false,
      currentRoute: '',
    };
  },
  watch: {
    $route(r) {
      this.currentRoute = r.path;
    },
  },
  created() {
    this.currentRoute = this.$router.currentRoute.path;
  },
  methods: {
    goTo(path) {
      if (this.isDropDown(this.link)) {
        this.showChildren = !this.showChildren;
      } else {
        this.linkClicked();
        this.$router.push({ path });
      }
    },
    linkClicked() {
      this.$emit('link-clicked');
    },
    checkActive(link) {
      return link && link === this.$router.currentRoute.path;
    },
    isDropDown(link) {
      return link.children && link.children.length > 0;
    },
  },
});
