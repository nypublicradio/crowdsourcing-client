import Component from '@ember/component';

export default Component.extend({
  tagName: 'form',
  classNames: ['personal-info'],
  
  submit(e) {
    e.preventDefault();
    if (this.get('onSubmit')) {
      this.get('onSubmit')();
    }
  }
});
