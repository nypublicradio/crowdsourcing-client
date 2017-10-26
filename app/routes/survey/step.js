import Route from '@ember/routing/route';

export default Route.extend({
  model({ step }) {
    let { survey, submission } = this.modelFor('survey');
    return {
      step,
      survey,
      submission
    };
  },
  setupController(controller, { survey }) {
    this._super(...arguments);
    if (survey.get('hasAudioQuestion')) {
      controller.set('surveyType', 'audio');
    }
  }
});
