import Vue from 'vue';
import Table from '@/patterns/table';
import TableTpl from '@/patterns/table/template.html';
import PatternControls from '@/layout/components/pattern-controls';

const template = require('./template.html');

export default Vue.component('tables', {
  template,
  name: 'tables',
  components: {
    Table,
    PatternControls,
  },
  data() {
    return {
      controls: {
        name: 'Table',
      },
      code: this.clean(TableTpl),
      jsCode: this.pluginJs(),
    };
  },
  methods: {
    clean(str) {
      // here we can strip out vue things for our code docs
      return str.replace(/ ref="(.*)"/g, '');
    },
    pluginJs() {
      // running snippets like this for highlightjs output
      // needs to be moved to the beginning of the file or
      // else there will be funky whitespaces
      return `
$.fn.flux.responsiveTable({
  el: $('.productTable')
});`.trim();
    },
  },
});
