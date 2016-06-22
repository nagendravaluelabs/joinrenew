import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    signIn: function() {
      //this.controllerFor("aia-header").set("model.isLoggedin", true);
      this.get('router').transitionTo('renew-verify-membership');
    }
  }
});
