import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  router:   service(),
  progress: service(),
  
  classNames: ['audio-survey-manager'],

  callId:   reads('progress.cache.connection.parameters.CallSid'),
  audioUrl: reads('progress.cache.url'),
  backText: computed('step', function() {
    switch(this.get('step')) {
      case '2':
      return 'Re-Record';
      case '3':
      return 'Cancel';
      default:
      return null;
    }
  }),
  
  next({ key, value }) {
    let step = parseInt(this.get('step'), 10);
    this.get('progress.cache').set(key, value);
    this.get('router').transitionTo('survey.step', step + 1);
  },
  
  back() {
    let step = parseInt(this.get('step'), 10);
    this.get('router').transitionTo('survey.step', step - 1);
  },
  
  finish() {
    let audioUrl = this.get('audioUrl');
    let audioField = this.get('survey.audioQuestions.firstObject');
    let submission = this.get('submission');

    submission.set(`answers.${audioField.get('shortName')}`, audioUrl);

    this.get('submission').save()
      .then(() => {
        this.get('router').transitionTo('survey.thank-you');
      })
  },
  
  cancel() {
    this.get('router').transitionTo('survey.cancel');
  },
});
