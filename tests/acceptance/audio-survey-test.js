import test from 'ember-sinon-qunit/test-support/test';
import moduleForAcceptance from 'crowdsourcing-client/tests/helpers/module-for-acceptance';
import { createAudioSurvey } from 'crowdsourcing-client/mirage/scenarios/default';
import { stubTwilioGlobal } from 'crowdsourcing-client/tests/helpers/twilio-stub';
import config from 'crowdsourcing-client/config/environment';
import 'crowdsourcing-client/tests/helpers/hifi-acceptance-helper';

moduleForAcceptance('Acceptance | audio survey flow', {
  afterEach() {
    window.server.shutdown();
  }
});

test('taking an audio survey', function(assert) {
  createAudioSurvey(server);
  server.get(`${config.twilioService}/status`, {path: '/good/10000/audio.mp3'});
  let [ survey ] = server.db.surveys;
  let [ audioQuestion ] = server.db.questions.update({inputType: 'a'}, {questionText: 'audio question text'});
  
  let resolveRecord;
  window.Twilio = stubTwilioGlobal();
  window.Twilio.Device.connect.returns({
    accept: this.stub().callsArg(0),
    disconnect: resolve => resolveRecord = resolve,
    error: this.mock('error').atLeast(2),
    _monitor: {
      on: this.mock('_monitor.on').atLeast(1).withArgs('sample')
    },
  });
  window.Twilio.Device.disconnectAll.callsFake(() => resolveRecord({parameters: {CallSid: 'call id'}}));
  
  visit(`/${survey.id}`);

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}`, 'should be on step 0: introduction');
    assert.equal(find('.step-zero__title').text().trim(), survey.title, 'survey title should be visible');
    assert.equal(find('.step-zero__summary').text().trim(), survey.summary, 'survey summary should be visible');
    
    click('.step-zero button');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/1`, 'should be on step 1: record audio');
    
    assert.equal(find('.audio-recorder__script').text().trim(), audioQuestion.questionText, 'audio question text should be visible');
    click('.audio-recorder__button');
  });
  
  andThen(function() {
    click('.audio-recorder__button');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/2`, 'should be on step 2: review recording');
    
    click('.playback-button');
  });
  
  andThen(function() {
    assert.ok(find('.playback-pause').length, 'button should be a pause');
    
    click('.audio-survey-header-button');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/1`, 'should be on step 1 after clicking back');
    click('.audio-recorder__button');
  });
  
  andThen(function() {
    click('.audio-recorder__button');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/2`, 'should be on step 2 after re-recording');
    
    click('.action-button');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/3`, 'should be on step 3: personal info');
  });
    
  let answers = {
    'first-name': 'foo',
    'last-name': 'bar',
    'email': 'buz@baz.com',
    'audio': '/good/10000/audio.mp3'
  };
  fillIn('[name=first-name]', answers['first-name']);
  fillIn('[name=last-name]', answers['last-name']);
  fillIn('[name=email]', answers['email']);
  
  server.post(`${config.crowdsourcingService}/submission`, function({ submissions }, request) {
    let payload = JSON.parse(request.requestBody);
    let submittedAnswers = payload.data.attributes.answers;
    server.db.questions.forEach(question => {
      let expectedAnswer = answers[question.shortName];
      let answer = submittedAnswers.findBy('question', Number(question.id));
      assert.equal(expectedAnswer, answer.response, 'submitted answers should be grouped by question id under a `response` key');
    });
    return submissions.create(this.normalizedRequestAttrs());
  });
  
  andThen(function() {
    click('.personal-info__submit');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/thank-you`, 'should be on thank you step after successful submission');
    assert.equal(find('.thank-you__body').text().trim(), `Thanks! ${survey.thankYou}`, 'thank you message should be visible');
  });
});

moduleForAcceptance('Acceptance | audio survey redirects', {
  afterEach() {
    window.server.shutdown();
  }
});


test('a user should be redirected to step zero if they start on a later step', function(assert) {
  createAudioSurvey(server);
  let [ survey ] = server.db.surveys;
  
  visit(`/${survey.id}/2`);
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}`, 'step 2 returns to step 1');
  });
  
  visit(`/${survey.id}/3`);
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}`, 'step 3 returns to step 1');
  });
});
