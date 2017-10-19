import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  twilio: service(),
  
  toggleRecord() {
    let twilio = this.get('twilio');
    if (twilio.get('record.isIdle')) {
      twilio.get('record').perform();
    } else {
      let connection = twilio.get('currentConnection');
      twilio.disconnect();
      twilio.getRecordingURL(connection.parameters.CallSid)
        .then(() => this.get('next')());
    }
  }
});
