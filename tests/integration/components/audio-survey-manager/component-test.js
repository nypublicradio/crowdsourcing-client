import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';
import { find, fillIn, click } from 'ember-native-dom-helpers';
import wait from 'ember-test-helpers/wait';

moduleForComponent('audio-survey-manager', 'Integration | Component | audio survey manager', {
  integration: true
});

test('it renders', function(assert) {
  this.setProperties({
    step: '1',
    survey: {questions: []},
    submission: {answers: {}, callId: ''},
  });
  this.render(hbs`{{audio-survey-manager step=step survey=survey submission=submission}}`);

  assert.ok(find('.audio-survey-manager'));

  assert.ok(find('.audio-recorder'), 'step 1 shows an audio recorder');

  this.set('submission.callId', 'required for later steps');
  this.set('step', '2');
  assert.ok(find('.playback-screen'), 'step 2 shows playback screen');

  this.set('step', '3');
  assert.ok(find('.personal-info'), 'step 3 shows personal info form');
});

test('final step', function(assert) {
  assert.expect(4);

  window.dataLayer = {push() {}};
  this.mock(window.dataLayer).expects('push').once().withArgs({
    event: 'crowdsourcing submit',
    "Crowdsourcing Survey ID": 1,
    "Crowdsourcing Survey Title": 'Test Survey',
  });

  let done = assert.async();
  let survey = {
    id: 1,
    title: 'Test Survey',
    questions: [{shortName: 'first-name'}],
    audioQuestions: [{shortName: 'audio-question'}]
  };
  let submission = {
    answers: {},
    callId: 'foo',
    url: 'audio-url.wav',
    save() {
      assert.ok('save called');
      return Promise.resolve();
    }
  };
  let router = {
    transitionTo() { assert.ok('transitionTo called') }
  };
  this.setProperties({ survey, submission, router });

  this.render(hbs`{{audio-survey-manager
                    step='3'
                    survey=survey
                    submission=submission
                    router=router}}`);

  fillIn('input[name=first-name]', 'foo').then(() => {
    click('input[name=hasAgreed]').then(() => {
      click('.personal-info__submit').then(() => {
        assert.equal(submission.answers['audio-question'], 'audio-url.wav', 'audio question is saved to submission when the personal info form is submitted through the audio survey manager');
        delete window.dataLayer;
        done();
      });
    });
  });
});

test('it aborts and redirects if there is no callId on steps later than 1', function(assert) {
  this.setProperties({
    router: {
      transitionTo: this.mock().twice().withArgs('survey.index')
    },
    step: '1',
    submission: {answers: {}},
    callId: ''
  });
  this.render(hbs`{{audio-survey-manager
                    step=step
                    submission=submission
                    callId=callId
                    router=router}}`);

  assert.ok(find('.audio-survey-manager'));

  this.set('step', '2');
  this.set('step', '3');
});

test('it shows an escape modal if the twilio service enters the bad state', function(assert) {
  window.dataLayer = {push() {}};
  this.mock(window.dataLayer).expects('push').once().withArgs({ event: 'bad state' });

  let twilioStub = {on: this.mock().callsArgAsync(1).once()};
  this.setProperties({
    step: '1',
    survey: {questions: []},
    submission: {answers: {}},
    callId: '',
    twilio: twilioStub
  });
  this.render(hbs`{{audio-survey-manager
                    step=step
                    survey=survey
                    submission=submission
                    callId=callId
                    twilio=twilio
                  }}`);

  return wait().then(() => {
    assert.ok(find('.escape-modal'))
    delete window.dataLayer;
  });
});
