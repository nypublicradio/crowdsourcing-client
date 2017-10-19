import sinon from 'sinon';

export default function() {
  const TwilioDevice = {
    offline() {},
    setup() {},
    disconnectAll() {},
    connect() {},
  };
  const Device = sinon.stub(TwilioDevice)
  return { Device };
}
