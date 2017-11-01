import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

moduleFor('route:survey', 'Unit | Route | survey');

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
