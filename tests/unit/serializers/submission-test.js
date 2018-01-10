import { moduleForModel, test } from 'ember-qunit';
import { run } from '@ember/runloop';

moduleForModel('submission', 'Unit | Serializer | submission', {
  // Specify the other units that are required for this test.
  needs: ['serializer:submission', 'model:survey', 'model:question']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});

test('it serializes answers into the correct format', function(assert) {
  let record = this.subject();
  let { store } = record;
  run(() => {
    let survey = store.createRecord('survey', {
      questions: [
        store.createRecord('question', {id: 1, shortName: 'foo' }),
        store.createRecord('question', {id: 2, shortName: 'bar' }),
      ]
    });
    record.set('survey', survey);
    record.set('answers', {
      'foo': 'foo-answer',
      'bar': 'bar-answer'
    });
  });
  
  let serializedRecord = record.serialize();
  assert.deepEqual(serializedRecord.answers, [{
    question: 1,
    response: 'foo-answer'
  }, {
    question: 2,
    response: 'bar-answer'
  }], 'outgoing answers match format expected by server');
});
