import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { later, bind } from '@ember/runloop';
import { didCancel }  from 'ember-concurrency';
import config from '../../config/environment';

export default Component.extend({
  recordTimeout: config.recordingThreshold || 2000,
  classNames:    ['audio-recorder'],
  
  twilio:  service(),
  
  connectCallback() {
    later(this, () => this.set('disableButton', false), get(this, 'recordTimeout'));  
  },
  
  toggleRecord() {
    let twilio = this.get('twilio');
    let next = this.get('next');

    if (get(twilio, 'record.isIdle')) {
      this.set('disableButton', true);
      twilio.one('twilio-connected', bind(this, 'connectCallback'));
      
      get(twilio, 'record').perform()
        .then(connection => next && next(connection))
        .catch(e => {
          if (!didCancel(e)) {
            throw e;
          }
        });

    } else {
      twilio.disconnect();
    }
  }
});
