import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { later, bind } from '@ember/runloop';

export default Component.extend({
  recordTimeout: 2000,
  classNames:    ['audio-recorder'],
  
  twilio:  service(),
  
  connectCallback() {
    later(this, () => this.set('disableButton', false), get(this, 'recordTimeout'));  
  },
  
  toggleRecord() {
    let twilio = this.get('twilio');

    if (get(twilio, 'record.isIdle')) {
      this.set('disableButton', true);
      twilio.one('twilio-connected', bind(this, 'connectCallback'));
      get(twilio, 'record').perform();
    } else {
      twilio.disconnect();
      let connection = get(twilio, 'currentConnection');
      let next = this.get('next');
      if (next) {
        next({ key: 'connection', value: connection });
      }
    }
  }
});
