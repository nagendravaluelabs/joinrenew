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
    if (!process.env.AIA_APP_ID) {
      process.env.AIA_APP_ID = process.env.DEV_JANRAIN_APP_ID;
    }
    if (!process.env.AIA_CAPTURE_SERVER) {
      process.env.AIA_CAPTURE_SERVER = process.env.DEV_JANRAIN_API_URL;
    }
    if (!process.env.AIA_APP_URL) {
      process.env.AIA_APP_URL = process.env.DEV_JANRAIN_APP_URL;
    }
    if (!process.env.AIA_HTTP_URL) {
      process.env.AIA_HTTP_URL = process.env.DEV_JANRAIN_API_HTTP_URL;
    }
    if (!process.env.AIA_HTTPS_URL) {
      process.env.AIA_HTTPS_URL = process.env.DEV_JANRAIN_API_HTTPS_URL;
    }
    if (!process.env.AIA_FEDERATE_SERVER) {
      process.env.AIA_FEDERATE_SERVER = process.env.DEV_JANRAIN_API_FEDERATE_SERVER;
    }
    if (!process.env.AIA_CORS) {
      process.env.AIA_CORS = process.env.CORS_SERVER_URL;
    }
    if (!process.env.GTM_CODE) {
      process.env.GTM_CODE = process.env.DEV_GTM_CODE;
    }
    if (!process.env.CHAPTER_TRANSFER_FORM_LINK) {
      process.env.CHAPTER_TRANSFER_FORM_LINK = process.env.DEV_CHAPTER_TRANSFER_FORM_LINK;
    }
    if (!process.env.ASSOCIATE_TO_ARCHITECT_FORM_LINK) {
      process.env.ASSOCIATE_TO_ARCHITECT_FORM_LINK = process.env.DEV_ASSOCIATE_TO_ARCHITECT_FORM_LINK;
    }
    if (!process.env.MAIL_IN_YOUR_RENEWAL_LINK) {
      process.env.MAIL_IN_YOUR_RENEWAL_LINK = process.env.DEV_MAIL_IN_YOUR_RENEWAL_LINK;
    }
    if (!process.env.BASE_URL) {
      process.env.BASE_URL = process.env.DEV_BASE_URL;
    }
    if (!process.env.SESSION_TIMEOUT) {
      process.env.SESSION_TIMEOUT = process.env.SESSION_TIMEOUT;
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
    if (!process.env.AIA_APP_ID) {
      process.env.AIA_APP_ID = process.env.STAGING_JANRAIN_APP_ID;
    }
    if (!process.env.AIA_CAPTURE_SERVER) {
      process.env.AIA_CAPTURE_SERVER = process.env.STAGING_JANRAIN_API_URL;
    }
    if (!process.env.AIA_APP_URL) {
      process.env.AIA_APP_URL = process.env.STAGING_JANRAIN_APP_URL;
    }
    if (!process.env.AIA_HTTP_URL) {
      process.env.AIA_HTTP_URL = process.env.STAGING_JANRAIN_API_HTTP_URL;
    }
    if (!process.env.AIA_HTTPS_URL) {
      process.env.AIA_HTTPS_URL = process.env.STAGING_JANRAIN_API_HTTPS_URL;
    }
    if (!process.env.AIA_FEDERATE_SERVER) {
      process.env.AIA_FEDERATE_SERVER = process.env.STAGING_JANRAIN_API_FEDERATE_SERVER;
    }
    if (!process.env.AIA_CORS) {
      process.env.AIA_CORS = process.env.CORS_SERVER_URL;
    }
    if (!process.env.GTM_CODE) {
      process.env.GTM_CODE = process.env.STAGING_GTM_CODE;
    }
    if (!process.env.CHAPTER_TRANSFER_FORM_LINK) {
      process.env.CHAPTER_TRANSFER_FORM_LINK = process.env.STAGING_CHAPTER_TRANSFER_FORM_LINK;
    }
    if (!process.env.ASSOCIATE_TO_ARCHITECT_FORM_LINK) {
      process.env.ASSOCIATE_TO_ARCHITECT_FORM_LINK = process.env.STAGING_ASSOCIATE_TO_ARCHITECT_FORM_LINK;
    }
    if (!process.env.MAIL_IN_YOUR_RENEWAL_LINK) {
      process.env.MAIL_IN_YOUR_RENEWAL_LINK = process.env.STAGING_MAIL_IN_YOUR_RENEWAL_LINK;
    }
    if (!process.env.BASE_URL) {
      process.env.BASE_URL = process.env.STG_BASE_URL;
    }
    if (!process.env.SESSION_TIMEOUT) {
      process.env.SESSION_TIMEOUT = process.env.SESSION_TIMEOUT;
    }
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV['s3-index'].bucket = 'aia-joinrenew-prod';
    ENV['s3'].bucket = 'aia-joinrenew-prod';
    if (!process.env.AIA_DRUPAL_URL) {
      process.env.AIA_DRUPAL_URL = process.env.PROD_DRUPAL_URL;
    }
    if (!process.env.AIA_SAVE_URL) {
      process.env.AIA_SAVE_URL = process.env.PROD_SAVE_URL;
    }
    if (!process.env.AIA_EMPLOYMENT_LOOKUP_URL) {
      process.env.AIA_EMPLOYMENT_LOOKUP_URL = process.env.PROD_EMPLOYMENT_LOOKUP_URL;
    }
    if (!process.env.AIA_API_URL) {
      process.env.AIA_API_URL = process.env.PROD_JANRAIN_API_URL;
    }
    if (!process.env.AIA_API_CLIENT_ID) {
      process.env.AIA_API_CLIENT_ID = process.env.PROD_JANRAIN_API_CLIENT_ID;
    }
    if (!process.env.AIA_APP_ID) {
      process.env.AIA_APP_ID = process.env.PROD_JANRAIN_APP_ID;
    }
    if (!process.env.AIA_CAPTURE_SERVER) {
      process.env.AIA_CAPTURE_SERVER = process.env.PROD_JANRAIN_API_URL;
    }
    if (!process.env.AIA_APP_URL) {
      process.env.AIA_APP_URL = process.env.PROD_JANRAIN_APP_URL;
    }
    if (!process.env.AIA_HTTP_URL) {
      process.env.AIA_HTTP_URL = process.env.PROD_JANRAIN_API_HTTP_URL;
    }
    if (!process.env.AIA_HTTPS_URL) {
      process.env.AIA_HTTPS_URL = process.env.PROD_JANRAIN_API_HTTPS_URL;
    }
    if (!process.env.AIA_FEDERATE_SERVER) {
      process.env.AIA_FEDERATE_SERVER = process.env.PROD_JANRAIN_API_FEDERATE_SERVER;
    }
    if (!process.env.AIA_CORS) {
      process.env.AIA_CORS = process.env.CORS_SERVER_URL;
    }
    if (!process.env.GTM_CODE) {
      process.env.GTM_CODE = process.env.STAGING_GTM_CODE;
    }
    if (!process.env.CHAPTER_TRANSFER_FORM_LINK) {
      process.env.CHAPTER_TRANSFER_FORM_LINK = process.env.STAGING_CHAPTER_TRANSFER_FORM_LINK;
    }
    if (!process.env.ASSOCIATE_TO_ARCHITECT_FORM_LINK) {
      process.env.ASSOCIATE_TO_ARCHITECT_FORM_LINK = process.env.STAGING_ASSOCIATE_TO_ARCHITECT_FORM_LINK;
    }
    if (!process.env.MAIL_IN_YOUR_RENEWAL_LINK) {
      process.env.MAIL_IN_YOUR_RENEWAL_LINK = process.env.STAGING_MAIL_IN_YOUR_RENEWAL_LINK;
    }
    if (!process.env.BASE_URL) {
      process.env.BASE_URL = process.env.PROD_BASE_URL;
    }
    if (!process.env.SESSION_TIMEOUT) {
      process.env.SESSION_TIMEOUT = process.env.SESSION_TIMEOUT;
    }
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
