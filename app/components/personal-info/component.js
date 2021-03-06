import Component from '@ember/component';
import Changeset from 'ember-changeset';
import { filter, not, and } from '@ember/object/computed';
import makeSubmissionValidations from '../../validations/submission';
import lookupValidator from 'ember-changeset-validations';
import { get } from '@ember/object';
import { next } from '@ember/runloop';

import { TYPES } from '../../models/question';

export default Component.extend({
  tagName:    'form',
  classNames: ['personal-info'],
  hasAgreed: false,
  agreementError: null,

  personalQuestions: filter('questions', q => get(q, 'inputType') !== TYPES.AUDIO),

  notPristine: not('changeset.isPristine'),
  isReady: and('changeset.isValid','notPristine','hasAgreed'),

  init() {
    this._super(...arguments);
    let validations = makeSubmissionValidations(this.get('personalQuestions'));
    let answers = this.get('submission.answers');
    let changeset = new Changeset(answers, lookupValidator(validations), validations, { skipValidate: true });
    this.set('changeset', changeset);
    this.set('validationErrors', {});
  },

  submit(e) {
    e.preventDefault();
    let changeset = this.get('changeset');
    let hasAgreed = this.get('hasAgreed');
    this.send('validateAgreement');
    changeset
      .validate()
      .then(() => {
        if (changeset.get('isValid') && hasAgreed) {
          changeset.execute();
          let onSubmit = this.get('onSubmit');
          if (onSubmit) {
            onSubmit();
          }
        }
      })
  },

  actions: {
    validate(name) {
      let changeset = this.get('changeset');
      changeset.validate(name).then(() => {
        this.set(`validationErrors.${name}`, changeset.get(`error.${name}`));
      });
    },
    validateAgreement() {
      // delay one tick to ensure click event (update checkbox)
      // registers before change event (validate checkbox)
      // order of events firing can vary between browsers
      next(() => {
        if (this.get("isDestroyed")) {
          return;
        }
        let hasAgreed = get(this, 'hasAgreed');
        if (hasAgreed) {
          this.set('agreementError', null);
        } else {
          this.set('agreementError', {message: 'please accept the Terms of Use'})
        }
      });
    }
  }
});
