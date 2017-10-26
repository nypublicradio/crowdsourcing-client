import Route from '@ember/routing/route';

export default Route.extend({
  model({ id }) {
    return this.store.findRecord('survey', id)
      .then(survey => {
        let submission = this.store.createRecord('submission', { survey });
        let answers = {};
        survey.get('questions').mapBy('shortName').forEach(k => answers[k] = '');
        submission.set('answers', answers);
        return {
          survey,
          submission
        };
      });
  }
});
