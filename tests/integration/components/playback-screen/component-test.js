import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('playback-screen', 'Integration | Component | playback screen', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{playback-screen}}`);

  assert.equal(this.$('.playback-screen').length, 1);
});

test('playOrPause plays back and the progress meter moves');

test('it looks up the audio status with the given call id');
