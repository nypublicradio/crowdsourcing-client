import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';
import config from '../../config/environment';

const NO_AUDIO = 'noaudio';
const NOT_READY = 'AUDIO_NOT_READY';

export default Component.extend({
  timeout:    config.audioPollTimeout,
  classNames: ['playback-screen'],

  hifi:      service(),
  isPlaying: computed('hifi.isPlaying', 'hifi.currentSound', function() {
    return this.get('hifi.currentSound.url') === this.get('playbackURL') && this.get('hifi.isPlaying');
  }),
  percentPlayed: computed('hifi.position', 'hifi.duration', {
    get() {
      return (this.get('hifi.position') / this.get('hifi.duration')) * 100;
    },
    set: (k, v) => v
  }),
  progressWidth: computed('percentPlayed', function() {
    return htmlSafe(`width: ${this.get('percentPlayed')}%;`);
  }),
  
  init() {
    this._super(...arguments);
    this.set('percentPlayed', 0);
    let callId = this.get('callId');
    this.get('initAudio').perform(callId);
  },
  
  initAudio: task(function * (callId) {
    let response = yield this.get('pollForAudio').perform(callId);
    if (response === NO_AUDIO) {
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'no audio' });
      }
      this.set('noAudio', true);
    } else {
      this.set('submitURL', response.toSubmit);
      this.set('playbackURL', response.toListen);
      yield this.get('hifi').load(response.toListen);
      return true;
    }
  }),
  pollForAudio: task(function * (callId) {
    let times = 0;
    while(true) {
      if (times >= 10) {
        return NO_AUDIO;
      }
      let response = yield this.getAudio(callId);
      if (response.toListen && response.toSubmit) {
        return response;
      } else if (response.message && response.message === NOT_READY) {
        times++;
        yield timeout(this.get('timeout'));
      }
    }
  }),
  getAudio(callId) {
    return fetch(`${config.twilioService}/status?client=${callId}`)
      .then(r => r.json());
  },
  actions: {
    playOrPause() {
      this.$('.playback-button').blur();
      if (this.get('isPlaying')) {
        this.get('hifi').pause();
      } else {
        this.get('hifi').play(this.get('playbackURL'));
      }
    }
  },
});
