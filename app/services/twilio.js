import Service, { inject as service } from '@ember/service';
import { reads, union } from '@ember/object/computed';
import Evented from '@ember/object/evented';
import { task } from 'ember-concurrency';
import fetch from 'fetch';
import config from '../config/environment';

let isMobileDevice = 'ontouchstart' in window;
let timesFocused = 0;
let intentToRecord = false;

export default Service.extend(Evented, {
  connections:  [],
  errors: {
    setup:      [],
    connect:    [],
    record:     [],
  },

  fastboot:          service(),
  isFastBoot:        reads('fastboot.isFastBoot'),
  allErrors:         union('errors.setup', 'errors.record', 'errors.connect'),
  currentConnection: reads('connections.lastObject'),

  init() {
    this._super(...arguments);
    if (this.get('isFastBoot')) {
      return;
    }
    if (typeof window.Twilio === 'undefined') {
      console.warn('Twilio SDK is not loaded.'); // eslint-disable-line
    }
    window.addEventListener('focus', this.get('focusHandler'), false);

    this.get('setup').perform();
  },

  willDestroy() {
    if (!this.get('isFastBoot')) {
      window.removeEventListener('focus', this.get('focusHandler'));
    }
  },

  focusHandler() {
    timesFocused++;
    if (isMobileDevice && timesFocused > 1 && intentToRecord) {
      navigator.mediaDevices.getUserMedia({audio: true, video: false});
    }
  },

  setup: task(function * () {
    Twilio.Device.offline(function(device) { console.log(device); }); // eslint-disable-line
    let response = yield fetch(`${config.twilioService}/token`);
    let { token } = yield response.json();
    Twilio.Device.setup(token, {
      debug: config.environment === 'development',
      warnings: config.environment === 'development',
    });
  }),

  connect: task(function * () {
    let connection = Twilio.Device.connect({ To: config.twilioNumber });
    this.get('connections').pushObject(connection);
    yield new Promise((resolve, reject) => {
      connection.accept(resolve);
      connection.error(reject);
    });
    return connection;
  }),

  disconnect() {
    let connection = Twilio.Device.activeConnection();
    connection.disconnect();
    return connection;
  },
});
