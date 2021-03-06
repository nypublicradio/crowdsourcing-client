import DRFSerializer from './drf';
import { singularize } from 'ember-inflector';

export default DRFSerializer.extend({
  payloadKeyFromModelName: modelName => singularize(modelName),
  serialize(snapshot/*, options*/) {
    let payload = this._super(...arguments);
    let questions = snapshot.record.get('survey.questions');
    if (!questions) {
      return payload;
    }
    let { answers } = payload;
    payload.answers = [];

    questions.forEach(question => {
      let { shortName, id } = question.getProperties('shortName', 'id');
      payload.answers.push({
        question: Number(id),
        response: answers[shortName]
      });
    });
    
    return payload;
  }
});
