import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['audio-recorder'],
  
  twilio:  service(),
  
  toggleRecord() {
    let twilio = this.get('twilio');
    if (twilio.get('record.isIdle')) {
      twilio.get('record').perform();
    } else {
      twilio.disconnect();
      let connection = twilio.get('currentConnection');
      this.get('next')({ key: 'connection', value: connection });
    }
  }
});
