import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { fillIn, click, findAll } from 'ember-native-dom-helpers';

import { TYPES } from 'crowdsourcing-client/models/question';

const { TEXT, AUDIO, EMAIL } = TYPES;

moduleForComponent('personal-info', 'Integration | Component | personal info', {
  integration: true
});

test('it renders', function(assert) {
  this.set('submission', {
    answers: {}
  });
  this.render(hbs`{{personal-info submission=submission}}`);

  assert.equal(this.$('.personal-info').length, 1);
});

test('renders expected questions', function(assert) {
  let questions = [{
    shortName: 'whats-your-name',
    inputType: TEXT,
  }, {
    shortName: 'cats-name',
    inputType: AUDIO,
  }];
  let submission = { answers: {} };
  this.setProperties({ questions, submission });
  this.render(hbs`{{personal-info questions=questions submission=submission}}`);

  assert.equal(this.$('input.personal-info__input').length, 1, 'should only render the text input');
});

test('submitting executes the changeset and calls onSubmit', function(assert) {
  assert.expect(2);

  let done = assert.async();
  let questions = [{
    shortName: 'first-name',
    inputType: TEXT,
  }, {
    shortName: 'last-name',
    inputType: TEXT,
  }, {
    shortName: 'email',
    inputType: EMAIL,
  }];
  let submission = { answers: {} };

  this.setProperties({ questions, submission });
  this.set('onSubmit', function() {
    assert.ok('onSubmit called');
  });

  this.render(hbs`{{personal-info
                    onSubmit=onSubmit
                    questions=questions
                    submission=submission}}`);

  fillIn('[name=first-name]', 'foo').then(() => {
    fillIn('[name=last-name]', 'bar').then(() => {
      fillIn('[name=email]', 'buz@baz.com').then(() => {
        click('[name=hasAgreed]').then(() => {
          click('.personal-info__submit').then(() => {
            assert.deepEqual(submission.answers, {
              'first-name': 'foo',
              'last-name': 'bar',
              'email': 'buz@baz.com'
            });
            done();
          })
        });
      });
    });
  });
});

test('error messages', function(assert) {
  let done = assert.async();
  let questions = [{
    shortName: 'first-name',
    inputType: TEXT,
    required: true,
  }, {
    shortName: 'last-name',
    inputType: TEXT,
  }, {
    shortName: 'email',
    inputType: EMAIL,
  }];
  let submission = { answers: {} };

  this.setProperties({ questions, submission });
  this.render(hbs`{{personal-info questions=questions submission=submission}}`);

  fillIn('[name=last-name]', 'bar').then(() => {
    fillIn('[name=email]', 'woops').then(() => {
      click('.personal-info__submit').then(() => {
        let errors = findAll('.personal-info__errors li');
        assert.equal(errors[0].textContent.trim(), 'First name can\'t be blank');
        assert.equal(errors[1].textContent.trim(), 'Email must be a valid email address');
        done();
      })
    });
  });
});
