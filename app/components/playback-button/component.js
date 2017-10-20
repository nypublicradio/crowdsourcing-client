import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';
import config from '../../config/environment';

const NO_AUDIO = 'noaudio';
const NOT_READY = 'AUDIO_NOT_READY';

export default Component.extend({
  tagName:   '',
  timeout:   config.audioPollTimeout,

  hifi:      service(),
  isPlaying: computed('hifi.isPlaying', 'hifi.currentSound', function() {
    return this.get('hifi.currentSound.url') === this.get('url') && this.get('hifi.isPlaying');
  }),
  
  init() {
    this._super(...arguments);
    let callId = this.get('callId');
    this.get('initAudio').perform(callId);
  },
  
  initAudio: task(function * (callSid) {
    let url = yield this.get('pollForAudio').perform(callSid);
    if (url === NO_AUDIO) {
      this.set('noAudio', true);
    } else {
      this.set('url', url);
      this.get('hifi').load(url).then(({sound}) => {
        this.set('sound', sound);
      });
    }
  }),
  pollForAudio: task(function * (callSid) {
    let times = 0;
    while(true) {
      if (times >= 10) {
        return NO_AUDIO;
      }
      let response = yield this.getAudio(callSid);
      if (response.path) {
        return response.path;
      } else if (response.message && response.message === NOT_READY) {
        times++;
        yield timeout(this.get('timeout'));
      }
    }
  }),
  getAudio(callSid) {
    return fetch(`${config.twilioService}/status?client=${callSid}`)
      .then(r => r.json())
  },
  actions: {
    playOrPause() {
      if (this.get('isPlaying')) {
        this.get('hifi').pause();
      } else {
        this.get('hifi').play(this.get('url'));
      }
    }
  },
});
