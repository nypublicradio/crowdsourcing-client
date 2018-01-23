import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

moduleFor('route:survey', 'Unit | Route | survey', {
  needs: ['service:headData']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});

test('it looks up the given survey and creates a fresh submission', function(assert) {
  let id = 'foo';
  let survey = 'survey';
  let submission = 'submission';
  let route = this.subject();
  this.mock(route.store)
    .expects('findRecord')
    .once()
    .withArgs('survey', id)
    .resolves(survey);
  
  this.mock(route.store)
    .expects('createRecord')
    .once()
    .withArgs('submission', { survey })
    .returns(submission);
  
  route.model({ id })
    .then(({ survey, submission }) => {
      assert.equal(survey, 'survey', 'model hook resolves with expected survey');
      assert.equal(submission, 'submission', 'model hook resolves with expected submission');
    });
});

test('it transitions to not-found if the survey rejects as a 404', function() {
  let route = this.subject();
  let error = {errors: {status: 404}};
  let id = 'foo';

  this.mock(route.store)
    .expects('findRecord')
    .rejects(error);

  this.mock(route)
    .expects('transitionTo')
    .withArgs('not-found', id);

  route.model({ id });
});
