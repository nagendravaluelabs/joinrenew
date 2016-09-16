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
    AIA_NEXT_YEAR: "2017",
    AIA_CORS: process.env.AIA_CORS || "//52.1.198.224/",
    AIA_API_CLIENT_ID: process.env.AIA_API_CLIENT_ID || 'jhxbmd679pv6j3hatb3yz7xdpgtauced',
    AIA_API_SECRET: process.env.AIA_API_SECRET || 'mx3zd27mcvdbkrmnr829cczcvnnr62dq'
  };

  ENV.AIA_SAVE_URL= process.env.AIA_SAVE_URL ? ENV.AIA_CORS+process.env.AIA_SAVE_URL : ENV.AIA_CORS+'http://kbsjoinrenewsu7uhssau2.devcloud.acquia-sites.com/renewjson/update';
  
  ENV.AIA_DRUPAL_URL= (process.env.AIA_DRUPAL_URL) ? ENV.AIA_CORS+process.env.AIA_DRUPAL_URL : ENV.AIA_CORS+'http://kbsjoinrenewsu7uhssau2.devcloud.acquia-sites.com/renewjson/getdata';
  ENV.AIA_API_URL= ENV.AIA_CORS+'https://american-institute-of-architects-dev.us-dev.janraincapture.com';
  ENV.AIA_EMPLOYMENT_LOOKUP_URL= ENV.AIA_CORS+'http://aia-recommend-staging.us-east-1.elasticbeanstalk.com/organizations';

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
//	 AIA_SAVE_URL: process.env.AIA_SAVE_URL || '//kbsjoinrenewsu7uhssau2.devcloud.acquia-sites.com/renewjson/update.php';
//	 AIA_DRUPAL_URL: process.env.AIA_DRUPAL_URL || '//kbsjoinrenewsu7uhssau2.devcloud.acquia-sites.com/renewjson/getdata';
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

  if (environment === 'staging') {
//	 AIA_DRUPAL_URL: process.env.AIA_DRUPAL_URL || '//kbsjoinrenewbkgewmdslx.devcloud.acquia-sites.com/renewjson/getdata';
//	 AIA_SAVE_URL: process.env.AIA_SAVE_URL || '//kbsjoinrenewbkgewmdslx.devcloud.acquia-sites.com/renewjson/update.php';
  }
  if (environment === 'uat') {

  }
  if (environment === 'production') {
  }

  return ENV;
};
