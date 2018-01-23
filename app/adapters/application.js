import DRFAdapter from './drf';
import { singularize } from 'ember-inflector';
import config from '../config/environment';

export default DRFAdapter.extend({
  host: config.crowdsourcingService,
  namespace: '',
  pathForType: modelName => singularize(modelName),
  normalizeErrorResponse(status, headers, payload) {
    if (status === 404) {
      return {
        status,
        message: payload
      };
    } else {
      return this._super(...arguments);
    }
  }
});
