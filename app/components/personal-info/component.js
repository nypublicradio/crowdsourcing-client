import Component from '@ember/component';
import Changeset from 'ember-changeset';
import { filter, not, and } from '@ember/object/computed';
import makeSubmissionValidations from '../../validations/submission';
import lookupValidator from 'ember-changeset-validations';
import { get } from '@ember/object';

export default Component.extend({
  tagName:    'form',
  classNames: ['personal-info'],
  hasAgreed: false,
  agreementError: null,

  personalQuestions: filter('questions', q => {
    return ['first-name', 'last-name', 'email'].includes(get(q, 'shortName'));
  }),

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
      let hasAgreed = get(this, 'hasAgreed');
      if (hasAgreed) {
        this.set('agreementError', null);
      } else {
        this.set('agreementError', {message: 'please accept the Terms of Use'})
      }
    }
  }
});
