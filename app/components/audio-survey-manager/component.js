import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, get, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import config from '../../config/environment';

export default Component.extend({
  router:   service(),
  progress: service(),
  twilio:   service(),
  fastboot: service(),

  classNames: ['audio-survey-manager'],

  isFastBoot:    reads('fastboot.isFastBoot'),
  callId:        reads('progress.cache.callId'),
  audioUrl:      reads('progress.cache.url'),
  audioQuestion: reads('survey.audioQuestions.firstObject'),
  showBadState:  computed('config.goToBadState', function() {
    let allowBadState = config.goToBadState;
    if (this.get('isFastBoot')) {
      return allowBadState && this.get('fastboot.request.queryParams.bad');
    } else {
      return allowBadState && location.serach.includes('bad');
    }
  }),

  init() {
    this._super(...arguments);
    this.get('twilio').on('twilio-unrecoverable', () => this.set('openEscapeHatch', true));
  },

  didReceiveAttrs() {
    this._super(...arguments);
    let { step, callId } = this.getProperties('step', 'callId');
    if (step > 1 && !callId) {
      this.abort();
    }
  },

  next(key, value) {
    let step = parseInt(this.get('step'), 10);
    let cache = get(this, 'progress.cache');
    set(cache, key, value);
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

    set(submission, `answers.${get(audioField, 'shortName')}`, audioUrl);

    this.get('submission').save()
      .then(() => {
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
