import Vue from 'vue';
import Section from '@/droplets/section';
import SectionTpl from '@/droplets/section/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('section-page', {
  template,
  name: 'section-page',
  mixins: [cleanDropletTpl],
  components: {
    Section,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(SectionTpl),
    };
  },
  methods: {
    overlayHTML() {
      return `<div class="section">
  <!-- overlay -->
  <div class="drzSection-overlay"></div>
  <!-- container -->
  <div class="container">
    some content
  </div>
</div>`;
    },
    videoHTML() {
      return `<div class="section" style="overflow:hidden;">
  <!-- video bg -->
  <div class="sectionVideo-container" data-videos='{
    "desktop": {
      "src": "https://s3-us-west-1.amazonaws.com/drz-assets/multi-media/love-coding.mp4",
      "type": "mp4",
      "inherit": false
    },
    "tablet": {
      "src": "https://s3-us-west-1.amazonaws.com/drz-assets/multi-media/love-coding.mp4",
      "type": "mp4",
      "inherit": true
    },
    "mobile": {
      "src": "https://s3-us-west-1.amazonaws.com/drz-assets/multi-media/love-coding.mp4",
      "type": "mp4",
      "inherit": true
    }
  }'></div>
  <!-- container -->
  <div class="container">
    some content
  </div>
</div>`;
    },
  },
  mounted() {
    $(this.$refs.drzVideo).drzSectionVideo();
  },
});
