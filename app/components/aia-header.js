import Ember from 'ember';

export default Ember.Component.extend({
  beforeLogin: [{
    name: "Sign in",
    route: "#signin"
  }],
  afterLogin: [{
    name: "Sign out",
    route: "signout"
  }],
  isLoggedin: false
});
