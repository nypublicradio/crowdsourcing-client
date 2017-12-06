import Component from '@ember/component';

export default Component.extend({
  classNames: ['escape-modal'],
  location: window.location,
  
  startOver() {
    window.open(window.location.toString());
    window.close();
  }
});
