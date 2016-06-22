import Ember from 'ember';

export default Ember.Component.extend({
  isLoggedin: false,
  actions: {
    signIn: function() {
      this.set("isLoggedin", true);
      this.get('router').transitionTo('renew-verify-membership');
    },
    signOut: function() {
      this.set("isLoggedin", false);
      this.get('router').transitionTo('index');
    }
  }
});
