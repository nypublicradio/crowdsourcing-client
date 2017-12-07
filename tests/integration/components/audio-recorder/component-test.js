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
});

test('toggleRecord calls the correct twilio service API', function(assert) {
  let done = assert.async();
  assert.expect(3);
  
  let twilio = stubTwilioService();
  twilio.connect.perform = this.stub().resolves({
    parameters: twilio.currentConnection.parameters,
    error: this.spy(),
    disconnect: this.spy()
  });
  twilio.disconnect = this.stub().returns(twilio.currentConnection)
  
  let nextMock = this.mock('next')
                     .once()
                     .withArgs(twilio.currentConnection.parameters.CallSid);
  this.set('next', nextMock);
  
  this.set('twilio', twilio);
  this.render(hbs`{{audio-recorder twilio=twilio next=next recordTimeout=0}}`)
  
  click('.action-button').then(() => {
    click('.action-button').then(() => {
      assert.ok(twilio.connect.perform.calledOnce, 'performs record if task is idle');
      assert.ok(twilio.disconnect.calledOnce, 'disconnects if record is running');
      done();
    });
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
  this.set('connect', {});
  this.set('record', {});
  this.render(hbs`{{audio-recorder twilio=twilio connect=connect record=record}}`);
  
  assert.equal(find('.action-button').textContent.trim(), 'Start Recording');
  
  this.set('twilio.connect.isRunning', true);
  assert.equal(find('.action-button').textContent.trim(), 'Connecting...');
  
  this.set('twilio.connect.isRunning', false);
  this.set('record.isRunning', true);
  assert.equal(find('.action-button').textContent.trim(), 'Stop Recording');
  assert.ok(find('.audio-recorder__button.is-recording'), 'class name is updated');
  
  this.set('connect.isRunning', true);
  assert.ok(find('.action-button').disabled, 'Button should be disabled');
})
