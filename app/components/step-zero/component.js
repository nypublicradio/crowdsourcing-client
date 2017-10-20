import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router:     service(),
  classNames: ['step-zero'],

  goTo(step) {
    this.get('router').transitionTo('survey.step', this.get('survey'), step);
  }
});
