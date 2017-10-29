import {
  validatePresence,
  validateFormat
} from 'ember-changeset-validations/validators';
import { get } from '@ember/object';
import { TYPES } from '../models/question';

export default function makeValidations(fields) {
  let validations = {};
  fields.forEach(field => {
    let key = get(field, 'shortName');
    validations[key] = [];
    if (get(field, 'inputType') === TYPES.EMAIL) {
      validations[key].push(validateFormat({ type: 'email' }));
    }
    if (get(field, 'required')) {
      validations[key].push(validatePresence(true));
    }
  });
  return validations;
}
