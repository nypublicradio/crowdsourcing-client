import sinon from 'sinon';

export function stubTwilioGlobal() {
  const TwilioDevice = {
    offline() {},
    setup() {},
    disconnectAll() {},
    connect() {},
    destroy() {},
    activeConnection() {},
  };
  const Device = sinon.stub(TwilioDevice)
  Device.activeConnection.returns({
    disconnect: sinon.stub(),
    parameters: {CallSid: 'foo'}
  });
  return { Device };
}

export function stubTwilioService() {
  const TwilioService = {
    connect: {
      isIdle: null,
      perform() {}
    },
    disconnect() {},
    currentConnection: {parameters: {CallSid: 'foo'}},
    // Evented mixin
    one: sinon.spy(),
  }
  
  return TwilioService;
}
