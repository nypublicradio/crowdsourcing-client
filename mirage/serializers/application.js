import { JSONAPISerializer } from 'ember-cli-mirage';
import { singularize } from 'ember-inflector';

export default JSONAPISerializer.extend({
  typeKeyForModel: model => singularize(model.modelName)
});
