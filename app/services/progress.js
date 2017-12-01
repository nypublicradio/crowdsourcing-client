import Service from '@ember/service';
import EmberObject from '@ember/object';

export default Service.extend({
  cache: null,
  
  init() {
    this._super(...arguments);
    this.set('cache', EmberObject.create({}));
  }
});
