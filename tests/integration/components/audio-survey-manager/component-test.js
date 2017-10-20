import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('audio-survey-manager', 'Integration | Component | audio survey manager', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{audio-survey-manager}}`);

  assert.equal(this.$('.audio-survey-manager').length, 1);
});
