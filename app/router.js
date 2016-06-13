import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('sign-up', function(){
    this.route('personal-information');
    this.route('background-information');
    this.route('payment-information');
  });

  this.route('renew'function(){
    this.route('personal-information');
    this.route('background-information');
    this.route('payment-information');
  });
});

export default Router;
