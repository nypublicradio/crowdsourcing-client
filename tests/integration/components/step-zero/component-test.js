import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find, click } from 'ember-native-dom-helpers';

moduleForComponent('step-zero', 'Integration | Component | step zero', {
  integration: true
});

test('it renders', function(assert) {
  let title = 'Foo Title'; 
  let summary = 'Bar Summary';
  let survey = {
    title,
    summary
  };
  this.set('survey', survey);
  this.render(hbs`{{step-zero survey=survey}}`);

  assert.ok(find('.step-zero'));
  assert.equal(find('.step-zero__title').textContent, title);
  assert.equal(find('.step-zero__summary').textContent.trim(), summary);
});

test('transitions to step 1', function(assert) {
  let router = {
    transitionTo(route, arg) { 
      assert.ok('transitionTo called');
      assert.equal(route, 'survey.step');
      assert.equal(arg, 1);
    }
  };
  this.set('router', router);
  
  this.render(hbs`{{step-zero router=router}}`);
  click('.action-button');
})
