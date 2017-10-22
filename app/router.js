import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('survey', {path: ':id'}, function() {
    this.route('step', {path: ':step'});
    this.route('thank-you');
    this.route('cancel');
  });
});

export default Router;
