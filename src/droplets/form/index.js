import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('form-droplet', {
  template,
  name: 'form-droplet',
  mounted() {
    const $form = $(this.$refs.form);
    $form.drzFormValidate();
  },
});
