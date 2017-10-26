import Route from '@ember/routing/route';

export default Route.extend({
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
  
  error() {
    console.log(arguments)
  }
});
