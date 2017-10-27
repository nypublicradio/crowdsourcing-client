import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('action-button', 'Integration | Component | action button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{action-button}}`);

  assert.equal(this.$('.aciton-button').length, 1);

  // Template block usage:
  this.render(hbs`
    {{#action-button}}
      template block text
    {{/action-button}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
