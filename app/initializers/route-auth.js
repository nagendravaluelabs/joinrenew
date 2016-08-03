import Ember from 'ember';
import inject from 'ember-service/inject';
var AuthMixin = Ember.Mixin.create({
  auth: inject(),
  verfiyUserAuth: function() {
    this.authVerify();
  }.observes("auth.user"),
  beforeModel: function() {
    this.authVerify();
  },
  authVerify: function() {    
    let currenRoute  = this.routeName;
    let authRoutes = ["renew-verify-membership", "primary-information", "membership-dues", "payment-information", "thankyou-page"];
    let nonAuthRoutes = ["renew", "index"];
    if(currenRoute !== "application") {
      if(authRoutes.indexOf(currenRoute) !== -1) {
        if(!this.get("auth").get("user")) {
          localStorage['route'] = currenRoute;
          if(this.get("auth").get("authState") === "logout") {
            this.transitionTo('/renew');
            localStorage['route'] = "";
          } else {
            this.transitionTo('/not-authorized');
          }        
        }
      } else if(nonAuthRoutes.indexOf(currenRoute) !== -1) {
        if(this.get("auth").get("user")) {
          let transitionToRoute = localStorage['route'];
          if(transitionToRoute) {
            this.transitionTo(transitionToRoute);
          } else {
            this.transitionTo("renew-verify-membership");
          }
          localStorage['route'] = "";
        }
      } else if(currenRoute === "not-authorized"){
        if(this.get("auth").get("user")) {
          let transitionToRoute = localStorage['route'];
          if(transitionToRoute) {
            this.transitionTo(transitionToRoute);
            localStorage['route'] = "";
          } else {
            this.transitionTo("renew-verify-membership");
          }
        }
      } else {
        localStorage['route']="";
      }
    }
  }
});
export default ({
  name: 'route-auth',
  initialize() {
    Ember.Route.reopen(AuthMixin);
  }
});
