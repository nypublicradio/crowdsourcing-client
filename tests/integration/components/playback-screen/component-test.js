import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Test from 'ember-test';
import { later } from '@ember/runloop';
import { find, click } from 'ember-native-dom-helpers';
import { dummyHifi } from 'crowdsourcing-client/tests/helpers/hifi-integration-helpers';
import { startMirage } from 'crowdsourcing-client/initializers/ember-cli-mirage';
import config from '../../../../config/environment';

moduleForComponent('playback-screen', 'Integration | Component | playback screen', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{playback-screen}}`);

  assert.ok(find('.playback-screen'));
});

test('playOrPause plays back and the progress meter moves', function(assert) {
  let asserted = false;
  Test.registerWaiter(this, function() {
    return asserted;
  });
  let done = assert.async();
  let server = startMirage();
  server.get(`${config.twilioService}/status`, {path: '/good/5000/recording'});
  
  this.register('service:hifi', dummyHifi);
  this.inject.service('hifi');
  
  this.render(hbs`{{playback-screen}}`);
  later(() => {
    click('.playback-button');
    later(() => {
      assert.notEqual(find('.playback-screen__progress').style.width, '', 'width should be updated after playback has occurred');
      assert.ok(find('.playback-pause'), 'pause button should be showing');
      asserted = true;
      server.shutdown();
      done();
    }, 500)
  }, 50);
});

test('it looks up the audio status with the given call id', function(assert) {
  let server = startMirage();
  this.set('callId', 'foo');
  server.get(`${config.twilioService}/status`, (schema, request) => {
    assert.equal(request.queryParams.client, 'foo');
    server.shutdown();
  });
  
  this.render(hbs`{{playback-screen callId=callId}}`);
});

test('it displays an error message if the audio can\'t be found', function(assert) {
  let done = assert.async();
  let server = startMirage();
  server.get(`${config.twilioService}/status`, {message: 'AUDIO_NOT_READY'});
  
  this.set('callId', 'foo');
  this.render(hbs`{{playback-screen callId=callId timeout=1}}`);
  later(() => {
    assert.ok(find('.playback-screen__error'), 'no audio error message should display')
    assert.equal(find('code').textContent.trim(), 'foo', 'should display call ID');
    server.shutdown();
    done();
  }, 500);
});
