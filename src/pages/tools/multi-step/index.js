import Vue from 'vue';
import MultiStep from '@/tools/multi-step';
import MultiStepTpl from '@/tools/multi-step/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('multi-step-page', {
  template,
  name: 'multi-step-page',
  mixins: [cleanDropletTpl],
  components: {
    MultiStep,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(MultiStepTpl),
    };
  },
  mounted() {
    $(this.$refs.formMS).drzMultiStep();
  },
  methods: {
    formHtml() {
      return `<form class="full-width drzForm">
  <div class="drzMultiStep-progress"></div>
  <div class="drzMultiStep">
    <div class="drzMultiStep-step" data-step-label="Step 1">
      <div class="drzForm-fieldContainer">
        <label class="drzForm-fieldLabel">Step 1 input</label>
        <input class="drzForm-inputText" type="text">
      </div>
      <div class="drzMultiStep-btnRow"></div>
    </div>
    <div class="drzMultiStep-step" data-step-label="Step 2">
      <div class="drzForm-fieldContainer">
        <label class="drzForm-fieldLabel">Step 2 input</label>
        <input class="drzForm-inputText" type="text">
      </div>
      <div class="drzMultiStep-btnRow"></div>
    </div>
    <div class="drzMultiStep-step" data-step-label="Step 3">
      <div class="drzForm-fieldContainer">
        <label class="drzForm-fieldLabel">Step 3 input</label>
        <input class="drzForm-inputText" type="text">
      </div>
      <div class="drzMultiStep-btnRow"></div>
    </div>
    <div class="drzMultiStep-step" data-step-label="Step 4">
      <div class="drzForm-fieldContainer">
        <label class="drzForm-fieldLabel">Step 4 input</label>
        <input class="drzForm-inputText" type="text">
      </div>
    <div class="drzMultiStep-btnRow"><button class="drzBtn">Submit</button></div>
    </div>
  </div>
</form>`;
    },
  },
});
