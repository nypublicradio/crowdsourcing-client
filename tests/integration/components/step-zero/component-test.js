import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('step-zero', 'Integration | Component | step zero', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{step-zero}}`);

  assert.equal(this.$('.step-zero').length, 1);
});
