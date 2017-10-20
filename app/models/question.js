import DS from 'ember-data';

export default DS.Model.extend({
  label:        DS.attr('string'),
  required:     DS.attr('boolean'),
  inputType:    DS.attr('string'),
  shortName:    DS.attr('string'),
  questionText: DS.attr('string'),
});
