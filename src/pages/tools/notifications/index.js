import Vue from 'vue';
import Notifications from '@/tools/notifications';
import NotificationsTpl from '@/tools/notifications/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('notifications-page', {
  template,
  name: 'notifications-page',
  mixins: [cleanDropletTpl],
  components: {
    Notifications,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(NotificationsTpl),
    };
  },
  mounted() {
    $(this.$refs.danger).drzNotify();
    $(this.$refs.warning).drzNotify();
  },
  methods: {
    dangerHtml() {
      return `<div class="drzNotification drzNotification-danger">
  <a href="#" class="drzNotification-close"></a>
  <div class="drzNotification-content">
    This is a danger message.
  </div>
</div>`;
    },
    warningHtml() {
      return `<div class="drzNotification drzNotification-warning">
  <a href="#" class="drzNotification-close"></a>
  <div class="drzNotification-content">
    This is a warning message.
  </div>
</div>`;
    },
  },
});
