/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'aia-joinrenew',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    AIA_DRUPAL_URL: process.env.AIA_DRUPAL_URL || '//54.197.6.159/netforum/web/getdata',
    AIA_SAVE_URL: process.env.AIA_SAVE_URL || '//54.197.6.159/netforum/web/update.php',
    AIA_API_URL: 'https://american-institute-of-architects-dev.us-dev.janraincapture.com',
    AIA_API_CLIENT_ID: 'jhxbmd679pv6j3hatb3yz7xdpgtauced',
    AIA_API_SECRET: 'mx3zd27mcvdbkrmnr829cczcvnnr62dq'

  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'staging' || environment === 'production') {

  }

  return ENV;
};
