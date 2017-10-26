import DS from 'ember-data';
import { singularize } from 'ember-inflector';
import config from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  host: config.crowdsourcingService,
  pathForType: modelName => singularize(modelName),
  buildURL() {
    return this._super(...arguments) + '/';
  }
});
