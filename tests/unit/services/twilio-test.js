import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { next } from '@ember/runloop';
import { startMirage } from 'crowdsourcing-client/initializers/ember-cli-mirage';
import { stubTwilioGlobal } from '../../helpers/twilio-stub';

moduleFor('service:twilio', 'Unit | Service | twilio', {
  needs: ['service:fastboot'],
  beforeEach() {
    this.server = startMirage();
    window.Twilio = stubTwilioGlobal();
  },
  afterEach() {
    this.server.shutdown();
    delete window.Twilio;
  }
});

test('it does the expected setup', function(assert) {
  this.spy(window, 'addEventListener');
  let service = this.subject();
  let done = assert.async();

  function runAssertions() {
    if (service.get('setup.isRunning')) {
      return next(runAssertions);
    }
    assert.ok(window.addEventListener.calledOnce);
    assert.deepEqual(['focus', service.get('focusHandler'), false], window.addEventListener.getCall(0).args);

    assert.ok(Twilio.Device.offline.calledOnce, 'setup offline handler');
    assert.ok(Twilio.Device.setup.calledOnce, 'twilio setup was called');

    done();
  }
  runAssertions();
});

test('connect sets up the proper handlers', function(assert) {
  let service = this.subject();
  let done = assert.async();

  Twilio.Device.connect.returns({
    accept: this.stub().callsArgAsync(0),
    error: this.mock('connection.error').once(),
  });
  let connection;
  service.get('connect').perform().then(c => connection = c);

  function runAssertions() {
    if (service.get('connect.isRunning')) {
      return next(runAssertions);
    }

    assert.ok(Twilio.Device.connect.calledOnce, 'Twilio.Device.connect is called');
    assert.ok(connection.accept.calledOnce, 'accept handler is called')
    done();
  }
  runAssertions();
});

test('Twilio disconnect retrieves the active connection and calls disconnect', function(assert) {
  let service = this.subject();
  service.disconnect();
  assert.ok(Twilio.Device.activeConnection.calledOnce, 'retrieves active connection');
  assert.ok(Twilio.Device.activeConnection.returnValues[0].disconnect.calledOnce, 'calls disconnect on returned connection');
});
