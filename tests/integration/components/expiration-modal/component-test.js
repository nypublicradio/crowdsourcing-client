import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find } from 'ember-native-dom-helpers';

moduleForComponent('expiration-modal', 'Integration | Component | expiration modal', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{expiration-modal}}`);

  assert.ok(find('.expiration-modal'), 'it renders');
  assert.equal(find('.expiration-modal__title').textContent.trim(), 'We are no longer accepting submissions.')

  // Template block usage:
  this.render(hbs`
    {{#expiration-modal renderInPlace=true}}
      A custom message
    {{/expiration-modal}}
  `);

  assert.equal(find('.expiration-modal__body').textContent.trim(), 'A custom message');
});
