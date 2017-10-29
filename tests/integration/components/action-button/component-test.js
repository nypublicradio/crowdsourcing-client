import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('action-button', 'Integration | Component | action button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{action-button}}`);

  assert.equal(this.$('.action-button').length, 1);

  // Template block usage:
  this.render(hbs`
    {{#action-button}}
      template block text
    {{/action-button}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('it binds the disabled attribute', function(assert) {
  this.set('disabled', true);
  this.render(hbs`{{action-button disabled=disabled}}`);
  assert.equal(this.$('[disabled]').length, 1, 'action button should be disabled');
  
  this.set('disabled', false);
  this.render(hbs`{{action-button disabled=disabled}}`);
  assert.equal(this.$('[disabled]').length, 0, 'action button should not be disabled');
});

test('it fires a click handler', function(assert) {
  function clicker() {
    assert.ok('clicker was called');
  }
  this.set('clicker', clicker);
  this.render(hbs`{{action-button click=clicker}}`);
  this.$('.action-button').click();
});
