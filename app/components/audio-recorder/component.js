import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from "@ember/object";

export default Component.extend({
  classNames: ['audio-recorder'],
  
  twilio:  service(),
  
  toggleRecord() {
    let twilio = this.get('twilio');
    if (get(twilio, 'record.isIdle')) {
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
