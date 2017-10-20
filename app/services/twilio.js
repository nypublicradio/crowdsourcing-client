import Service from '@ember/service';
import { bind } from '@ember/runloop';
import { reads, union } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import fetch from 'fetch';
import config from '../config/environment';

let isMobileDevice = 'ontouchstart' in window;
let timesFocused = 0;
let intentToRecord = false;

export default Service.extend({
  connections:  [],
  errors: {
    setup:      [],
    record:     [],
    connect:    []
  },
  
  allErrors:         union('errors.setup', 'errors.record', 'errors.connect'),
  currentConnection: reads('connections.lastObject'),

  init() {
    this._super(...arguments);
    if (typeof window.Twilio === 'undefined') {
      console.warn('Twilio SDK is not loaded.'); // eslint-disable-line
    }
    window.addEventListener('focus', this.get('focusHandler'), false);
    this.set('sampler', bind(this, 'sampleAnalyser'));

    this.get('setup').perform();
  },
  
  willDestroy() {
    window.removeEventListener('focus', this.get('focusHandler'));
  },
  
  focusHandler() {
    timesFocused++;
    if (isMobileDevice && timesFocused > 1 && intentToRecord) {
      navigator.mediaDevices.getUserMedia({audio: true, video: false});
    }
  },
  
  setup: task(function * () {
    try {
      Twilio.Device.offline(function(device) { console.log(device); }); // eslint-disable-line
      let response = yield fetch(`${config.twilioService}/token`);
      let { token } = yield response.json();
      Twilio.Device.setup(token, {
        debug: config.environment === 'development',
        warnings: config.environment === 'development',
      });
    } catch(e) {
      this.get('errors.setup').pushObject(e);
    }
  }),
  
  record: task(function * () {
    let connection = yield this.get('connect').perform();
    try {
      yield new Promise((resolve, reject) => {
        connection.disconnect(resolve);
        connection.error(reject);
      });
    } catch(e) {
      this.get('errors.record').pushObject(e);
    }
  }),
  
  connect: task(function * () {
    try {
      let connection = Twilio.Device.connect({ To: config.twilioNumber });
      this.get('connections').pushObject(connection);
      connection._monitor.on('sample', this.get('sampler'));
      yield new Promise((resolve, reject) => {
        connection.accept(resolve);
        connection.error(reject);
      });
      return connection;
    } catch(e) {
      this.get('errors.connect').pushObject(e);
    }
  }),
  
  disconnect() {
    Twilio.Device.disconnectAll();
  },

  sampleAnalyser(sample) {
    let conn = this.get('currentConnection');
    if (sample.packetsSent === 0) {
      // BAD STATE; bail out
      console.warn('bad state!'); // eslint-disable-line
      this.set('unrecoverable', true);
      conn.bad = true;
      Twilio.Device.disconnectAll();
    } else {
      this.set('unrecoverable', false);
      conn._monitor.removeListener('sample', this.get('sampler'));
    }
  },
});
