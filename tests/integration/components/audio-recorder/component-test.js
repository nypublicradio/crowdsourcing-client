import { moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';
import { click, find } from 'ember-native-dom-helpers';
import { stubTwilioService } from '../../../helpers/twilio-stub';

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
  assert.expect(3);
  
  let twilio = stubTwilioService();
  twilio.record.isIdle = true;
  twilio.record.perform = this.stub().resolves({parameters: {CallSid: 'foo'}});
  twilio.disconnect = this.spy();
  
  this.set('next', function(value) {
    assert.deepEqual(value, twilio.currentConnection);
  });
  
  this.set('twilio', twilio);
  this.render(hbs`{{audio-recorder twilio=twilio disableButton=disableButton next=next}}`);
  
  click('.action-button')
    .then(() => {
      twilio.record.isIdle = false;
      this.set('disableButton', false);
      
      click('.action-button');
      
      assert.ok(twilio.record.perform.calledOnce, 'performs record if task is idle');
      assert.ok(twilio.disconnect.calledOnce, 'disconnects if record is running');
    });
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
