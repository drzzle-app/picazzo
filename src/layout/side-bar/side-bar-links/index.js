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
      return {
        paddingLeft: `${this.depth}px`,
        backgroundColor: `rgba(0, 0, 0, .${this.depth - 20})`,
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
    isDropDown(link) {
      return link.children && link.children.length > 0;
    },
    toggleChildren() {
      this.showChildren = !this.showChildren;
    },
  },
});
