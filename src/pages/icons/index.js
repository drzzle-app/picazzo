import Vue from 'vue';
import Icons from '@/icons/config.json';

const template = require('./template.html');

export default Vue.component('icons', {
  template,
  name: 'icons',
  computed: {
    icons() {
      let icons = this.$_.filter(Icons.glyphs, i => i.selected !== false);
      icons = icons.reverse(); // so we can see the newest first
      return this.$_.chain(icons)
        .thru((t) => {
          if (this.searchInput) {
            return this.$_.reduce(
              t,
              (acc, row) => {
                // only grab the name properties to search through
                const e = [];
                this.$_.filter(row, () => {
                  this.$_.forEach(['css', 'src'], (c) => {
                    e.push(row[c]);
                  });
                });
                if (
                  this.$_.filter(e, v =>
                    this.$_(v)
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
  data() {
    return {
      showHex: false,
      searchInput: '',
    };
  },
  methods: {
    convertToHex(code) {
      return `0${Number(code).toString(16)}`.slice(-4);
    },
  },
});
