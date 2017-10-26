import Component from '@ember/component';
import Changeset from 'ember-changeset';
import { filter } from '@ember/object/computed';
import makeSubmissionValidations from '../../validations/submission';
import lookupValidator from 'ember-changeset-validations';

export default Component.extend({
  tagName:    'form',
  classNames: ['personal-info'],
  
  personalQuestions: filter('questions', q => {
    return ['first-name', 'last-name', 'email'].includes(q.get('shortName'));
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
    this.get('changeset').save()
      .then(() => {
        if (this.get('onSubmit')) {
          this.get('onSubmit')(this);
        }
      });
  },
});
