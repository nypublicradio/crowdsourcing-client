import Component from '@ember/component';
import { inject as service } from "@ember/service"

export default Component.extend({
  twilio: service(),
  actions: {
    record() {
      try {
        this.get('twilio').connect();
      } catch(e) {
        console.log(e); // eslint-disable-line
      }
    }
  }
});
