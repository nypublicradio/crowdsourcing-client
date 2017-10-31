import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { next } from '@ember/runloop';
import { startMirage } from 'crowdsourcing-client/initializers/ember-cli-mirage';
import { stubTwilioGlobal } from '../../helpers/twilio-stub';

moduleFor('service:twilio', 'Unit | Service | twilio', {
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
    
    assert.ok(service.get('sampler'));
    
    assert.ok(Twilio.Device.offline.calledOnce, 'setup offline handler');
    assert.ok(Twilio.Device.setup.calledOnce, 'twilio setup was called');
    
    done();
  }
  runAssertions();
});

test('record calls connect and sets up the proper handlers', function(assert) {
  let service = this.subject();
  let done = assert.async();
  
  Twilio.Device.connect.returns({
    accept: this.stub().callsArg(0),
    disconnect: this.stub().callsArg(0),
    error: this.mock().atLeast(2),
    _monitor: {
      on: this.mock().atLeast(1).withArgs('sample')
    }
  });
  service.get('record').perform();
  
  function runAssertions() {
    if (service.get('record.isRunning')) {
      return next(runAssertions);
    }
    
    assert.ok(Twilio.Device.connect.calledOnce);
    done();
  }
  runAssertions();
});

test('sampleAnalyser responds to empty packets', function(assert) {
  let service = this.subject({
    currentConnection: {}
  });
  service.sampleAnalyser({ packetsSent: 0 });

  assert.ok(Twilio.Device.disconnectAll.calledOnce, 'disconnectAll called');
  assert.ok(service.get('unrecoverable'), 'service marked as unrecoverable')
  assert.ok(service.get('currentConnection.bad'), 'connection marked as bad');
});

test('sampleAnalyser calls off sampling if it detects packets', function(assert) {
  let connectionMock = {
    _monitor: {
      removeListener: this.spy()
    }
  };
  let service = this.subject({
    currentConnection: connectionMock
  });
  service.sampleAnalyser({ packetsSent: 1 });
  
  assert.ok(Twilio.Device.disconnectAll.notCalled, 'disconnectAll NOT called');
  assert.notOk(service.get('unrecoverable'), 'service is still OK');
  assert.ok(connectionMock._monitor.removeListener.calledOnce);
})


test('Twilio disconnect calls disconnectAll', function(assert) {
  let service = this.subject();
  service.disconnect();
  assert.ok(Twilio.Device.disconnectAll.calledOnce, 'called it');
});

test('It triggers the twilio-connected callback', function(assert) {
  let service = this.subject();
  service.on('twilio-connected', () => assert.ok('twilio-connected event was triggered'));
  service.get('record').perform();
})
