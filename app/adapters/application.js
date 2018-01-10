import DRFAdapter from './drf';
import { singularize } from 'ember-inflector';
import config from '../config/environment';

export default DRFAdapter.extend({
  host: config.crowdsourcingService,
  namespace: '',
  pathForType: modelName => singularize(modelName),
});
