import Route from '@ember/routing/route';

export default Route.extend({
  model({ step }) {
    return {
      step,
      survey: this.modelFor('survey').survey
    };
  },
  setupController(controller, { survey }) {
    this._super(...arguments);
    if (survey.get('hasAudioQuestion')) {
      controller.set('surveyType', 'audio');
    }
  }
});
