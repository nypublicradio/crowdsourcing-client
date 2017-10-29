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
