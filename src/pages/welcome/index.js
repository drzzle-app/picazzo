import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('welcome-page', {
  template,
  name: 'welcome-page',
  methods: {
    optionOneHtml() {
      return `<html>
  <!-- default theme css -->
  <link rel="stylesheet" href="https://cdn.drzzle.app/themes/default.min.css">
  <!-- all droplets including dependencies (jQuery) -->
  <script src="https://cdn.drzzle.app/scripts/js/picazzo.bundle.min.js" charset="utf-8" defer></script>
</html>`;
    },
    optionTwoHtml() {
      return `<head>
  <!-- default theme css -->
  <link rel="stylesheet" href="https://cdn.drzzle.app/themes/default.min.css">
  <!-- add jQuery dependencies -->
  <script src="https://cdn.drzzle.app/scripts/js/modules/jquery-2.2.4.min.js" charset="utf-8" defer></script>
  <script src="https://cdn.drzzle.app/scripts/js/modules/jquery.mobile.custom.min.js" charset="utf-8" defer></script>
  <!-- include Picazzo globals -->
  <script src="https://cdn.drzzle.app/scripts/js/globals/picazzo.globals.min.js" charset="utf-8" defer></script>
  <!-- use droplets as needed -->
  <script src="https://cdn.drzzle.app/scripts/js/droplets/accordion.min.js" charset="utf-8" defer></script>
  <script src="https://cdn.drzzle.app/scripts/js/droplets/table.min.js" charset="utf-8" defer></script>
</head>`;
    },
    googleMapHtml() {
      return `
<script defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" type="text/javascript"></script>

`;
    },
  },
});
