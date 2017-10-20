import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('personal-info', 'Integration | Component | personal info', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{personal-info}}`);

  assert.equal(this.$().text().trim(), '');
});
