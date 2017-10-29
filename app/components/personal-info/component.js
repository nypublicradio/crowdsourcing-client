import Component from '@ember/component';
import Changeset from 'ember-changeset';
import { filter } from '@ember/object/computed';
import makeSubmissionValidations from '../../validations/submission';
import lookupValidator from 'ember-changeset-validations';
import { get } from '@ember/object';

export default Component.extend({
  tagName:    'form',
  classNames: ['personal-info'],
  
  personalQuestions: filter('questions', q => {
    return ['first-name', 'last-name', 'email'].includes(get(q, 'shortName'));
  }),
  
  init() {
    this._super(...arguments);
    let validations = makeSubmissionValidations(this.get('personalQuestions'));
    let answers = this.get('submission.answers');
    let changeset = new Changeset(answers, lookupValidator(validations), validations);
    this.set('changeset', changeset);
  },
  
  
  submit(e) {
    e.preventDefault();
    let changeset = this.get('changeset');
    changeset
      .validate()
      .then(() => {
        if (changeset.get('isValid')) {
          changeset.execute();
          this.get('onSubmit')();
        }
      })
      .catch(() => {
        console.log('errored in validate'); // eslint-disable-line
      });
  },
});
