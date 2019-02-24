import Vue from 'vue';
import Accordion from '@/droplets/accordion';
import AccordionTpl from '@/droplets/accordion/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('accordion-page', {
  template,
  name: 'accordion-page',
  mixins: [cleanDropletTpl],
  components: {
    Accordion,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(AccordionTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `var $accordion = $('.drzAccordion');
$accordion.drzAccordion();
// some other event
$('.button').click(function() {
  $accordion.drzAccordion.killEvents($accordion);
});`;
    },
  },
});
