import Vue from 'vue';
import Form from '@/droplets/form';
import FormTpl from '@/droplets/form/template.html';
import CheckboxInput from '@/droplets/form/inputs/checkbox';
import CheckboxTpl from '@/droplets/form/inputs/checkbox/template.html';
import DateInput from '@/droplets/form/inputs/date';
import DateTpl from '@/droplets/form/inputs/date/template.html';
import EmailInput from '@/droplets/form/inputs/email';
import EmailTpl from '@/droplets/form/inputs/email/template.html';
import NumberInput from '@/droplets/form/inputs/number';
import NumberTpl from '@/droplets/form/inputs/number/template.html';
import PhoneInput from '@/droplets/form/inputs/phone';
import PhoneTpl from '@/droplets/form/inputs/phone/template.html';
import RadioInput from '@/droplets/form/inputs/radio';
import RadioTpl from '@/droplets/form/inputs/radio/template.html';
import SearchInput from '@/droplets/form/inputs/search';
import SearchTpl from '@/droplets/form/inputs/search/template.html';
import SectionBreak from '@/droplets/form/inputs/section-break';
import SectionBreakTpl from '@/droplets/form/inputs/section-break/template.html';
import SelectInput from '@/droplets/form/inputs/select';
import SelectTpl from '@/droplets/form/inputs/select/template.html';
import TextInput from '@/droplets/form/inputs/text';
import TextTpl from '@/droplets/form/inputs/text/template.html';
import TextAreaInput from '@/droplets/form/inputs/textarea';
import TextAreaTpl from '@/droplets/form/inputs/textarea/template.html';
import WebsiteInput from '@/droplets/form/inputs/website';
import WebsiteTpl from '@/droplets/form/inputs/website/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('form-page', {
  template,
  name: 'form-page',
  mixins: [cleanDropletTpl],
  components: {
    Form,
    CheckboxInput,
    DateInput,
    EmailInput,
    NumberInput,
    PhoneInput,
    RadioInput,
    SearchInput,
    SectionBreak,
    SelectInput,
    TextInput,
    TextAreaInput,
    WebsiteInput,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(FormTpl),
      checkboxTpl: this.cleanDropletTpl(CheckboxTpl),
      dateTpl: this.cleanDropletTpl(DateTpl),
      emailTpl: this.cleanDropletTpl(EmailTpl),
      numberTpl: this.cleanDropletTpl(NumberTpl),
      phoneTpl: this.cleanDropletTpl(PhoneTpl),
      radioTpl: this.cleanDropletTpl(RadioTpl),
      searchTpl: this.cleanDropletTpl(SearchTpl),
      sectionBreakTpl: this.cleanDropletTpl(SectionBreakTpl),
      selectTpl: this.cleanDropletTpl(SelectTpl),
      textTpl: this.cleanDropletTpl(TextTpl),
      textAreaTpl: this.cleanDropletTpl(TextAreaTpl),
      websiteTpl: this.cleanDropletTpl(WebsiteTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $form = $('.drzForm');
$form.drzFormValidate.destroy($form);`;
    },
    checkboxValidate() {
      return `// for checkboxes
<div class="drzForm-fieldContainer checkbox-group">
  ... normal boxes here
</div>`;
    },
    radioValidate() {
      return `// for radio buttons
<div class="drzForm-fieldContainer radio-group">
  ... normal buttons here
</div>`;
    },
  },
});
