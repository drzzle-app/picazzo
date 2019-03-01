import Vue from 'vue';
import Modal from '@/tools/modals';
import ModalTpl from '@/tools/modals/template.html';
import AnnModal from '@/tools/modals/types/announcement';
import AnnModalTpl from '@/tools/modals/types/announcement/template.html';
import ConfModal from '@/tools/modals/types/confirm';
import ConfModalTpl from '@/tools/modals/types/confirm/template.html';
import SearModal from '@/tools/modals/types/search';
import SearModalTpl from '@/tools/modals/types/search/template.html';
import WideModal from '@/tools/modals/types/wide';
import WideModalTpl from '@/tools/modals/types/wide/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('modals-page', {
  template,
  name: 'modals-page',
  mixins: [cleanDropletTpl],
  components: {
    Modal,
    AnnModal,
    ConfModal,
    SearModal,
    WideModal,
  },
  data() {
    return {
      defaultHtml: this.cleanDropletTpl(ModalTpl),
      announcementHtml: this.cleanDropletTpl(AnnModalTpl),
      confirmHtml: this.cleanDropletTpl(ConfModalTpl),
      searchHtml: this.cleanDropletTpl(SearModalTpl),
      wideHtml: this.cleanDropletTpl(WideModalTpl),
    };
  },
});
