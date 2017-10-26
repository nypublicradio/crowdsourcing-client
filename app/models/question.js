import DS from 'ember-data';

const TEXT     = 't';
const EMAIL    = 'e';
const AUDIO    = 'a'
const TEXTAREA = 'x';

export const TYPES = {
  TEXT,
  EMAIL,
  AUDIO,
  TEXTAREA,
};

export default DS.Model.extend({
  label:        DS.attr('string'),
  required:     DS.attr('boolean'),
  inputType:    DS.attr('string'),
  shortName:    DS.attr('string'),
  questionText: DS.attr('string'),
});
