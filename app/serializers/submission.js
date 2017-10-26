import DS from 'ember-data';
import { singularize } from 'ember-inflector';

export default DS.JSONAPISerializer.extend({
  payloadKeyFromModelName: modelName => singularize(modelName),
  serialize(snapshot/*, options*/) {
    let payload = this._super(...arguments);
    let questions = snapshot.record.get('survey.questions');
    if (!questions) {
      return payload;
    }
    let { answers } = payload.data.attributes;
    payload.data.attributes.answers = [];

    questions.forEach(question => {
      let { shortName, id } = question.getProperties('shortName', 'id');
      payload.data.attributes.answers.push({
        question: Number(id),
        response: answers[shortName]
      });
    });
    
    return payload;
  }
});
