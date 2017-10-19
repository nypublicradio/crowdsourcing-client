import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  which: computed('step', function() {
    switch(this.get('step')) {
    case '1':
      return 'audio-recorder';
    case '2':
      return 'recording-playback';
    case '3':
      return 'personal-info';
    }
  }),
  next() {
    let step = this.incrementProperty('step');
    this.get('router').transitionTo('survey.step', this.get('survey'), step);
  }
});
