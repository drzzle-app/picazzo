import Vue from 'vue';
import FilterTool from '@/tools/filter';
import FilterTpl from '@/tools/filter/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('filtering', {
  template,
  name: 'filtering',
  mixins: [cleanDropletTpl],
  components: {
    FilterTool,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(FilterTpl),
    };
  },
  mounted() {
    $(this.$refs.tableSearch).sortFilter();
    $(this.$refs.sortFilter).sortFilter();
  },
  methods: {
    tableSearchHtml() {
      return `<div class="row">
  <div class="drzFilter-bar filter-controls">
      <input type="text" class="search" data-filter-search="true" placeholder="search...">
  </div>
  <table class="drzTable">
    <thead class="drzTable-head">
      <tr class="drzTable-head-row">
        <td class="drzTable-head-td">Search word: lorem</td>
        <td class="drzTable-head-td">URL</td>
        <td class="drzTable-head-td">Last Updated</td>
        <td class="drzTable-head-td">Edit</td>
        <td class="drzTable-head-td">Delete</td>
      </tr>
    </thead>
    <tbody class="drzTable-body drzFilter-container">
      <tr class="drzTable-body-row">
        <td class="drzTable-body-td">Search word: ipsum</td>
        <td class="drzTable-body-td">My Page Link</td>
        <td class="drzTable-body-td">00/00/00</td>
        <td class="drzTable-body-td">Edit</td>
        <td class="drzTable-body-td">x</td>
      </tr>
      <tr class="drzTable-body-row">
        <td class="drzTable-body-td">Search word: demin</td>
        <td class="drzTable-body-td">My Page Link</td>
        <td class="drzTable-body-td">00/00/00</td>
        <td class="drzTable-body-td">Edit</td>
        <td class="drzTable-body-td">x</td>
      </tr>
      <tr class="drzTable-body-row">
        <td class="drzTable-body-td">Search word: uber</td>
        <td class="drzTable-body-td">My Page Link</td>
        <td class="drzTable-body-td">00/00/00</td>
        <td class="drzTable-body-td">Edit</td>
        <td class="drzTable-body-td">x</td>
      </tr>
    </tbody>
  </table>
</div>`;
    },
    sortFilterHtml() {
      return `<div class="row">
  <div class="drzFilter-bar filter-controls">
    <a class="drzBtn-link">
      <button class="drzBtn" data-filter-sort="oldest">Oldest</button>
    </a>
    <a class="drzBtn-link">
      <button class="drzBtn" data-filter-sort="newest">Newest</button>
    </a>
    <a class="drzBtn-link">
      <button class="drzBtn" data-filter-category="green">Green</button>
    </a>
    <a class="drzBtn-link">
      <button class="drzBtn" data-filter-category="black">Black</button>
    </a>
    <a class="drzBtn-link">
      <button class="drzBtn" data-filter-category="blue">Blue</button>
    </a>
    <a class="drzBtn-link">
      <button class="drzBtn" data-filter-reset="true">Reset</button>
    </a>
  </div>
  <div class="drzFilter-container">
    <div data-filter-sort="12/30/2007" data-filter-category="black">12/30/2007</div>
    <div data-filter-sort="01/13/2008" data-filter-category="green">01/13/2008</div>
    <div data-filter-sort="6/01/2004" data-filter-category="blue">6/01/2004</div>
    <div data-filter-sort="6/02/2004" data-filter-category="blue">6/02/2004</div>
    <div data-filter-sort="5/12/2012" data-filter-category="black">5/12/2012</div>
    <div data-filter-sort="3/12/2015" data-filter-category="green">3/12/2015</div>
  </div>
</div>`;
    },
  },
});
