import Vue from 'vue';
import AudioPlayer from '@/droplets/audio-episodes';
import AudioPlayerTpl from '@/droplets/audio-episodes/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('audio-episodes-page', {
  template,
  name: 'audio-episodes-page',
  mixins: [cleanDropletTpl],
  components: {
    AudioPlayer,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(AudioPlayerTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `var $audio = $('.drzAudio');
$audio.drzAudioPlayer();
// some other event
$('.button').click(function() {
  $audio.drzAudioPlayer.destroy($audio);
});`;
    },
  },
});
