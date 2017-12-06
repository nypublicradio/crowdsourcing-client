import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';
import { find, click } from 'ember-native-dom-helpers';
import {
  triggerSuccess
} from '../../../helpers/ember-cli-clipboard';

moduleForComponent('escape-modal', 'Integration | Component | escape modal', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{escape-modal renderInPlace=true}}`);
  assert.ok(find('.escape-modal'));
  assert.equal(find('.escape-modal__title').textContent, 'This session has timed out.');
  assert.equal(find('.escape-modal__body > p').textContent.trim(), 'Please leave your phone screen unlocked to avoid the session timing out again.');
});

test('it copies text', function(assert) {
  this.render(hbs`{{escape-modal renderInPlace=true}}`);

  triggerSuccess(this, '.escape-modal__copy-button');
  assert.equal(find('.escape-modal__copy-button').textContent.trim(), 'Copied!');
});

test('it calls startOver', function() {
  this.set('startOver', this.mock().once());
  this.render(hbs`{{escape-modal startOver=startOver renderInPlace=true}}`);
  
  click('.escape-modal__window-button');
});
