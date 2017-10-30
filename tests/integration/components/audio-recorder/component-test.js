import { moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';
import { stubTwilioService } from '../../../helpers/twilio-stub';
import { click, find } from 'ember-native-dom-helpers';

moduleForComponent('audio-recorder', 'Integration | Component | audio recorder', {
  integration: true
});

test('it renders', function(assert) {
  this.set('twilio', this.spy());
  this.render(hbs`{{audio-recorder twilio=twilio}}`);

  assert.ok(find('.audio-recorder'));
  
  // assert text updates based on twilio states
  // assert correct values from question are rendered
});

test('toggleRecord calls the correct twilio service API', function(assert) {
  let twilio = stubTwilioService();
  twilio.record.isIdle = true;
  twilio.record.perform = this.spy();
  twilio.disconnect = this.spy();
  
  this.set('twilio', twilio);
  this.render(hbs`{{audio-recorder twilio=twilio}}`);
  
  click('.action-button');
  
  twilio.record.isIdle = false;
  
  click('.action-button');
  
  assert.ok(twilio.record.perform.calledOnce, 'performs record if task is idle');
  assert.ok(twilio.disconnect.calledOnce, 'disconnects if record is running');
});

test('it passes the correct values to next', function(assert) {
  let twilio = stubTwilioService();
  this.set('twilio', twilio);
  this.set('next', function({key, value}) {
    assert.equal(key, 'connection');
    assert.deepEqual(value, twilio.currentConnection);
  })
  this.render(hbs`{{audio-recorder twilio=twilio next=next}}`);
  
  click('.action-button');
});

test('it renders the expected attrs of the passed in question', function(assert) {
  let questionText = "Foo bar quesiton text";
  let question = {
    questionText,
  }
  this.set('question', question);
  this.render(hbs`{{audio-recorder question=question}}`);
  
  assert.equal(find('.audio-recorder__script').textContent.trim(), questionText);
  
  this.set('question.questionText', null);
  
  assert.ok(find('.audio-recorder').textContent.match('Press the record button and begin telling your story.'), 'the text changes when there is no questionText');
});

test('UI updates', function(assert) {
  let twilio = stubTwilioService();
  this.set('twilio', twilio);
  this.render(hbs`{{audio-recorder twilio=twilio}}`);
  
  assert.equal(find('.action-button').textContent.trim(), 'Start Recording');
  
  this.set('twilio.connect.isRunning', true);
  assert.equal(find('.action-button').textContent.trim(), 'Connecting...');
  
  this.set('twilio.connect.isRunning', false);
  this.set('twilio.record.isRunning', true);
  assert.equal(find('.action-button').textContent.trim(), 'Stop Recording');
  assert.ok(find('.audio-recorder__button.is-recording'), 'class name is updated');
})
