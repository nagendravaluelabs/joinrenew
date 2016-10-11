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
      },
      JANRAIN: {
        AIA_API_CLIENT_ID: process.env.AIA_API_CLIENT_ID,
        AIA_API_SECRET: process.env.AIA_API_SECRET,
        AIA_APP_ID: process.env.AIA_APP_ID,
        AIA_CAPTURE_SERVER: process.env.AIA_CAPTURE_SERVER,
        AIA_APP_URL: process.env.AIA_APP_URL,
        AIA_HTTP_URL: process.env.AIA_HTTP_URL,
        AIA_HTTPS_URL: process.env.AIA_HTTPS_URL,
        AIA_FEDERATE_SERVER: process.env.AIA_FEDERATE_SERVER,
        AIA_ENVIRONMENT: environment
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    AIA_NEXT_YEAR: "2017",
    AIA_CORS: process.env.AIA_CORS,
    'ember-cli-gtm': {
      appId: process.env.GTM_CODE
    },
    MAIL_IN_YOUR_RENEWAL_LINK: process.env.MAIL_IN_YOUR_RENEWAL_LINK,
    ASSOCIATE_TO_ARCHITECT_FORM_LINK: process.env.ASSOCIATE_TO_ARCHITECT_FORM_LINK,
    CHAPTER_TRANSFER_FORM_LINK: process.env.CHAPTER_TRANSFER_FORM_LINK,
  };

  ENV.AIA_SAVE_URL= process.env.AIA_SAVE_URL ? ENV.AIA_CORS+process.env.AIA_SAVE_URL : process.env.AIA_SAVE_URL;
  ENV.AIA_DRUPAL_URL= (process.env.AIA_DRUPAL_URL) ? ENV.AIA_CORS+process.env.AIA_DRUPAL_URL : process.env.AIA_DRUPAL_URL;
  ENV.AIA_API_URL= ENV.AIA_CORS+ENV.EmberENV.JANRAIN.AIA_CAPTURE_SERVER;
  ENV.AIA_EMPLOYMENT_LOOKUP_URL= ENV.AIA_CORS+'http://aia-recommend-staging.us-east-1.elasticbeanstalk.com/organizations';

  ENV.AIA_API_CLIENT_ID= ENV.EmberENV.JANRAIN.AIA_API_CLIENT_ID;
  ENV.AIA_API_SECRET= ENV.EmberENV.JANRAIN.AIA_API_SECRET;
  if (environment === 'development') {

  }
  if (environment === 'local') {
    ENV.EmberENV.JANRAIN = {
      AIA_API_CLIENT_ID: "6tckqu9wenqesa2fkk5ukhuewudupvyv",
      AIA_API_SECRET: "gtcqvnnz2f4mdvukhvy2t32smdwj4wbs",
      AIA_APP_ID: "6u2cx5favu7vq3tgc892r67rey",
      AIA_CAPTURE_SERVER: "https://american-institute-of-architects-dev.us-dev.janraincapture.com",
      AIA_APP_URL: "https://american-institute-of-architects-dev.rpxnow.com",
      AIA_HTTP_URL: "http://d29usylhdk1xyu.cloudfront.net/load/american-institute-of-architects-dev",
      AIA_HTTPS_URL: "https://d29usylhdk1xyu.cloudfront.net/load/american-institute-of-architects-dev",
      AIA_FEDERATE_SERVER: "https://american-institute-of-architects-dev.us.janrainsso.com",
      AIA_ENVIRONMENT: "local"
    };
    ENV.AIA_CORS = "//52.1.198.224/";
    ENV['ember-cli-gtm'].appId = "GTM-NDWGK2";
    ENV.MAIL_IN_YOUR_RENEWAL_LINK = "https://aia.hbp.com/assets/pdf/";
    ENV.ASSOCIATE_TO_ARCHITECT_FORM_LINK = "http://aiad8.prod.acquia-sites.com/sites/default/files/2016-09/2016%20Associate%20to%20Architect%20Form.pdf ";
    ENV.CHAPTER_TRANSFER_FORM_LINK = "http://aiad8.prod.acquia-sites.com/sites/default/files/2016-09/2016%20Transfer%20Form.pdf";
    ENV.AIA_SAVE_URL = ENV.AIA_CORS+"http://aiad8dev.prod.acquia-sites.com/renewjson/update";
    ENV.AIA_DRUPAL_URL = ENV.AIA_CORS+"http://aiad8dev.prod.acquia-sites.com/renewjson/getdata";
    ENV.AIA_API_URL = ENV.AIA_CORS+ENV.EmberENV.JANRAIN.AIA_CAPTURE_SERVER;
    ENV.AIA_EMPLOYMENT_LOOKUP_URL = ENV.AIA_CORS+'http://aia-recommend-staging.us-east-1.elasticbeanstalk.com/organizations';
    ENV.AIA_API_CLIENT_ID = ENV.EmberENV.JANRAIN.AIA_API_CLIENT_ID;
    ENV.AIA_API_SECRET = ENV.EmberENV.JANRAIN.AIA_API_SECRET;
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
