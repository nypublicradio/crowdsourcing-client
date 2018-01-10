import DRFAdapter from './drf';
import { singularize } from 'ember-inflector';
import config from '../config/environment';

export default DRFAdapter.extend({
  host: config.crowdsourcingService,
  pathForType: modelName => singularize(modelName),
  buildURL() {
    return this._super(...arguments) + '/';
  }
});
