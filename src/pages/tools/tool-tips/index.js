import Vue from 'vue';
import ToolTips from '@/tools/tool-tips';
import ToolTipsTpl from '@/tools/tool-tips/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('tool-tips', {
  template,
  name: 'tool-tips',
  mixins: [cleanDropletTpl],
  components: {
    ToolTips,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ToolTipsTpl),
    };
  },
  mounted() {
    $(this.$refs.bottom).drzTooltip();
    $(this.$refs.left).drzTooltip();
    $(this.$refs.right).drzTooltip();
  },
});
