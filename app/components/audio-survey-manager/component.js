import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, get, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import config from '../../config/environment';

export default Component.extend({
  router:   service(),
  twilio:   service(),
  fastboot: service(),

  classNames: ['audio-survey-manager'],

  isFastBoot:    reads('fastboot.isFastBoot'),
  audioQuestion: reads('survey.audioQuestions.firstObject'),
  showBadState:  computed('config.goToBadState', function() {
    let allowBadState = config.goToBadState;
    if (this.get('isFastBoot')) {
      return allowBadState && this.get('fastboot.request.queryParams.bad');
    } else {
      return allowBadState && location.search.includes('bad');
    }
  }),

  init() {
    this._super(...arguments);
    this.get('twilio').on('twilio-unrecoverable', () => {
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'bad state' });
      }
      this.set('openEscapeHatch', true)
    });
  },

  didReceiveAttrs() {
    this._super(...arguments);
    let submission = get(this, 'submission');
    let { step } = this.getProperties('step');
    if (step > 1 && !get(submission, 'callId')) {
      this.abort();
    }
  },

  next(key, value) {
    let step = parseInt(this.get('step'), 10);
    let submission = get(this, 'submission');
    set(submission, key, value);
    this.get('router').transitionTo('survey.step', step + 1);
  },

  back() {
    let step = parseInt(this.get('step'), 10);
    this.get('router').transitionTo('survey.step', step - 1);
  },

  finish() {
    let audioField = this.get('survey.audioQuestions.firstObject');
    let submission = this.get('submission');
    let audioUrl   = get(submission, 'url');

    set(submission, `answers.${get(audioField, 'shortName')}`, audioUrl);

    this.get('submission').save()
      .then(() => {
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'crowdsourcing submit',
            'Crowdsourcing Survey ID': this.get('survey.id'),
            'Crowdsourcing Survey Title': this.get('survey.title')
          });
        }
        this.get('router').transitionTo('survey.thank-you');
      })
  },

  cancel() {
    this.get('router').transitionTo('survey.cancel');
  },

  abort() {
    this.get('router').transitionTo('survey.index');
  }
});
