import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  hifi: service(),
  tagName: '',
  isPlaying: computed('hifi.isPlaying', 'hifi.currentSound', function() {
    return this.get('hifi.currentSound.url') === this.get('url') && this.get('hifi.isPlaying');
  }),
  
  init() {
    this._super(...arguments);
    let url = this.get('url');
    this.get('hifi').load(url).then(({sound}) => {
      this.set('sound', sound);
    });
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
