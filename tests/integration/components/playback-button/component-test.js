import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('playback-button', 'Integration | Component | playback button', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{playback-button}}`);

  assert.equal(this.$('.playback-button').length, 1);
});
