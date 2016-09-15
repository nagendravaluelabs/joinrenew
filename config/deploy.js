/* jshint node: true */

module.exports = function(deployTarget) {

  var ENV = {
    build: {
      environment: 'production' // the default
    },
    s3: {
      filePattern: '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,otf,ttf,woff,woff2,html}',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1',
      bucket: 'aia-joinrenew-stg'
    },

    's3-index': {
      allowOverwrite: true,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1',
      bucket: 'aia-joinrenew-stg',
    },

  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    ENV['s3-index'].bucket = 'aia-joinrenew-dev';
    ENV['s3'].bucket = 'aia-joinrenew-dev';
    if (!process.env.AIA_DRUPAL_URL) {
      process.env.AIA_DRUPAL_URL = process.env.DEV_DRUPAL_URL;
    }
    if (!process.env.AIA_SAVE_URL) {
      process.env.AIA_SAVE_URL = process.env.DEV_SAVE_URL;
    }
    if (!process.env.AIA_EMPLOYMENT_LOOKUP_URL) {
      process.env.AIA_EMPLOYMENT_LOOKUP_URL = process.env.DEV_EMPLOYMENT_LOOKUP_URL;
    }
    if (!process.env.AIA_API_URL) {
      process.env.AIA_API_URL = process.env.DEV_JANRAIN_API_URL;
    }
    if (!process.env.AIA_API_CLIENT_ID) {
      process.env.AIA_API_CLIENT_ID = process.env.DEV_JANRAIN_API_CLIENT_ID;
    }
    if (!process.env.AIA_API_SECRET) {
      process.env.AIA_API_SECRET = process.env.DEV_JANRAIN_API_CLIENT_SECRET;
    }

    if (!process.env.AIA_CORS) {
      process.env.AIA_CORS = process.env.CORS_SERVER_URL;
    }
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'staging';
    ENV['s3-index'].bucket = 'aia-joinrenew-stg';
    ENV['s3'].bucket = 'aia-joinrenew-stg';
    if (!process.env.AIA_DRUPAL_URL) {
      process.env.AIA_DRUPAL_URL = process.env.STAGING_DRUPAL_URL;
    }
    if (!process.env.AIA_SAVE_URL) {
      process.env.AIA_SAVE_URL = process.env.STAGING_SAVE_URL;
    }
    if (!process.env.AIA_EMPLOYMENT_LOOKUP_URL) {
      process.env.AIA_EMPLOYMENT_LOOKUP_URL = process.env.STAGING_EMPLOYMENT_LOOKUP_URL;
    }
    if (!process.env.AIA_API_URL) {
      process.env.AIA_API_URL = process.env.STAGING_JANRAIN_API_URL;
    }
    if (!process.env.AIA_API_CLIENT_ID) {
      process.env.AIA_API_CLIENT_ID = process.env.STAGING_JANRAIN_API_CLIENT_ID;
    }
    if (!process.env.AIA_API_SECRET) {
      process.env.AIA_API_SECRET = process.env.STAGING_JANRAIN_API_CLIENT_SECRET;
    }

    if (!process.env.AIA_CORS) {
      process.env.AIA_CORS = process.env.CORS_SERVER_URL;
    }
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV['s3-index'].bucket = 'aia-joinrenew-prod';
    ENV['s3'].bucket = 'aia-joinrenew-prod';
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
