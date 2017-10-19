import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  goTo(step) {
    this.get('router').transitionTo('survey.step', this.get('survey'), step);
  }
});
