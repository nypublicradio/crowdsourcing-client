import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  titleToken: model => get(model, 'survey.title'),
  
  beforeModel() {
    if (window.dataLayer) {
      window.dataLayer.push({ gaCategory: 'Crowdsourcing Widget' });
    }
  },

  model({ id }) {
    return this.store.findRecord('survey', id)
      .then(survey => {
        let submission = this.store.createRecord('submission', { survey });
        return {
          survey,
          submission
        };
      });
  },

  redirect(model) {
    if (get(model, 'survey.expired')) {
      this.transitionTo('survey.expired', model);
    }
  },

  error() {
    console.log(arguments); // eslint-disable-line
  },

  actions: {
    stepZero() {
      this.controller.set('model.canProceed', true);
    }
  }
});
