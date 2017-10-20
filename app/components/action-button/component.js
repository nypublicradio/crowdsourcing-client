import Component from '@ember/component';

export default Component.extend({
  tagName:           'button',
  classNames:        ['action-button'],
  attributeBindings: ['disabled']
});
