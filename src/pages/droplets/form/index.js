import Vue from 'vue';
import Form from '@/droplets/form';
import FormTpl from '@/droplets/form/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('form-page', {
  template,
  name: 'form-page',
  mixins: [cleanDropletTpl],
  components: {
    Form,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(FormTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $form = $('.drzForm');
$form.drzFormValidate.destroy($form);`;
    },
  },
});
