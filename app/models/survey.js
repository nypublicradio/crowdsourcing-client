import DS from 'ember-data';
import { filterBy, bool } from '@ember/object/computed';

export default DS.Model.extend({
  title:            DS.attr('string'),
  summary:          DS.attr('string'),
  thankYou:         DS.attr('string'),
  startsAt:         DS.attr('string'),
  questions:        DS.hasMany('question'),
  
  audioQuestions:   filterBy('questions', 'inputType', 'a'),
  hasAudioQuestion: bool('audioQuestions.length')
});
