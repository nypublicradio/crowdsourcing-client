import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  progress: service(),
  router:   service(),
  
  classNames: ['audio-survey-manager'],
  
  next({ key, value }) {
    let step = parseInt(this.get('step'), 10);
    this.get('progress.cache').set(key, value);
    this.get('router').transitionTo('survey.step', step + 1);
  },
  
  finish() {
    this.get('router').transitionTo('survey.thank-you');
  }
});
