import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  redirect(model) {
    if (!get(model, 'submission.url')) {
      this.transitionTo('survey.index');
    }
  }
});
