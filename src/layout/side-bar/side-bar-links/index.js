import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('sidebar-links', {
  template,
  name: 'sidebar-links',
  props: ['link', 'depth'],
  data() {
    return {
      showChildren: false,
    };
  },
  computed: {
    indent() {
      const bg = this.depth === 20 ? 0 : this.depth - 5;
      return {
        paddingLeft: `${this.depth}px`,
        backgroundColor: `rgba(0, 0, 0, .0${bg})`,
      };
    },
  },
  methods: {
    goTo(path) {
      if (this.isDropDown(this.link)) {
        this.showChildren = !this.showChildren;
      } else {
        this.$router.push({ path });
      }
    },
    checkActive(link) {
      return link && link === this.$router.currentRoute.path;
    },
    isDropDown(link) {
      return link.children && link.children.length > 0;
    },
  },
});
