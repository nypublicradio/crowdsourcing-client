import { moduleFor, test } from 'ember-qunit';

moduleFor('route:survey/expired', 'Unit | Route | survey/expired', {
  // Specify the other units that are required for this test.
  needs: ['service:headData']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
