import { moduleFor, test } from 'ember-qunit';

moduleFor('route:survey/cancel', 'Unit | Route | survey/cancel', {
  // Specify the other units that are required for this test.
  needs: ['service:headData']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
