import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  title: 'Not Found',

  fastboot: service(),

  model() {
    if (this.get('fastboot.isFastBoot')) {
      this.set('fastboot.response.statusCode', 404);
    }
  }
});
