import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  headData: service(),

  setTitle(title) {
    this.get('headData').set('title', title);
  }
});

Router.map(function() {
  this.route('survey', {path: ':id'}, function() {
    this.route('step', {path: ':step'});
    this.route('thank-you');
    this.route('cancel');
    this.route('expired');
  });
});

export default Router;
