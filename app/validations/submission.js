import {
  validatePresence,
  validateFormat
} from 'ember-changeset-validations/validators';
import { TYPES } from '../models/question';

export default function makeValidations(fields) {
  let validations = {};
  fields.forEach(field => {
    let key = field.get('shortName');
    validations[key] = [];
    if (field.get('inputType') === TYPES.EMAIL) {
      validations[key].push(validateFormat({ type: 'email' }));
    }
    if (field.get('required')) {
      validations[key].push(validatePresence(true));
    }
  });
  return validations;
}
