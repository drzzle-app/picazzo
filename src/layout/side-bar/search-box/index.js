import Vue from 'vue';
import { mapGetters } from 'vuex';
import _ from 'lodash';

const template = require('./template.html');

export default Vue.component('search-box', {
  template,
  name: 'search-box',
  computed: {
    ...mapGetters(['pages']),
    filterPages() {
      return _.chain(this.pages)
        .thru((t) => {
          if (this.searchInput) {
            return _.reduce(
              t,
              (acc, row) => {
                if (
                  _.filter(row, v =>
                    _(v)
                      .toLower()
                      .includes(this.searchInput.toLowerCase()),
                  ).length
                ) {
                  acc.push(row);
                }
                return acc;
              },
              [],
            );
          }
          return t;
        })
        .value();
    },
  },
  watch: {
    searchInput(s) {
      if (s.trim() !== '') {
        this.showResults = true;
      } else {
        this.showResults = false;
      }
    },
  },
  data() {
    return {
      searchInput: '',
      showResults: false,
    };
  },
  methods: {
    goToPage(path) {
      this.searchInput = '';
      this.$router.push({ path });
    },
  },
});
