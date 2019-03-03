import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('notifications-tool', {
  template,
  name: 'notifications-tool',
  mounted() {
    const $notifications = $(this.$refs.notifications);
    $notifications.drzNotify();
  },
});
