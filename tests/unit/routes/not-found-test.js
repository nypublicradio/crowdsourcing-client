import { moduleFor, test } from 'ember-qunit';

moduleFor('route:not-found', 'Unit | Route | not found', {
  // Specify the other units that are required for this test.
  needs: ['service:headData', 'service:fastboot']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
