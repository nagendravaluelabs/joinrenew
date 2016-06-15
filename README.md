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

