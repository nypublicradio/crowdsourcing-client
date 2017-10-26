import Component from '@ember/component';
// import Changeset from 'ember-changeset';
// import { filter } from '@ember/object/computed';

export default Component.extend({
  tagName:    'form',
  classNames: ['personal-info'],
  // 
  // init() {
  //   this._super(...arguments);
  //   let changeset = new Changeset(this.get('submission.answers'), this.get('validate'));
  //   this.set('changeset', changeset);
  // },
  
  
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
