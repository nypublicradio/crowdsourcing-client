import { moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';

moduleForComponent('audio-recorder', 'Integration | Component | audio recorder', {
  integration: true
});

test('it renders', function(assert) {
  this.set('twilio', this.spy());
  this.render(hbs`{{audio-recorder twilio=twilio}}`);

  assert.equal(this.$('.audio-recorder').length, 1);
  
  // assert text updates based on twilio states
  // assert correct values from question are rendered
});

test('toggleRecord calls the correct twilio service API');

test('it passes the correct values to next');
