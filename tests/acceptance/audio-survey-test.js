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
  server.get(`${config.twilioService}/status`, {toSubmit: '/good/5000/recording.wav', toListen: '/good/5000/recording.mp3'});
  let [ survey ] = server.db.surveys;
  let [ audioQuestion ] = server.db.questions.update({inputType: 'a'}, {questionText: 'audio question text'});

  window.Twilio = stubTwilioGlobal();
  window.Twilio.Device.connect.returns({
    accept: this.stub().callsArgAsync(0),
    disconnect: this.mock('disconnect').twice(),
    error: this.mock('error').atLeast(4),
    _monitor: {
      on: this.mock('_monitor.on').twice().withArgs('sample')
    },
  });

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

    click('.playback-screen__cancel');
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

    click('.playback-screen__approve');
  });

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/3`, 'should be on step 3: personal info');
  });

  andThen(function() {
    click('.personal-info__submit');
  });

  andThen(function() {
    let errors = find('.personal-info__errors li');
    assert.equal(errors[0].textContent.trim(), 'First name can\'t be blank');
    assert.equal(errors[1].textContent.trim(), 'Last name can\'t be blank');
    assert.equal(errors[2].textContent.trim(), 'Email must be a valid email address');
    assert.equal(errors[3].textContent.trim(), 'Email can\'t be blank');
  });

  let answers = {
    'first-name': 'foo',
    'last-name': 'bar',
    'email': 'buz@baz.com',
    'audio': '/good/5000/recording.wav'
  };
  fillIn('[name=first-name]', answers['first-name']);
  fillIn('[name=last-name]', answers['last-name']);
  fillIn('[name=email]', answers['email']);

  server.post(`${config.crowdsourcingService}/submission`, function({ submissions }, request) {
    let payload = JSON.parse(request.requestBody);
    let submittedAnswers = payload.answers;
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
    assert.equal(find('.thank-you__body').text().trim(), survey.thankYou, 'thank you message should be visible');
  });
});

test('user can cancel and start over', function(assert) {
  createAudioSurvey(server);
  server.get(`${config.twilioService}/status`, {toSubmit: '/good/5000/recording.wav', toListen: '/good/5000/recording.mp3'});
  let [ survey ] = server.db.surveys;

  window.Twilio = stubTwilioGlobal();
  window.Twilio.Device.connect.returns({
    accept: this.stub().callsArgAsync(0),
    disconnect: this.mock('disconnect').once(),
    error: this.mock('error').twice(),
    _monitor: {
      on: this.mock('_monitor.on').once().withArgs('sample')
    },
  });

  visit(`/${survey.id}`);

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}`, 'should be on step 0: introduction');
    click('.step-zero button');
  });

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/1`, 'should be on step 1: record audio');
    click('.audio-recorder__button');
  });

  andThen(function() {
    click('.audio-recorder__button');
  });

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/2`, 'should be on step 2: review recording');
    click('.playback-screen__approve');
  });

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/3`, 'should be on step 3: personal info');
    click('.personal-info__cancel');
  });

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/cancel`, 'should be on cancel screen');
    click('.cancel__button');
  })

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}/1`, 'should be on step 1');
  })
});

test('expired survey', function(assert) {
  let survey = server.create('survey', {expired: true, expiredMessage: 'Sorry!'});

  visit(`/${survey.id}`);

  andThen(() => {
    assert.equal(currentURL(), `/${survey.id}/expired`);
    assert.equal(find('.expired-header').length, 1, 'expired header should render');
    assert.equal(find('.expired-message').text().trim(), 'Sorry!');
  });
});

moduleForAcceptance('Acceptance | audio survey redirects', {
  afterEach() {
    window.server.shutdown();
  }
});

test('a user should be redirected to step zero if they start on step 2', function(assert) {
  createAudioSurvey(server);
  let [ survey ] = server.db.surveys;

  visit(`/${survey.id}/2`);

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}`);
  });
});

test('a user should be redirected to step zero if they start on step 3', function(assert) {
  createAudioSurvey(server);
  let [ survey ] = server.db.surveys;

  visit(`/${survey.id}/3`);

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}`, 'step 3 returns to step 0');
  });
});

test('a user should be redirected to step zero if they start on thank you', function(assert) {
  createAudioSurvey(server);
  let [ survey ] = server.db.surveys;

  visit(`/${survey.id}/thank-you`);

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}`, 'thank you returns to step 0');
  });
});

test('a user should be redirected to step zero if they start on expired', function(assert) {
  createAudioSurvey(server);
  let [ survey ] = server.db.surveys;

  visit(`/${survey.id}/expired`);

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}`, 'expired returns to step 0');
  });
});

test('a user should be redirected to step zero if they start on cancel', function(assert) {
  createAudioSurvey(server);
  let [ survey ] = server.db.surveys;

  visit(`/${survey.id}/cancel`);

  andThen(function() {
    assert.equal(currentURL(), `/${survey.id}`, 'cancel returns to step 0');
  });
});

moduleForAcceptance('Acceptance | the bad state', {
  afterEach() {
    window.server.shutdown();
  }
});

test('bad state shows a modal', function(assert) {
  createAudioSurvey(server);
  let [ survey ] = server.db.surveys;

  window.Twilio = stubTwilioGlobal();
  window.Twilio.Device.connect.returns({
    accept: this.stub().callsArgAsync(0),
    disconnect: this.spy(),
    error: this.mock('error').twice(),
    _monitor: {
      on: this.stub().callsArgWithAsync(1, {packetsSent: 0}),
      removeListener: this.mock().once().withArgs('sample'),
    },
  });

  visit(`/${survey.id}`);

  andThen(() => {
    assert.equal(currentURL(), `/${survey.id}`, 'should be on step 0: introduction');
    click('.step-zero button');
  });

  andThen(() => {
    assert.equal(currentURL(), `/${survey.id}/1`, 'should be on step 1: record audio');
    click('.audio-recorder__button');
  });

  andThen(() => {
    assert.ok(find('.escape-modal'));
    triggerCopySuccess();
  });

  andThen(() => {
    assert.equal(find('.escape-modal__copy-button').text().trim(), 'Copied!');
  });
});
