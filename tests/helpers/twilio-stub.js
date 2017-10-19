import sinon from 'sinon';

const TwilioDevice = {
  offline() {},
  setup() {},
  disconnectAll() {},
  connect() {},
};

const DeviceStub = sinon.stub(TwilioDevice)

export default {
  Device: DeviceStub
};
