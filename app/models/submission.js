import DS from 'ember-data';

export default DS.Model.extend({
  survey:  DS.belongsTo('survey'),
  answers: DS.attr()
});
