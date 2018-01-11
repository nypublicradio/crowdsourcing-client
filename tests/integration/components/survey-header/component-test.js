import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find } from 'ember-native-dom-helpers';

moduleForComponent('survey-header', 'Integration | Component | survey header', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{survey-header
                    image='http://example.com/image.jpg'
                    title='BRAND NAME'
                  }}`);

  assert.ok(find('.survey-header'));
  assert.ok(find('img.survey-header__logo'), 'renders image');
  assert.equal(find('.survey-header__title').textContent.trim(), 'BRAND NAME');
  assert.ok(find('div.survey-header__wrapper'), 'does not render a link if there is no url');
  
  this.render(hbs`{{survey-header
                    image='http://example.com/image.jpg'
                    title='BRAND NAME'
                    url='http://example.com'
                  }}`);
                  
  assert.ok(find('.survey-header'));
  assert.ok(find('img.survey-header__logo'), 'renders image');
  assert.equal(find('.survey-header__title').textContent.trim(), 'BRAND NAME');
  assert.equal(find('a.survey-header__link').getAttribute('href'), 'http://example.com');
});
