import Component from '@ember/component';

export default Component.extend({
  tagName:           'button',
  classNameBindings: ['hollow:action-button--hollow:action-button'],
  attributeBindings: ['disabled', 'data-action', 'data-label'],
});
