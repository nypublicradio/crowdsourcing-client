import { moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';

moduleForComponent('audio-recorder', 'Integration | Component | audio recorder', {
  integration: true
});

test('it renders', function(assert) {
  this.set('twilio', this.spy());
  this.render(hbs`{{audio-recorder twilio=twilio}}`);

  assert.ok(this.$().text().match('Record Yourself'));
});
