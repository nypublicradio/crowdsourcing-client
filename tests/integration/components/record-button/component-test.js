import { moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';
import { startMirage } from 'nypr-audio-crowdsourcing/initializers/ember-cli-mirage';

import TwilioStub from '../../../helpers/twilio-stub';

moduleForComponent('record-button', 'Integration | Component | record button', {
  integration: true,
  beforeEach() {
    this.server = startMirage();
    window.Twilio = TwilioStub();
  },
  afterEach() {
    this.server.shutdown();
    delete window.Twilio;
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{record-button}}`);

  assert.equal(this.$().text().trim(), 'Loading...');
});
