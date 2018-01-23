/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'crowdsourcing-client',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    audioPollTimeout: 1000,
    crowdsourcingService: process.env.CROWDSOURCING_SERVICE || 'https://api.demo.nypr.digital/crowdsourcing',
    twilioService: process.env.TWILIO_SERVICE || 'https://api.demo.nypr.digital/twilio',
    twilioNumber: process.env.TWILIO_NUMBER || 16464551709,
    emberHifi: {
      connections: [{
        name: 'Howler',
        options: {
          html5: false
        }
      }],
      positionInterval: 100
    },
    goToBadState: process.env.DEPLOY_TARGET === 'demo',
    fastboot: {
      hostWhitelist: [process.env.HOST_WHITELIST]
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['ember-cli-mirage'] = {
      // enabled: false
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.recordingThreshold = 1;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.rootURL = '/crowdsourcing/';
  }

  return ENV;
};
