import Vue from 'vue';
import AudioPlayer from '@/droplets/audio-player';
import AudioPlayerTpl from '@/droplets/audio-player/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('audio-player-page', {
  template,
  name: 'audio-player-page',
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
