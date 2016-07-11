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

  this.route('renew');
  this.route('renew-verify-membership',{ path: '/renew/renew-verify-membership' });
  this.route('primary-information', {path: '/renew/primary-information' });
  this.route('membership-dues', {path: '/renew/membership-dues' });
  this.route('payment-information', {path: '/renew/payment-information' });  
  this.route('page-not-found', { path: '/*path' });
});

export default Router;
