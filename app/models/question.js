import DS from 'ember-data';

export default DS.Model.extend({
  inputType: DS.attr('string'),
  label: DS.attr('string'),
  shortName: DS.attr('string'),
  questionText: DS.attr('string'),
  required: DS.attr('boolean')
});
