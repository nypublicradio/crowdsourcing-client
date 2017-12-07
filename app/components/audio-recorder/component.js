import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import config from '../../config/environment';

export default Component.extend({
  recordTimeout: config.recordingThreshold || 2000,
  classNames:    ['audio-recorder'],
  
  twilio:  service(),
  
  connect: task(function * () {
    let connection = yield get(this, 'twilio.connect').perform();
    yield timeout(this.get('recordTimeout'));
    return connection;
  }),
  
  record: task(function * () {
    let connection = yield this.get('connect').perform();
    yield new Promise((resolve, reject) => {
      connection.disconnect(resolve);
      connection.error(reject);
    });
  }),
  
  toggleRecord() {
    let twilio = this.get('twilio');
    
    if (get(this, 'record.isIdle')) {
      get(this, 'record').perform();
    } else {
      let connection = twilio.disconnect();
      let next = this.get('next');
      if (next) {
        next(connection.parameters.CallSid);
      }
    }
  }
});
