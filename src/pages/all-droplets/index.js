import Vue from 'vue';
import _ from 'lodash';
import dropletList from './all-droplets';

const template = require('./template.html');

export default Vue.component('all-droplets', {
  template,
  name: 'all-droplets',
  data() {
    return {
      droplets: [],
    };
  },
  created() {
    this.getDroplets();
  },
  methods: {
    getDroplets() {
      this.droplets = Object.keys(dropletList).sort();
    },
    formatTitle(title) {
      return _.startCase(title);
    },
    determineDroplet(name) {
      return dropletList[name] ? dropletList[name].default : '';
    },
  },
});
