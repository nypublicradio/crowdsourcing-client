import Route from '@ember/routing/route';

export default Route.extend({
  title: tokens => tokens.join(' ')
});
