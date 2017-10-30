import sinon from 'sinon';

export function stubTwilioGlobal() {
  const TwilioDevice = {
    offline() {},
    setup() {},
    disconnectAll() {},
    connect() {},
  };
  const Device = sinon.stub(TwilioDevice)
  return { Device };
}

export function stubTwilioService() {
  const TwilioService = {
    record: {
      isIdle: null,
      perform() {},
    },
    connect: {
      perform() {}
    },
    disconnect() {},
    currentConnection: {parameters: {CallSid: 'foo'}},
    // Evented mixin
    one() {},
  }
  
  return TwilioService;
}
