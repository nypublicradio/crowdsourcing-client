import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';


moduleFor('controller:survey/cancel', 'Unit | Controller | survey/cancel', {
  // Specify the other units that are required for this test.
  needs: ['service:headData']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});

test('cancel action calls transitionToRoute', function() {
  let controller = this.subject();
  this.mock(controller).expects('transitionToRoute').once().withArgs('survey.step', 1);
  controller.send('cancel');
});
