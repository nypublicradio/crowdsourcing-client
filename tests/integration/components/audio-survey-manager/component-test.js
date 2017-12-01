import { moduleForComponent } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';
import { find, fillIn, click } from 'ember-native-dom-helpers';

moduleForComponent('audio-survey-manager', 'Integration | Component | audio survey manager', {
  integration: true
});

test('it renders', function(assert) {
  this.setProperties({
    step: '1',
    survey: {questions: []},
    submission: {answers: {}},
  });
  this.render(hbs`{{audio-survey-manager step=step survey=survey submission=submission}}`);

  assert.ok(find('.audio-survey-manager'));
  assert.ok(find('.audio-survey__header.step-1'), 'renders a class based on the current step');
  
  assert.ok(find('.audio-recorder'), 'step 1 shows an audio recorder');
  
  this.set('step', '2');
  assert.ok(find('.playback-screen'), 'step 2 shows playback screen');
  
  this.set('step', '3');
  assert.ok(find('.personal-info'), 'step 3 shows personal info form');
});

test('final step', function(assert) {
  assert.expect(3);
  let done = assert.async();
  let progress = {
    cache: {
      url: 'audio-url.wav'
    }
  };
  let survey = {
    questions: [{shortName: 'first-name'}],
    audioQuestions: [{shortName: 'audio-question'}]
  };
  let submission = {
    answers: {},
    save() { 
      assert.ok('save called');
      return Promise.resolve();
    }
  };
  let router = {
    transitionTo() { assert.ok('transitionTo called') } 
  };
  this.setProperties({ progress, survey, submission, router });
  
  this.render(hbs`{{audio-survey-manager
                    step='3'
                    survey=survey
                    submission=submission
                    progress=progress
                    router=router}}`);
                    
  fillIn('input[name=first-name]', 'foo').then(() => {
    click('.personal-info__submit').then(() => {
      assert.equal(submission.answers['audio-question'], 'audio-url.wav', 'audio question is saved to submission when the personal info form is submitted through the audio survey manager');
      done();
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
