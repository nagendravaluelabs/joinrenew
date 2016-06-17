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
  this.route('primary-information', {path: '/renew/primary-information' });
  this.route('membership-dues', {path: '/renew/membership-dues' });
  this.route('payment-information', {path: '/renew/payment-information' });
  this.route('membership-dues', {path: '/renew/membership-dues' });
});

export default Router;
