# AIA Join Renew Ember Web Application

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Code Generators

Make use of the many generators for code, try `ember help generate` for more details

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build` (development)
* `ember build --environment production` (production)

## Deploying

To deploy to the app to S3, use the following guide with the following additions:

* Install the ember deploy modules for deploying to S3: `ember install ember-cli-deploy ember-cli-deploy-s3 ember-cli-deploy-s3-index`
* Create your S3 bucket, e.g., aia-travel-dev, then go to the "Properties" tab to complete the configuration.
* Click the "Add bucket policy" and apply the following bucket policy:

```javascript
{
	"Version": "2008-10-17",
	"Statement": [
		{
			"Sid": "",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:*",
			"Resource": [
				"arn:aws:s3:::aia-travel-dev/*",
				"arn:aws:s3:::aia-travel-dev"
			]
		}
	]
}
``` 

* Enable "Static Website Hosting" for your bucket and point Index Document and Error Document to index.html
* Add a deploy.js and environment.js to your Ember config directory:

* #### config/deploy.js

```javascript
var AWS = require('aws-sdk');
const AWS_PROFILE_NAME = 'aia-travel';

process.env.AWS_PROFILE=AWS_PROFILE_NAME;

module.exports = function(deployTarget) {
  var credentials = new AWS.SharedIniFileCredentials({
    profile: AWS_PROFILE_NAME
  });

  var ENV = {
    build: {},
    s3: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      region: 'us-east-1',
      bucket: 'aia-travel-dev'
    },

    's3-index': {
      allowOverwrite: true,
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      region: 'us-east-1',
      bucket: 'aia-travel-dev',
    },

  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'production';
    ENV['s3-index'].bucket = 'aia-travel-dev';

    if (!process.env.AIA_API_URL) {
      process.env.AIA_API_URL = 'http://kbsdrupal8testlk6itumszo.devcloud.acquia-sites.com';
    }
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
```

* #### config/environment.js

```javascript
module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'aia-travel',
    environment: 'development',
    baseURL: '/',
    rootURL: '/',
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
    AIA_DRUPAL_URL: 'http://kbsdrupal8testlk6itumszo.devcloud.acquia-sites.com'
  };
  ENV.typekit = {
        disabled: true
        //kitId: 'kqr5trt'
     };

  if (environment === 'development') {
    ENV.location = 'hash';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.rootURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }
  if (environment === 'production') {
  }
  return ENV;
};
```

* Deploy the app to Development by running: `ember deploy development --activate --verbose`
* Deploy the app to Staging by running: `ember deploy staging --activate --verbose`

## Developers cheat sheet 

### Code Setup

Navigate to current repository. Run following commands to get your code setup and server started

```
* bower install
* ember server
```

### Generating new routes (Pages)

Run the following command 

* `ember generate route route-name` 
* This generates following files necessary for a new route 
* app/routes/route-name.js (route) 
* app/templates/route-name.hbs (view)(used only to render front end data)
* tests/unit/routes/route-name-test.js ( Used for performing automated tests)
* `ember destroy route route-name` to delete existing route.

### Generating new components (header, footer, ... ) 

Run the following command 

* `ember generate component-name`
* components can be rendered in app, using {{component-name}}

### Adapters, Serializers, Models

* Model - Model defines the data structure. This is class from where all Ember data records descend from. 
  * `ember generate model-name` 
* Adapter -  An adapter is an object that receives requests from a store and translates them into the appropriate action. This is where all API calls are made
  * `ember generate adapter adapter-name`
* Serializer - A Serializer is used to serialize and deserialize records when they are transferred in and out of an external source. For this application, we prefer using JSONSerializer as other serializers expect a different JSON format. 
  * `ember generate serializer serializer-name`
	
### Working with ember data 

* To retrieve all the records of a model : 
  * `return this.store.findAll('model-name');`
* To retrieve filtered set of results : 
  * `return this.store.query('model-name', {reload: true}).then(function(tempVariable) {
   return tempVariable.filterBy(key,value);
}); `
* To retieve single record : 
  * `return this.store.query('model-name', {reload: true}).then(function(tempVariable) {
  return tempVariable.findBy(key,value);
 }); `
 
 
### Other guidelines

* Any CSS styling should be stored in 'app/styles' 
* app/router.js contains all routes. Custom paths can be defined in this file
* app/templates/application.hbs - Default template. 
* app/app.js - Don't mess with it!!! 


## Further Reading / Useful Links

* [Prototyping ember app in 20 minutes, by Eric Bryn](https://youtu.be/Hm8XsgKT0Qw)
* [Deploying an Ember JS Application to Amazon S3 Using ember-cli-deploy](http://jarredkenny.com/blog/deploying_an_ember_app_to_s3_using_ember_cli_deploy)

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
