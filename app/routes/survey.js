import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'crowdsourcing-client/config/environment';

export default Route.extend({
  headData: service(),

  titleToken: model => get(model, 'survey.title'),
  model({ id }) {
    return this.store.findRecord('survey', id)
      .then(survey => {
        let submission = this.store.createRecord('submission', { survey });
        return {
          survey,
          submission
        };
      })
      .catch(e => {
        if (e.errors && e.errors.status === 404) {
          this.transitionTo('not-found', id);
        }
      });
  },
  afterModel({survey}) {
    this.get('headData').setProperties({
      url: `${config.fastboot.hostWhitelist[0]}/survey/${get(survey, 'id')}`,
      desc: get(survey, 'summary'),
      image: {
        url: get(survey, 'brandLogo.url'),
        width: get(survey, 'brandLogo.width'),
        height: get(survey, 'brandLogo.height')
      }
    });
  },

  redirect(model) {
    if (get(model, 'survey.expired')) {
      this.transitionTo('survey.expired', model);
    }
  },

  error() {
    console.log(arguments); // eslint-disable-line
  }
});
