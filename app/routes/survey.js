import Route from '@ember/routing/route';
import rsvp from 'rsvp';

export default Route.extend({
  model({ id }) {
    return rsvp.hash({
      survey: this.store.findRecord('survey', id),
      submission: this.store.createRecord('submission')
    });
  }
});
