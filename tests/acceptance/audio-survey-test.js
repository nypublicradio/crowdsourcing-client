import test from 'ember-sinon-qunit/test-support/test';
import moduleForAcceptance from 'crowdsourcing-client/tests/helpers/module-for-acceptance';
import { createAudioSurvey } from 'crowdsourcing-client/mirage/scenarios/default';
import { stubTwilioGlobal } from 'crowdsourcing-client/tests/helpers/twilio-stub';
import config from 'crowdsourcing-client/config/environment';
import 'crowdsourcing-client/tests/helpers/hifi-acceptance-helper';

moduleForAcceptance('Acceptance | audio survey');

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
    parameters: {CallSid: 'call id'}
  });
  window.Twilio.Device.disconnectAll.callsFake(() => resolveRecord());
  
  visit(`/${survey.id}`);

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}`);
    assert.equal(find('.step-zero__title').text().trim(), survey.title);
    assert.equal(find('.step-zero__summary').text().trim(), survey.summary);
    
    click('.step-zero button');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/1`);
    
    assert.equal(find('.audio-recorder__script').text().trim(), audioQuestion.questionText);
    click('.audio-recorder__button');
  });
  
  andThen(function() {
    click('.audio-recorder__button');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/2`);
    
    click('.playback-button');
  });
  
  andThen(function() {
    assert.ok(find('.playback-pause').length, 'button should be a pause');
    
    click('.audio-survey-header-button');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/1`);
    click('.audio-recorder__button');
  });
  
  andThen(function() {
    click('.audio-recorder__button');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/2`);
    
    click('.action-button');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/3`);
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
      assert.equal(expectedAnswer, answer.response);
    });
    return submissions.create(this.normalizedRequestAttrs());
  });
  
  andThen(function() {
    click('.personal-info__submit');
  });
  
  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/thank-you`);
    assert.equal(find('.thank-you__body').text().trim(), `Thanks! ${survey.thankYou}`);
  });
});
