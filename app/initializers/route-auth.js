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
      let authUser = this.get("auth").get("user");
      if(authRoutes.indexOf(currenRoute) !== -1) {
        if(!authUser) {
          localStorage['route'] = currenRoute;
          if(this.get("auth").get("authState") === "logout") {
            this.transitionTo('/renew');
            localStorage['route'] = "";
          } else if(this.get("auth").get("authState") === "invalid-invoice") {
            this.transitionTo('/invoice-invalid');
            localStorage['route'] = "";
          } else if(this.get("auth").get("authState") === "no-access") {
            this.transitionTo('/invalid-janrain');
            localStorage['route'] = "";
          } else {
            this.transitionTo('/not-authorized');
          }        
        }
      } else if(nonAuthRoutes.indexOf(currenRoute) !== -1) {
        if(authUser && authUser.access_token !== undefined) {
          let transitionToRoute = localStorage['route'];
          if(transitionToRoute) {
            this.transitionTo(transitionToRoute);
          } else {
            this.transitionTo("renew-verify-membership");
          }
          localStorage['route'] = "";
        } else if(authUser && authUser.indexOf("invalid") !== -1) {
          this.transitionTo("invalid-janrain");
        }
      } else if(currenRoute === "not-authorized" || currenRoute === "invoice-invalid" || currenRoute === "invalid-janrain"){
        if(authUser && authUser.access_token !== undefined) {
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
