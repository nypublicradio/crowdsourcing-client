import config from '../config/environment';

export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
  */
  
  // this audio file is served by the express server configured for development in the /server directory
  // see the /status rule below
  // NOTE this must come first because we can't reset the urlPrefix value to an empty string
  this.passthrough('/static/silence.mp3');
  
  this.passthrough('https://media.twiliocdn.com/**');
  this.passthrough('https://eventgw.twilio.com/**');
  this.passthrough('https://api.demo.nypr.digital/twilio/token');
  // this.passthrough(`${config.crowdsourcingService}/**`);
  this.passthrough(`${config.twilioService}/**`);
  this.passthrough('https://demo-apps.nypr.org/**');

  this.urlPrefix = config.crowdsourcingService;
  this.get('/survey/:id', 'survey');
  this.post('/submission');
  
  this.urlPrefix = config.twilioService;
  // in development just point to a local static asset
  this.get('/status', {toListen: '/static/silence.mp3'});
}

export function testConfig() {
  this.get(`${config.twilioService}/token`, {token: 'foo'});
}
